import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { FieldCard } from "../../components/cards/FieldCard";
import { useFarmContext } from "../../context/FarmContext";
import { theme } from "../../constants/theme";

export default function FieldsScreen() {
  const router = useRouter();
  const { fields, loading, error, refresh } = useFarmContext();

  if (loading) {
    return (
      <View style={styles.centred}>
        <ActivityIndicator size="large" color={theme.colours.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centred}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={refresh} style={styles.retryButton}>
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={fields}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FieldCard
            field={item}
            onPress={() =>
              router.push({ pathname: "/field-details", params: { fieldId: item.id } })
            }
          />
        )}
        contentContainerStyle={
          fields.length === 0 ? styles.emptyContainer : styles.list
        }
        ListHeaderComponent={<Text style={styles.heading}>Your Fields</Text>}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="leaf-outline" size={48} color={theme.colours.mutedText} />
            <Text style={styles.emptyTitle}>No fields yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to add your first field
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add-field")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colours.background,
  },
  centred: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colours.background,
  },
  list: {
    padding: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  heading: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "700",
    color: theme.colours.text,
    marginBottom: theme.spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.spacing.xl * 2,
    gap: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "600",
    color: theme.colours.text,
  },
  emptySubtitle: {
    fontSize: theme.fontSize.body,
    color: theme.colours.mutedText,
    textAlign: "center",
  },
  errorText: {
    fontSize: theme.fontSize.body,
    color: theme.colours.danger,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colours.primary,
    borderRadius: theme.radius.sm,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
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
