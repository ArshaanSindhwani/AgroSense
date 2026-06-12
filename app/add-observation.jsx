import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useFarmContext } from "../context/FarmContext";
import { useAuthContext } from "../context/AuthContext";
import { addObs } from "../services/firebase/firestore";
import { ObservationForm } from "../components/forms/ObservationForm";
import { theme } from "../constants/theme";

export default function AddObservationScreen() {
  const { fields, refresh } = useFarmContext();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  if (!fields.length) {
    return (
      <View style={styles.noFields}>
        <Ionicons name="leaf-outline" size={48} color={theme.colours.border} />
        <Text style={styles.noFieldsTitle}>No fields yet</Text>
        <Text style={styles.noFieldsSubtitle}>
          Add a field before recording an observation.
        </Text>
        <TouchableOpacity
          style={styles.goButton}
          onPress={() => router.replace("/(tabs)/fields")}
        >
          <Text style={styles.goButtonText}>Go to Fields</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function handleSubmit(data) {
    setLoading(true);
    try {
      await addObs({
        ...data,
        userId: user.uid,
        recordedAt: new Date().toISOString(),
      });
      await refresh();
      router.replace("/(tabs)/observations");
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
  noFields: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colours.background,
  },
  noFieldsTitle: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "600",
    color: theme.colours.text,
    marginTop: theme.spacing.md,
  },
  noFieldsSubtitle: {
    fontSize: theme.fontSize.body,
    color: theme.colours.mutedText,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  goButton: {
    backgroundColor: theme.colours.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  goButtonText: {
    color: "#fff",
    fontSize: theme.fontSize.body,
    fontWeight: "600",
  },
});
