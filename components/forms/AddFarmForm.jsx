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
import {useThemeColor} from "../../hooks/useThemeColor"
import { Background } from "@react-navigation/elements";

export function AddFarmForm({ onSubmit, loading }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const [unit, setUnit] = useState("ha");
  const [errors, setErrors] = useState({});

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const mutedText = useThemeColor({}, 'mutedText');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');
  const danger = useThemeColor({}, 'danger');

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
      style={[styles.flex, {backgroundColor: background}]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.heading, {color: text}]}>Add a farm</Text>

        {/* Farm name */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, {color: text}]}>Farm name</Text>
          <TextInput
            style={[styles.input, {borderColor: errors.name ? danger : border, color : text, backgroundColor: background}]} // && styles.inputError}]}
            placeholder="e.g. Greenacre Farm"
            placeholderTextColor={mutedText}
            value={name}
            onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: undefined })); }}
            returnKeyType="next"
          />
          {errors.name && <Text style={[styles.errorText, {color: danger}]}>{errors.name}</Text>}
        </View>

        {/* Location */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, {color: text}]}>Postcode</Text>
          <TextInput
            style={[styles.input, { borderColor: errors.location ? danger : border, color: text, backgroundColor: background }]}
            placeholder="e.g. TA1 3LT"
            placeholderTextColor={mutedText}
            value={location}
            onChangeText={(t) => { setLocation(t); setErrors((e) => ({ ...e, location: undefined })); }}
            autoCapitalize="characters"
            returnKeyType="next"
          />
          {errors.location && <Text style={[styles.errorText, { color: danger }]}>{errors.location}</Text>}
        </View> 

        {/* Farm size */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: text }]}>Farm size (optional)</Text>
          <View style={styles.sizeRow}>
            <TextInput
              style={[styles.input, styles.sizeInput, { borderColor: errors.size ? danger : border, color: text, backgroundColor: background }]}
              placeholder="0"
              placeholderTextColor={mutedText}
              value={size}
              onChangeText={(t) => { setSize(t); setErrors((e) => ({ ...e, size: undefined })); }}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
            <View style={[styles.unitToggle, { borderColor: border }]}>
              {["ha", "acres"].map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[
                    styles.unitButton,
                    { backgroundColor: background },
                    unit === u && { backgroundColor: primary },
                  ]}
                  onPress={() => setUnit(u)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.unitText,
                    { color: text },
                    unit === u && styles.unitTextActive,
                  ]}>
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {errors.size && <Text style={[styles.errorText, { color: danger }]}>{errors.size}</Text>}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: primary }, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={loading}
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
          <Text style={[styles.cancelText, { color: mutedText }]}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
  },
  heading: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "700",
    marginBottom: theme.spacing.lg,
  },
  fieldGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.body,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.body,
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
    borderRadius: theme.radius.sm,
    overflow: "hidden",
  },
  unitButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  // unitButtonActive: {
  //   backgroundColor: theme.colours.primary,
  // },
  unitText: {
    fontSize: theme.fontSize.body,
    fontWeight: "500",
  },
  unitTextActive: {
    color: "#FFFFFF",
  },
  errorText: {
    fontSize: 13,
    marginTop: 4,
  },
  submitButton: {
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
  },
});