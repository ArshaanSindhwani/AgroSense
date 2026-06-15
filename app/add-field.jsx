import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { AddFieldForm } from "../components/forms/AddFieldForm";
import { useAuthContext } from "../context/AuthContext";
import { useFarmContext } from "../context/FarmContext";
import { addFarm, addField } from "../services/firebase/firestore";

import { createAgroPolygon } from "../services/external/agroMonitoringService";
import { getCoordinatesFromPostcode } from "../services/external/coordinateService";
import { getSoilData } from "../services/external/soilService";
import { getWeatherData } from "../services/external/weatherService";

export default function AddFieldScreen() {
  const router = useRouter();
  const { farms, refresh } = useFarmContext();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  async function handleSubmit({ farmName, ...data }) {
    setLoading(true);

    try {
      let farmId = data.farmId;

      if (!farmId && farmName) {
        farmId = await addFarm(user.uid, {
          name: farmName,
          userId: user.uid,
        });
      }

      let apiData = {};

      if (data.postcode) {
        const coordinates = await getCoordinatesFromPostcode(data.postcode);

        const weatherData = await getWeatherData(
          coordinates.latitude,
          coordinates.longitude,
        );

        const soilData = await getSoilData(
          coordinates.latitude,
          coordinates.longitude,
          data.soilType || "",
        );

        const agroData = await createAgroPolygon(
          data.name || "Field",
          coordinates.latitude,
          coordinates.longitude,
        );

        apiData = {
          postcode: coordinates.postcode,
          location: coordinates.location,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          weatherData,
          soilData,
          agroData,
        };
      }

      await addField({
        ...data,
        ...apiData,
        farmId,
        userId: user.uid,
      });

      await refresh();

      Alert.alert("Field saved", "Field and environmental data saved.");
      router.replace("/(tabs)/fields");
    } catch (err) {
      Alert.alert(
        "Error",
        err.message || "Could not save field. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AddFieldForm farms={farms} onSubmit={handleSubmit} loading={loading} />
  );
}
