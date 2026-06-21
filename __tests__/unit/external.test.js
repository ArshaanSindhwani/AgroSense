import { getWeatherData } from "../../services/external/weatherService";
import * as weatherServiceModule from "../../services/external/weatherService";
import { getCoordinatesFromPostcode } from "../../services/external/coordinateService";
import { getSoilData } from "../../services/external/soilService";
import { createAgroPolygon } from "../../services/external/agroMonitoringService";

// ─── Mock setup ──────────────────────────────────────────────────────────────

const mockFetch = jest.fn();
global.fetch = mockFetch;

const makeResponse = (ok, data) => ({
  ok,
  json: jest.fn().mockResolvedValueOnce(data),
});

beforeEach(() => jest.clearAllMocks());

// ─── getWeatherData ───────────────────────────────────────────────────────────

describe("getWeatherData", () => {
  const LAT = 51.5;
  const LON = -0.12;

  const mockHourly = {
    temperature_2m:         [18.5],
    relative_humidity_2m:   [72],
    precipitation:          [0.2],
    wind_speed_10m:         [14.3],
    soil_temperature_0cm:   [12.1],
    soil_moisture_0_to_1cm: [0.35],
    time:                   ["2026-06-15T00:00"],
  };

  it("calls the Open-Meteo forecast endpoint with correct coordinates", async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(true, { hourly: mockHourly }));

    await getWeatherData(LAT, LON);

    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain(`latitude=${LAT}`);
    expect(url).toContain(`longitude=${LON}`);
    expect(url).toContain("/forecast");
  });

  it("returns mapped weather fields from the first hourly entry", async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(true, { hourly: mockHourly }));

    const result = await getWeatherData(LAT, LON);

    expect(result).toEqual({
      temperature:     18.5,
      humidity:        72,
      rainfall:        0.2,
      windSpeed:       14.3,
      soilTemperature: 12.1,
      soilMoisture:    0.35,
      time:            "2026-06-15T00:00",
    });
  });

  it("throws when the API responds with a non-ok status", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: jest.fn() });

    await expect(getWeatherData(LAT, LON)).rejects.toThrow(
      "Could not fetch weather data."
    );
  });

  it("handles missing hourly fields gracefully", async () => {
    mockFetch.mockResolvedValueOnce(
      makeResponse(true, { hourly: { temperature_2m: [22] } })
    );

    const result = await getWeatherData(LAT, LON);

    expect(result.temperature).toBe(22);
    expect(result.humidity).toBeUndefined();
    expect(result.rainfall).toBeUndefined();
  });

  it("requests all required weather variables in the URL", async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(true, { hourly: mockHourly }));

    await getWeatherData(LAT, LON);

    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("temperature_2m");
    expect(url).toContain("relative_humidity_2m");
    expect(url).toContain("precipitation");
    expect(url).toContain("wind_speed_10m");
    expect(url).toContain("soil_temperature_0cm");
    expect(url).toContain("soil_moisture_0_to_1cm");
  });
});

// ─── getCoordinatesFromPostcode ───────────────────────────────────────────────

describe("getCoordinatesFromPostcode", () => {
  const mockResult = {
    postcode:       "UB4 8SH",
    latitude:       51.529,
    longitude:      -0.403,
    admin_district: "Hillingdon",
    region:         "London",
  };

  it("returns mapped coordinates for a valid postcode", async () => {
    mockFetch.mockResolvedValueOnce(
      makeResponse(true, { result: mockResult })
    );

    const result = await getCoordinatesFromPostcode("UB4 8SH");

    expect(result).toEqual({
      postcode:  "UB4 8SH",
      latitude:  51.529,
      longitude: -0.403,
      location:  "Hillingdon",
    });
  });

  it("calls the postcodes.io API with the uppercased formatted postcode", async () => {
    mockFetch.mockResolvedValueOnce(
      makeResponse(true, { result: mockResult })
    );

    await getCoordinatesFromPostcode("ub4 8sh");

    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("/postcodes/");
    expect(url).toContain("UB4%208SH");
  });

  it("throws for a postcode that is too short to be valid", async () => {
    await expect(getCoordinatesFromPostcode("AB1")).rejects.toThrow(
      "Please enter a valid UK postcode."
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("throws when the API returns a non-ok response", async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(false, { result: null }));

    await expect(getCoordinatesFromPostcode("ZZ99 9ZZ")).rejects.toThrow(
      "Could not find this postcode."
    );
  });

  it("throws when the API returns ok but result is null", async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(true, { result: null }));

    await expect(getCoordinatesFromPostcode("ZZ99 9ZZ")).rejects.toThrow(
      "Could not find this postcode."
    );
  });

  it("falls back to region when admin_district is missing", async () => {
    mockFetch.mockResolvedValueOnce(
      makeResponse(true, { result: { ...mockResult, admin_district: null } })
    );

    const result = await getCoordinatesFromPostcode("UB4 8SH");

    expect(result.location).toBe("London");
  });
});

// ─── getSoilData ─────────────────────────────────────────────────────────────

describe("getSoilData", () => {
  let weatherSpy;

  beforeEach(() => {
    weatherSpy = jest.spyOn(weatherServiceModule, "getWeatherData");
  });

  afterEach(() => {
    weatherSpy.mockRestore();
  });

  it("returns soilType, soilTemperature and soilMoisture from weather data", async () => {
    weatherSpy.mockResolvedValueOnce({ soilTemperature: 12.1, soilMoisture: 0.35 });

    const result = await getSoilData(51.5, -0.12, "Clay");

    expect(result).toEqual({
      soilType:        "Clay",
      soilTemperature: 12.1,
      soilMoisture:    0.35,
    });
  });

  it("calls getWeatherData with the correct coordinates", async () => {
    weatherSpy.mockResolvedValueOnce({ soilTemperature: 10, soilMoisture: 0.2 });

    await getSoilData(51.5, -0.12, "Sandy");

    expect(weatherSpy).toHaveBeenCalledWith(51.5, -0.12);
  });

  it("defaults soilType to empty string when not provided", async () => {
    weatherSpy.mockResolvedValueOnce({ soilTemperature: 10, soilMoisture: 0.2 });

    const result = await getSoilData(51.5, -0.12);

    expect(result.soilType).toBe("");
  });
});

// ─── createAgroPolygon ────────────────────────────────────────────────────────

describe("createAgroPolygon", () => {
  it("returns null immediately when no API key is configured", async () => {
    const result = await createAgroPolygon("North Field", 51.5, -0.12);

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it("returns null when the API responds with a non-ok status", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: jest.fn() });

    const result = await createAgroPolygon("North Field", 51.5, -0.12);

    expect(result).toBeNull();
  });
});