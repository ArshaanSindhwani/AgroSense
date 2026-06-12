import { API_CONFIG } from "../../utils/config";
import { formatUnknown } from "../../utils/helpers";

function buildPrompt({
  fieldName,
  cropType,
  growthStage,
  notes,
  pestSightings,
  diseaseSightings,
  weatherData,
  soilData,
}) {
  return `
You are an agricultural assistant for a UK farming mobile app.
Use the information below to provide a practical farming recommendation.

Field: ${formatUnknown(fieldName)}
Crop: ${formatUnknown(cropType)}
Growth stage: ${formatUnknown(growthStage)}

Farmer notes:
${formatUnknown(notes)}

Pest sightings:
${formatUnknown(pestSightings)}

Disease sightings:
${formatUnknown(diseaseSightings)}

Weather:
Temperature: ${formatUnknown(weatherData?.temperature)}°C
Humidity: ${formatUnknown(weatherData?.humidity)}%
Rainfall: ${formatUnknown(weatherData?.rainfall)}mm
Wind speed: ${formatUnknown(weatherData?.windSpeed)} km/h

Soil:
Soil type: ${formatUnknown(soilData?.soilType)}
Soil temperature: ${formatUnknown(soilData?.soilTemperature)}°C
Soil moisture: ${formatUnknown(soilData?.soilMoisture)}

Return the response using this format:

Main risk:
Recommended action:
What to monitor next:

Keep it short, clear, and practical.
Do not invent missing information.
`;
}

export async function generateRecommendation(input) {
  if (!API_CONFIG.geminiApiKey) {
    throw new Error("Gemini API key is missing.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${API_CONFIG.geminiModel}:generateContent?key=${API_CONFIG.geminiApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: buildPrompt(input),
              },
            ],
          },
        ],
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Could not generate recommendation.",
    );
  }

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No recommendation was generated."
  );
}
