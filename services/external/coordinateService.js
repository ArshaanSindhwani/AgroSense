import { API_CONFIG } from "../../utils/config";
import { cleanPostcode, isValidPostcode } from "../../utils/helpers";

export async function getCoordinatesFromPostcode(postcode) {
  if (!isValidPostcode(postcode)) {
    throw new Error("Please enter a valid UK postcode.");
  }

  const formattedPostcode = encodeURIComponent(cleanPostcode(postcode));

  const response = await fetch(
    `${API_CONFIG.postcodesBaseUrl}/postcodes/${formattedPostcode}`,
  );

  const data = await response.json();

  if (!response.ok || !data.result) {
    throw new Error("Could not find this postcode.");
  }

  return {
    postcode: data.result.postcode,
    latitude: data.result.latitude,
    longitude: data.result.longitude,
    location: data.result.admin_district || data.result.region || "Unknown",
  };
}
