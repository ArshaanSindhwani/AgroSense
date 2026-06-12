import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";

import { getCoordinatesFromPostcode } from "../../services/external/coordinateService";
import { getWeatherData } from "../../services/external/weatherService";
import { getSoilData } from "../../services/external/soilService";
import { createAgroPolygon } from "../../services/external/agroMonitoringService";
import { generateRecommendation } from "../../services/ai/recommendationService";

export default function SettingsScreen() {
  const { user, logout } = useAuthContext();

  async function testApis() {
    try {
      const coordinates = await getCoordinatesFromPostcode("UB4 8SH");
      console.log("Coordinates:", coordinates);

      const weather = await getWeatherData(
        coordinates.latitude,
        coordinates.longitude
      );
      console.log("Weather:", weather);

      const soil = await getSoilData(
        coordinates.latitude,
        coordinates.longitude,
        "Clay"
      );
      console.log("Soil:", soil);

      const agro = await createAgroPolygon(
        "Test Field",
        coordinates.latitude,
        coordinates.longitude
      );
      console.log("AgroMonitoring:", agro);

      const recommendation = await generateRecommendation({
        fieldName: "Test Field",
        cropType: "Wheat",
        growthStage: "Early growth",
        pestSightings: "Aphids",
        diseaseSightings: "None",
        notes: "Leaves look slightly yellow.",
        weatherData: weather,
        soilData: soil,
      });

      console.log("Gemini recommendation:", recommendation);

      Alert.alert("API test complete", "Check the Metro terminal logs.");
    } catch (error) {
      console.log("API test failed:", error.message);
      Alert.alert("API test failed", error.message);
    }
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.log("Failed to logout:", error);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="person" size={32} color={theme.colours.primary} />
        </View>

        <Text style={styles.name}>{user?.displayName || "Farmer"}</Text>

        {!!user?.email && <Text style={styles.email}>{user.email}</Text>}
      </View>

      <View style={styles.card}>
        <SettingsRow
          icon="mail-outline"
          label="Email"
          value={user?.email || "—"}
        />

        <SettingsRow
          icon="key-outline"
          label="User ID"
          value={user?.uid ? `${user.uid.slice(0, 8)}…` : "—"}
        />
      </View>

      <TouchableOpacity
        style={styles.testButton}
        onPress={testApis}
        activeOpacity={0.85}
      >
        <Ionicons name="flask-outline" size={18} color="#FFFFFF" />
        <Text style={styles.testButtonText}>Test APIs</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <Ionicons
          name="log-out-outline"
          size={18}
          color={theme.colours.danger}
        />

        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SettingsRow({ icon, label, value }) {
  return (
    <View style={styles.row}>
      <Ionicons
        name={icon}
        size={18}
        color={theme.colours.mutedText}
        style={styles.rowIcon}
      />

      <Text style={styles.rowLabel}>{label}</Text>

      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colours.background,
  },
  header: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colours.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colours.border,
  },
  name: {
    fontSize: theme.fontSize.title,
    fontWeight: "700",
    color: theme.colours.text,
    marginBottom: 4,
  },
  email: {
    fontSize: theme.fontSize.body,
    color: theme.colours.mutedText,
  },
  card: {
    backgroundColor: theme.colours.card,
    borderRadius: theme.radius.md,
    marginHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colours.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colours.border,
  },
  rowIcon: {
    marginRight: theme.spacing.sm,
  },
  rowLabel: {
    flex: 1,
    fontSize: theme.fontSize.body,
    color: theme.colours.mutedText,
  },
  rowValue: {
    fontSize: theme.fontSize.body,
    fontWeight: "600",
    color: theme.colours.text,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    margin: theme.spacing.md,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.primary,
  },
  testButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: theme.fontSize.body,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    margin: theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colours.danger,
  },
  logoutText: {
    color: theme.colours.danger,
    fontWeight: "600",
    fontSize: theme.fontSize.body,
  },
});