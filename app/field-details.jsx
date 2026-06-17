import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useFarmContext } from "../context/FarmContext";
import { deleteField } from "../services/firebase/firestore";
import { theme } from "../constants/theme";

export default function FieldDetailsScreen() {
  const { fieldId } = useLocalSearchParams();
  const router = useRouter();
  const { fields, refresh } = useFarmContext();
  const [deleting, setDeleting] = useState(false);

  const field = fields.find((f) => f.id === fieldId);

  if (!field) {
    return (
      <View style={styles.centred}>
        <Text style={styles.notFound}>Field not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Field",
      `Are you sure you want to delete "${field.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteField(fieldId);
              await refresh();
              router.replace("/fields");
            } catch (err) {
              Alert.alert("Error", err.message || "Could not delete field. Please try again.");
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="leaf" size={32} color={theme.colours.primary} />
        </View>
        <Text style={styles.name}>{field.name}</Text>
        {!!field.cropType && (
          <Text style={styles.crop}>{field.cropType}</Text>
        )}
      </View>

      <View style={styles.card}>
        <DetailRow icon="resize-outline" label="Area" value={field.areaAcres ? `${field.areaAcres} acres` : "Not set"} />
        <DetailRow icon="leaf-outline" label="Crop Type" value={field.cropType || "Not set"} />
        <DetailRow icon="calendar-outline" label="Added" value={field.createdAt?.toDate ? field.createdAt.toDate().toLocaleDateString("en-GB") : "—"} />
      </View>

      <TouchableOpacity
        style={[styles.deleteButton, deleting && styles.buttonDisabled]}
        onPress={handleDelete}
        disabled={deleting}
        activeOpacity={0.85}
      >
        <Ionicons name="trash-outline" size={18} color={theme.colours.danger} />
        <Text style={styles.deleteText}>
          {deleting ? "Deleting..." : "Delete Field"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={theme.colours.mutedText} style={styles.rowIcon} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
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
  },
  notFound: {
    color: theme.colours.mutedText,
    fontSize: theme.fontSize.body,
  },
  header: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colours.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colours.border,
  },
  name: {
    fontSize: theme.fontSize.title,
    fontWeight: "700",
    color: theme.colours.text,
    marginBottom: 4,
  },
  crop: {
    fontSize: theme.fontSize.body,
    color: theme.colours.mutedText,
  },
  card: {
    backgroundColor: theme.colours.card,
    borderRadius: theme.radius.md,
    marginHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colours.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colours.border,
  },
  rowIcon: {
    marginRight: theme.spacing.sm,
  },
  rowLabel: {
    flex: 1,
    fontSize: theme.fontSize.body,
    color: theme.colours.mutedText,
  },
  rowValue: {
    fontSize: theme.fontSize.body,
    fontWeight: "600",
    color: theme.colours.text,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    margin: theme.spacing.md,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colours.danger,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  deleteText: {
    color: theme.colours.danger,
    fontWeight: "600",
    fontSize: theme.fontSize.body,
  },
});
