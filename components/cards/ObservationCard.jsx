import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../constants/theme";

const GROWTH_ICONS = {
  Seedling: "leaf-outline",
  Vegetative: "leaf",
  Flowering: "flower-outline",
  Harvest: "basket-outline",
};

export function ObservationCard({ observation, fieldName, onDelete }) {
  const icon = GROWTH_ICONS[observation.growthStage] ?? "eye-outline";

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={22} color={theme.colours.primary} />
      </View>
      <View style={styles.info}>
        {!!fieldName && (
          <Text style={styles.fieldName}>{fieldName}</Text>
        )}
        {!!observation.growthStage && (
          <Text style={styles.stage}>{observation.growthStage}</Text>
        )}
        {!!observation.pestSighting && (
          <Text style={styles.tag}>Pest: {observation.pestSighting}</Text>
        )}
        {!!observation.soilCondition && (
          <Text style={styles.tag}>Soil: {observation.soilCondition}</Text>
        )}
        {!!observation.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {observation.notes}
          </Text>
        )}
      </View>
      {!!onDelete && (
        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="trash-outline" size={20} color={theme.colours.danger} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colours.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colours.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colours.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  info: {
    flex: 1,
  },
  fieldName: {
    fontSize: theme.fontSize.small,
    color: theme.colours.mutedText,
    marginBottom: 2,
  },
  stage: {
    fontSize: theme.fontSize.body,
    fontWeight: "600",
    color: theme.colours.text,
    marginBottom: 2,
  },
  tag: {
    fontSize: theme.fontSize.small,
    color: theme.colours.secondary,
    marginTop: 2,
  },
  notes: {
    fontSize: theme.fontSize.small,
    color: theme.colours.mutedText,
    marginTop: 4,
  },
});
