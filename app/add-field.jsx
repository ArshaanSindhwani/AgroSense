import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import { AddFieldForm } from "../components/forms/AddFieldForm";
import { useFarmContext } from "../context/FarmContext";
import { useAuthContext } from "../context/AuthContext";
import { addFarm, addField } from "../services/firebase/firestore";

export default function AddFieldScreen() {
  const router = useRouter();
  const { farms, refresh } = useFarmContext();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ farmName, ...data }) => {
    setLoading(true);
    try {
      let farmId = data.farmId;
      if (!farmId && farmName) {
        farmId = await addFarm(user.uid, { name: farmName });
      }
      await addField({ ...data, farmId });
      await refresh();
      router.back();
    } catch (err) {
      Alert.alert("Error", err.message || "Could not save field. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return <AddFieldForm farms={farms} onSubmit={handleSubmit} loading={loading} />;
}
