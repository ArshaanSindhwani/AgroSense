import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useFarmContext } from "../context/FarmContext";
import { useAuthContext } from "../context/AuthContext";
import { addObs } from "../services/firebase/firestore";
import { ObservationForm } from "../components/forms/ObservationForm";
import { theme } from "../constants/theme";
import { useThemeColor } from "../hooks/useThemeColor";

export default function AddObservationScreen() {
  const { fields, refresh } = useFarmContext();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const mutedText = useThemeColor({}, 'mutedText');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');

  if (!fields.length) {
    return (
      <View style={[styles.noFields, { backgroundColor: background }]}>
        <Ionicons name="leaf-outline" size={48} color={border} />
        <Text style={[styles.noFieldsTitle, { color: text }]}>No fields yet</Text>
        <Text style={[styles.noFieldsSubtitle, { color: mutedText }]}>
          Add a field before recording an observation.
        </Text>
        <TouchableOpacity
          style={[styles.goButton, { backgroundColor: primary }]}
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
      Alert.alert("Success", "Observation added successfully.");
      router.replace("/(tabs)/observations");
    } catch (err) {
      Alert.alert("Error", err.message || "Could not save observation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ObservationForm fields={fields} onSubmit={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noFields: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  noFieldsTitle: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "600",
    marginTop: theme.spacing.md,
  },
  noFieldsSubtitle: {
    fontSize: theme.fontSize.body,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  goButton: {
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
