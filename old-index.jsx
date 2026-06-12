import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.badge}>AgroSense</Text>

        <Text style={styles.title}>AI Crop Intelligence</Text>

        <Text style={styles.subtitle}>
          Helping small farms log field observations, monitor weather and soil
          conditions, and receive AI-powered crop recommendations.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>MVP Features</Text>
        <Text style={styles.cardText}>• Add and manage farm fields</Text>
        <Text style={styles.cardText}>• Log crop observations offline</Text>
        <Text style={styles.cardText}>• View weather-informed insights</Text>
        <Text style={styles.cardText}>• Generate AI crop recommendations</Text>
      </View>

      <View style={styles.actions}>
        <Link href="/add-field" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Add Field</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/add-observation" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Log Observation</Text>
          </TouchableOpacity>
        </Link>
      </View>
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
  hero: {
    marginBottom: 24,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#DDEEDC",
    color: "#1F4D2B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 14,
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#DDEEDC",
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F4D2B",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 15,
    color: "#3F5F46",
    marginBottom: 6,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#1F4D2B",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F4D2B",
  },
  secondaryButtonText: {
    color: "#1F4D2B",
    fontSize: 16,
    fontWeight: "700",
  },
});