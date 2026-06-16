import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { theme } from "../../constants/theme";

export function AddFarmForm({ onSubmit, loading }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const [unit, setUnit] = useState("ha");
  const [errors, setErrors] = useState({});

const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

const validate = () => {
  const next = {};
  if (!name.trim()) next.name = "Farm name is required.";
  if (!location.trim()) next.location = "Postcode is required.";
  else if (!UK_POSTCODE_REGEX.test(location.trim())) next.location = "Enter a valid UK postcode.";
  if (size && isNaN(Number(size))) next.size = "Size must be a number.";
  setErrors(next);
  return Object.keys(next).length === 0;
};

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ name, location, size, unit });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Add a farm</Text>

        {/* Farm name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Farm name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="e.g. Greenacre Farm"
            placeholderTextColor={theme.colours.mutedText}
            value={name}
            onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: undefined })); }}
            returnKeyType="next"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Location */}
        <View style={styles.fieldGroup}>
       <Text style={styles.label}>Postcode</Text>
            <TextInput
            style={[styles.input, errors.location && styles.inputError]}
            placeholder="e.g. TA1 3LT"
            placeholderTextColor={theme.colours.mutedText}
            value={location}
            onChangeText={(t) => { setLocation(t); setErrors((e) => ({ ...e, location: undefined })); }}
            autoCapitalize="characters"
            returnKeyType="next"
            />
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        </View>

        {/* Farm size */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Farm size (optional)</Text>
          <View style={styles.sizeRow}>
            <TextInput
              style={[styles.input, styles.sizeInput, errors.size && styles.inputError]}
              placeholder="0"
              placeholderTextColor={theme.colours.mutedText}
              value={size}
              onChangeText={(t) => { setSize(t); setErrors((e) => ({ ...e, size: undefined })); }}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
            <View style={styles.unitToggle}>
              {["ha", "acres"].map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[styles.unitButton, unit === u && styles.unitButtonActive]}
                  onPress={() => setUnit(u)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.unitText, unit === u && styles.unitTextActive]}>
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {errors.size && <Text style={styles.errorText}>{errors.size}</Text>}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={loading}
          testID="save-farm-button"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitText}>Save farm</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.replace("/(tabs)/addFarm")}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colours.background,
  },
  container: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
  },
  heading: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "700",
    color: theme.colours.text,
    marginBottom: theme.spacing.lg,
  },
  fieldGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.body,
    fontWeight: "600",
    color: theme.colours.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colours.surface,
    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.body,
    color: theme.colours.text,
  },
  inputError: {
    borderColor: theme.colours.danger,
  },
  sizeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  sizeInput: {
    flex: 1,
  },
  unitToggle: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.sm,
    overflow: "hidden",
  },
  unitButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colours.surface,
  },
  unitButtonActive: {
    backgroundColor: theme.colours.primary,
  },
  unitText: {
    fontSize: theme.fontSize.body,
    color: theme.colours.text,
    fontWeight: "500",
  },
  unitTextActive: {
    color: "#FFFFFF",
  },
  errorText: {
    fontSize: 13,
    color: theme.colours.danger,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: theme.colours.primary,
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: theme.fontSize.body,
    fontWeight: "600",
  },
  cancelButton: {
    alignItems: "center",
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  cancelText: {
    fontSize: theme.fontSize.body,
    color: theme.colours.mutedText,
  },
});