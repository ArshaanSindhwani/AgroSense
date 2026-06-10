import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>AgroSense</Text>

      <Text style={styles.title}>AI Crop Intelligence</Text>

      <Text style={styles.subtitle}>
        Helping small farms log field observations, monitor conditions, and
        receive AI-powered crop recommendations.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#F4F8F2",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#DDEEDC",
    color: "#1F4D2B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: "700",
    marginBottom: 18,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1F4D2B",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#3F5F46",
    lineHeight: 24,
  },
});