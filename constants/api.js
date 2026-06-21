export const POSTCODES_BASE_URL =
  process.env.EXPO_PUBLIC_POSTCODES_BASE_URL ||
  "https://api.postcodes.io";

export const OPEN_METEO_BASE_URL =
  process.env.EXPO_PUBLIC_OPEN_METEO_BASE_URL ||
  "https://api.open-meteo.com/v1";

export const AGROMONITORING_BASE_URL =
  process.env.EXPO_PUBLIC_AGROMONITORING_BASE_URL ||
  "https://api.agromonitoring.com/agro/1.0";

export const AGROMONITORING_API_KEY =
  process.env.EXPO_PUBLIC_AGROMONITORING_API_KEY || "";

export const GEMINI_API_KEY =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

export const GEMINI_MODEL =
  process.env.EXPO_PUBLIC_GEMINI_MODEL ||
  "gemini-2.5-flash";