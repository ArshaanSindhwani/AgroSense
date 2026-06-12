import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useFarmContext } from "@/context/FarmContext";
import { getObs, deleteObs } from "@/services/firebase/firestore";
import { ObservationCard } from "@/components/cards/ObservationCard";
import { theme } from "@/constants/theme";

export default function ObservationsScreen() {
  const { fields, loading: fieldsLoading } = useFarmContext();
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadObservations = useCallback(async () => {
    if (!fields.length) {
      setObservations([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(fields.map((f) => getObs(f.id)));
      const flat = results.flat().sort((a, b) => {
        const toMs = (ts) => (ts?.seconds ? ts.seconds * 1000 : ts ? new Date(ts).getTime() : 0);
        return toMs(b.createdAt) - toMs(a.createdAt);
      });
      setObservations(flat);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fields]);

  useEffect(() => {
    loadObservations();
  }, [loadObservations]);

  function getFieldName(fieldId) {
    return fields.find((f) => f.id === fieldId)?.name ?? "";
  }

  function confirmDelete(obs) {
    Alert.alert(
      "Delete Observation",
      "Remove this observation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteObs(obs.id);
              setObservations((prev) => prev.filter((o) => o.id !== obs.id));
            } catch (err) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  }

  if (fieldsLoading || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colours.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadObservations} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={observations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          observations.length === 0 ? styles.emptyContainer : styles.listContent
        }
        renderItem={({ item }) => (
          <ObservationCard
            observation={item}
            fieldName={getFieldName(item.fieldId)}
            onDelete={() => confirmDelete(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="eye-off-outline"
              size={48}
              color={theme.colours.border}
            />
            <Text style={styles.emptyTitle}>No observations yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to record your first observation.
            </Text>
          </View>
        }
        onRefresh={loadObservations}
        refreshing={loading}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add-observation")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colours.background,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "600",
    color: theme.colours.text,
    marginTop: theme.spacing.md,
  },
  emptySubtitle: {
    fontSize: theme.fontSize.body,
    color: theme.colours.mutedText,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.fontSize.body,
    color: theme.colours.danger,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  retryBtn: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colours.primary,
    borderRadius: theme.radius.md,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colours.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
