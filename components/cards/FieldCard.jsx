import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../constants/theme";

export function FieldCard({ field, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Ionicons name="leaf" size={22} color={theme.colours.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{field.name}</Text>
        <Text style={styles.crop}>{field.cropType || "No crop set"}</Text>
        {!!field.areaAcres && (
          <Text style={styles.area}>{field.areaAcres} acres</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colours.mutedText} />
    </TouchableOpacity>
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
  name: {
    fontSize: theme.fontSize.body,
    fontWeight: "600",
    color: theme.colours.text,
    marginBottom: 2,
  },
  crop: {
    fontSize: theme.fontSize.small,
    color: theme.colours.mutedText,
  },
  area: {
    fontSize: theme.fontSize.small,
    color: theme.colours.mutedText,
    marginTop: 2,
  },
});
