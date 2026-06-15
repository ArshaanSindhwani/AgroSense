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
import { SafeAreaView } from "react-native-safe-area-context";

import { FieldCard } from "../../components/cards/FieldCard";
import { useFarmContext } from "../../context/FarmContext";
import { theme } from "../../constants/theme";
import { useThemeColor } from "../../hooks/useThemeColor";

export default function FieldsScreen() {
  const router = useRouter();
  const { fields, loading, error, refresh } = useFarmContext();

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const mutedText = useThemeColor({}, 'mutedText');
  const primary = useThemeColor({}, 'primary');
  const danger = useThemeColor({}, 'danger');

  if (loading) {
    return (
      <View style={[styles.centred, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centred, { backgroundColor: background }]}>
        <Text style={[styles.errorText, { color: danger }]}>{error}</Text>
        <TouchableOpacity onPress={refresh} style={[styles.retryButton, { backgroundColor: primary }]}>
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
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
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="leaf-outline" size={48} color={mutedText} />
            <Text style={[styles.emptyTitle, { color: text }]}>No fields yet</Text>
            <Text style={[styles.emptySubtitle, { color: mutedText }]}>
              Tap the + button to add your first field
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: primary }]}
        onPress={() => router.push("/add-field")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centred: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    padding: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    padding: theme.spacing.md,
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
  },
  emptySubtitle: {
    fontSize: theme.fontSize.body,
    textAlign: "center",
  },
  errorText: {
    fontSize: theme.fontSize.body,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
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
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
