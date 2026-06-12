export const API_CONFIG = {
  postcodesBaseUrl:
    process.env.EXPO_PUBLIC_POSTCODES_BASE_URL || "https://api.postcodes.io",

  openMeteoBaseUrl:
    process.env.EXPO_PUBLIC_OPEN_METEO_BASE_URL ||
    "https://api.open-meteo.com/v1",

  agroMonitoringBaseUrl:
    process.env.EXPO_PUBLIC_AGROMONITORING_BASE_URL ||
    "https://api.agromonitoring.com/agro/1.0",

  agroMonitoringApiKey: process.env.EXPO_PUBLIC_AGROMONITORING_API_KEY || "",

  geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || "",

  geminiModel: process.env.EXPO_PUBLIC_GEMINI_MODEL || "gemini-2.5-flash",
};