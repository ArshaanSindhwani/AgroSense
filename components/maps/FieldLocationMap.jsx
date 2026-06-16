import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

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

  const region = {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Field Map</Text>
        <Text style={styles.subtitle}>
          Showing location for {field.name || "selected field"}.
        </Text>
      </View>

      <MapView style={styles.map} initialRegion={region} region={region}>
        <Marker
          coordinate={coordinates}
          title={field.name || "Field"}
          description={field.postcode || field.cropType || "Saved field"}
        />
      </MapView>
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