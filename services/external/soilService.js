import { getWeatherData } from "./weatherService";

export async function getSoilData(latitude, longitude, soilType = "") {
  const weatherData = await getWeatherData(latitude, longitude);

  return {
    soilType,
    soilTemperature: weatherData.soilTemperature,
    soilMoisture: weatherData.soilMoisture,
  };
}
