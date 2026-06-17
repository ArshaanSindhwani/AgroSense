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

      const farm = farms.find((f) => f.id === data.farmId);
      const postcode = farm?.location?.trim();
      if (!postcode) {
        Alert.alert(
          "Missing postcode",
          "This farm has no postcode yet"
        );
        return;
      }

      setLoading(true);

      let coordinates;

      try {
        coordinates = await getCoordinatesFromPostcode(postcode);
      } catch {
        Alert.alert(
          "Invalid postcode",
          "We could not find this postcode. Please check it and try again."
        );
        return;
      }

      if (!coordinates?.latitude || !coordinates?.longitude) {
        Alert.alert(
          "Invalid postcode",
          "We could not find coordinates for this postcode. Please check it and try again."
        );
        return;
      }

      let farmId = data.farmId;

      if (!farmId && data.farmName) {
        const farmData = {
          name: data.farmName,
          location: postcode,
          userId: user.uid,
          createdAt: new Date().toISOString(),
        };

        farmId = await addFarm(user.uid, farmData);
      }

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
        postcode,
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

      Alert.alert("Success", "Field added successfully.");

      router.replace("/fields");
    } catch (err) {
      console.log("Add field failed:", err);

      Alert.alert("Error", err.message || "Could not add field.");
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