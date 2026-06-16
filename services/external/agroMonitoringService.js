import {
  AGROMONITORING_BASE_URL,
  AGROMONITORING_API_KEY,
} from "../../constants/api";

export async function createAgroPolygon(fieldName, latitude, longitude) {
  try {
    if (!AGROMONITORING_API_KEY) {
      console.log("AgroMonitoring API key missing");
      return null;
    }

    const offset = 0.005;

    const polygon = {
      name: fieldName,
      geo_json: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [longitude - offset, latitude - offset],
              [longitude + offset, latitude - offset],
              [longitude + offset, latitude + offset],
              [longitude - offset, latitude + offset],
              [longitude - offset, latitude - offset],
            ],
          ],
        },
      },
    };

    const response = await fetch(
      `${AGROMONITORING_BASE_URL}/polygons?appid=${AGROMONITORING_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(polygon),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (data?.message?.includes("duplicated")) {
        const match = data.message.match(/'([^']+)'/);
        const polygonId = match ? match[1] : null;

        return {
          polygonId,
          name: fieldName,
          area: null,
          duplicated: true,
        };
      }

      console.log("AgroMonitoring error:", data);
      return null;
    }

    return {
      polygonId: data.id,
      name: data.name,
      area: data.area,
      center: data.center,
      duplicated: false,
    };
  } catch (error) {
    console.log("AgroMonitoring failed:", error.message);
    return null;
  }
}