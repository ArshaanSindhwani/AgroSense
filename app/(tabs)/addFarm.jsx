import { useState } from "react";
import { useRouter } from "expo-router";
import { AddFarmForm } from "../../components/forms/AddFarmForm";
import { useAuthContext } from "../../context/AuthContext";
import { addFarm } from "../../services/firebase/firestore";
import { Alert } from "react-native";
import {useThemeColor} from "../../hooks/useColorScheme"

export default function AddFarmScreen() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await addFarm(user.uid, {
        name: data.name,
        location: data.location,
        size: data.size ? { value: parseFloat(data.size), unit: data.unit } : null,
      });
      Alert.alert("Success", "Farm added successfully.");
      router.replace("/(tabs)/fields");
    } catch (err) {
      console.error("Failed to add farm:", err);
    } finally {
      setLoading(false);
    }
  };

  return <AddFarmForm onSubmit={handleSubmit} loading={loading} />;
}