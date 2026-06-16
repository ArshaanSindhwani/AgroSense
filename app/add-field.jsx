import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { useFarmContext } from "../context/FarmContext";
import { useAuthContext } from "../context/AuthContext";

import { AddFieldForm } from "../components/forms/AddFieldForm";
import { theme } from "../constants/theme";

import { addFarm, addField } from "../services/firebase/firestore";

import { getCoordinatesFromPostcode } from "../services/external/coordinateService";
import { getWeatherData } from "../services/external/weatherService";
import { getSoilData } from "../services/external/soilService";
import { createAgroPolygon } from "../services/external/agroMonitoringService";

import { isOnline } from "../services/offline/networkStatus";

export default function AddFieldScreen() {
  const { farms, refresh } = useFarmContext();
  const { user } = useAuthContext();

  const [loading, setLoading] = useState(false);

  async function handleSubmit(data) {
    try {
      const online = await isOnline();

      if (!online) {
        Alert.alert(
          "Feature unavailable offline",
          "Adding a field is not available when offline. Please reconnect to the internet and try again."
        );
        return;
      }

      setLoading(true);

      let farmId = data.farmId;

      if (!farmId && data.farmName) {
        const farmData = {
          name: data.farmName,
          userId: user.uid,
          createdAt: new Date().toISOString(),
        };

        farmId = await addFarm(farmData);
      }

      const coordinates = await getCoordinatesFromPostcode(
        data.postcode
      );

      const weatherData = await getWeatherData(
        coordinates.latitude,
        coordinates.longitude
      );

      const soilData = await getSoilData(
        coordinates.latitude,
        coordinates.longitude,
        data.soilType || ""
      );

      const agroData = await createAgroPolygon(
        data.name,
        coordinates.latitude,
        coordinates.longitude
      );

      const fieldData = {
        name: data.name,
        cropType: data.cropType || "",
        areaAcres: data.areaAcres || null,
        postcode: data.postcode || "",
        soilType: data.soilType || "",
        farmId,
        userId: user.uid,

        coordinates,
        weatherData,
        soilData,
        agroData,

        createdAt: new Date().toISOString(),
      };

      await addField(fieldData);

      await refresh();

      Alert.alert(
        "Success",
        "Field added successfully."
      );

      router.replace("/(tabs)/fields");
    } catch (err) {
      console.log("Add field failed:", err);

      Alert.alert(
        "Error",
        err.message || "Could not add field."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <AddFieldForm
        farms={farms}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colours.background,
  },
});