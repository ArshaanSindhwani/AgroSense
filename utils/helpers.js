export function cleanPostcode(postcode) {
  return postcode.trim().toUpperCase();
}

export function isValidPostcode(postcode) {
  return Boolean(postcode && postcode.trim().length >= 5);
}

export function formatUnknown(value) {
  if (value === null || value === undefined || value === "") {
    return "Unknown";
  }

  return value;
}
