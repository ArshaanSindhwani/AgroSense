import { API_CONFIG } from "../../utils/config";

function getApiKey() {
  return API_CONFIG.agroMonitoringApiKey;
}

export function createSimplePolygon(latitude, longitude) {
  const offset = 0.001;

  return [
    [longitude - offset, latitude - offset],
    [longitude + offset, latitude - offset],
    [longitude + offset, latitude + offset],
    [longitude - offset, latitude + offset],
    [longitude - offset, latitude - offset],
  ];
}

export async function createAgroPolygon(fieldName, latitude, longitude) {
  const apiKey = getApiKey();

  if (!apiKey) {
    return null;
  }

  const polygon = createSimplePolygon(latitude, longitude);

  const response = await fetch(
    `${API_CONFIG.agroMonitoringBaseUrl}/polygons?appid=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fieldName,
        geo_json: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [polygon],
          },
        },
      }),
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return {
    polygonId: data.id,
    area: data.area,
  };
}
