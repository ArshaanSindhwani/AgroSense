import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { theme } from "../../constants/theme";

const UK_CROPS = [
  "Wheat", "Barley", "Oilseed Rape", "Potatoes", "Sugar Beet",
  "Maize", "Oats", "Field Beans", "Peas", "Rye", "Other",
];

export function AddFieldForm({ farms, onSubmit, loading }) {
  const [name, setName] = useState("");
  const [cropType, setCropType] = useState("");
  const [areaAcres, setAreaAcres] = useState("");
  const [selectedFarmId, setSelectedFarmId] = useState(farms?.[0]?.id || "");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Field name is required";
    if (!selectedFarmId) e.farm = "Select a farm";
    if (areaAcres && isNaN(parseFloat(areaAcres))) e.areaAcres = "Must be a number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      cropType: cropType.trim(),
      areaAcres: areaAcres ? parseFloat(areaAcres) : null,
      farmId: selectedFarmId,
    });
  };

  if (!farms || farms.length === 0) {
    return (
      <View style={styles.noFarm}>
        <Text style={styles.noFarmText}>
          You need to create a farm before adding fields.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.field}>
        <Text style={styles.label}>Field Name *</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="e.g. North Field"
          placeholderTextColor={theme.colours.mutedText}
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}
      </View>

      {farms.length > 1 && (
        <View style={styles.field}>
          <Text style={styles.label}>Farm *</Text>
          {farms.map((farm) => (
            <TouchableOpacity
              key={farm.id}
              style={[
                styles.option,
                selectedFarmId === farm.id && styles.optionSelected,
              ]}
              onPress={() => setSelectedFarmId(farm.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedFarmId === farm.id && styles.optionTextSelected,
                ]}
              >
                {farm.name}
              </Text>
            </TouchableOpacity>
          ))}
          {errors.farm && <Text style={styles.error}>{errors.farm}</Text>}
        </View>
      )}

      <View style={styles.field}>
        <Text style={styles.label}>Crop Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.crops}>
          {UK_CROPS.map((crop) => (
            <TouchableOpacity
              key={crop}
              style={[
                styles.cropChip,
                cropType === crop && styles.cropChipSelected,
              ]}
              onPress={() => setCropType(cropType === crop ? "" : crop)}
            >
              <Text
                style={[
                  styles.cropChipText,
                  cropType === crop && styles.cropChipTextSelected,
                ]}
              >
                {crop}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Area (acres)</Text>
        <TextInput
          style={[styles.input, errors.areaAcres && styles.inputError]}
          placeholder="e.g. 12.5"
          placeholderTextColor={theme.colours.mutedText}
          value={areaAcres}
          onChangeText={setAreaAcres}
          keyboardType="decimal-pad"
        />
        {errors.areaAcres && <Text style={styles.error}>{errors.areaAcres}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Add Field</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colours.background,
  },
  field: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.small,
    fontWeight: "600",
    color: theme.colours.mutedText,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colours.card,
    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.body,
    color: theme.colours.text,
  },
  inputError: {
    borderColor: theme.colours.danger,
  },
  error: {
    fontSize: theme.fontSize.small,
    color: theme.colours.danger,
    marginTop: 4,
  },
  option: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colours.card,
  },
  optionSelected: {
    borderColor: theme.colours.primary,
    backgroundColor: theme.colours.primary,
  },
  optionText: {
    fontSize: theme.fontSize.body,
    color: theme.colours.text,
  },
  optionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  crops: {
    flexDirection: "row",
  },
  cropChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colours.border,
    backgroundColor: theme.colours.card,
    marginRight: theme.spacing.sm,
  },
  cropChipSelected: {
    backgroundColor: theme.colours.primary,
    borderColor: theme.colours.primary,
  },
  cropChipText: {
    fontSize: theme.fontSize.small,
    color: theme.colours.text,
  },
  cropChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  button: {
    backgroundColor: theme.colours.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: theme.fontSize.body,
    fontWeight: "700",
  },
  noFarm: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xl,
  },
  noFarmText: {
    fontSize: theme.fontSize.body,
    color: theme.colours.mutedText,
    textAlign: "center",
  },
});
