import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../constants/theme";

export default function RecommendationCard({ recommendation }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>AI Recommendation</Text>

      <Text style={styles.text}>
        {recommendation || "No recommendation generated yet."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colours.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colours.border,
  },
  title: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "700",
    color: theme.colours.text,
    marginBottom: theme.spacing.sm,
  },
  text: {
    fontSize: theme.fontSize.body,
    color: theme.colours.text,
    lineHeight: 22,
  },
});