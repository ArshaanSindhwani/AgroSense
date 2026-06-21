import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

import { theme } from "../../constants/theme";

function getFieldCoordinates(field) {
  const latitude =
    field?.coordinates?.latitude ||
    field?.locationCoordinates?.latitude ||
    field?.latitude;

  const longitude =
    field?.coordinates?.longitude ||
    field?.locationCoordinates?.longitude ||
    field?.longitude;

  if (!latitude || !longitude) {
    return null;
  }

  return {
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
}

function buildMapHtml({ latitude, longitude, fieldName }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
  <style>
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <script>
    const latitude = ${latitude};
    const longitude = ${longitude};
    const fieldName = ${JSON.stringify(fieldName || "Field")};

    const map = L.map("map", {
      zoomControl: true,
      attributionControl: true
    }).setView([latitude, longitude], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(fieldName)
      .openPopup();
  </script>
</body>
</html>
`;
}

export default function FieldLocationMap({ field }) {
  const coordinates = getFieldCoordinates(field);

  if (!field) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.title}>Field Map</Text>
        <Text style={styles.emptyText}>
          Add or select a field to view its postcode location on the map.
        </Text>
      </View>
    );
  }

  if (!coordinates) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.title}>Field Map</Text>
        <Text style={styles.emptyText}>
          This field does not have saved coordinates yet.
        </Text>
      </View>
    );
  }

  const html = buildMapHtml({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    fieldName: field.name,
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Field Map</Text>
        <Text style={styles.subtitle}>
          Showing location for {field.name || "selected field"}.
        </Text>
      </View>

      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={styles.map}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colours.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colours.border,
    overflow: "hidden",
    marginBottom: theme.spacing.md,
  },
  emptyCard: {
    backgroundColor: theme.colours.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colours.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  header: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "700",
    color: theme.colours.text,
  },
  subtitle: {
    fontSize: theme.fontSize.small,
    color: theme.colours.mutedText,
    marginTop: 4,
  },
  emptyText: {
    fontSize: theme.fontSize.body,
    color: theme.colours.mutedText,
    marginTop: theme.spacing.sm,
  },
  map: {
    width: "100%",
    height: 220,
  },
});