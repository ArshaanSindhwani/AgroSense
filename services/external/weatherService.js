import { API_CONFIG } from "../../utils/config";

export async function getWeatherData(latitude, longitude) {
  const variables = [
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "wind_speed_10m",
    "soil_temperature_0cm",
    "soil_moisture_0_to_1cm",
  ].join(",");

  const url =
    `${API_CONFIG.openMeteoBaseUrl}/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&hourly=${variables}` +
    `&timezone=auto` +
    `&forecast_days=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not fetch weather data.");
  }

  const data = await response.json();
  const hourly = data.hourly;

  return {
    temperature: hourly.temperature_2m?.[0],
    humidity: hourly.relative_humidity_2m?.[0],
    rainfall: hourly.precipitation?.[0],
    windSpeed: hourly.wind_speed_10m?.[0],
    soilTemperature: hourly.soil_temperature_0cm?.[0],
    soilMoisture: hourly.soil_moisture_0_to_1cm?.[0],
    time: hourly.time?.[0],
  };
}
