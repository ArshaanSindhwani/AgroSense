import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { useFarmContext } from "@/context/FarmContext";
import { useAuthContext } from "@/context/AuthContext";
import { addObs } from "@/services/firebase/firestore";
import { ObservationForm } from "@/components/forms/ObservationForm";
import { theme } from "@/constants/theme";

export default function AddObservationScreen() {
  const { fields, refresh } = useFarmContext();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data) {
    setLoading(true);
    try {
      await addObs({
        ...data,
        userId: user.uid,
        recordedAt: new Date().toISOString(),
      });
      await refresh();
      router.back();
    } catch (err) {
      Alert.alert("Error", err.message || "Could not save observation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ObservationForm fields={fields} onSubmit={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colours.background,
  },
});
