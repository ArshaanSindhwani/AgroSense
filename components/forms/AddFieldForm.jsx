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
import { useThemeColor } from "../../hooks/useThemeColor";

const UK_CROPS = [
  "Wheat",
  "Barley",
  "Oilseed Rape",
  "Potatoes",
  "Sugar Beet",
  "Maize",
  "Oats",
  "Field Beans",
  "Peas",
  "Rye",
  "Other",
];

export function AddFieldForm({ farms, onSubmit, loading }) {
  const [name, setName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [soilType, setSoilType] = useState("");
  const [cropType, setCropType] = useState("");
  const [areaAcres, setAreaAcres] = useState("");
  const [selectedFarmId, setSelectedFarmId] = useState(farms?.[0]?.id || "");
  const [errors, setErrors] = useState({});

  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const text = useThemeColor({}, 'text');
  const mutedText = useThemeColor({}, 'mutedText');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');
  const danger = useThemeColor({}, 'danger');

  const noFarms = !farms || farms.length === 0;

  function validate() {
    const e = {};

    if (!name.trim()) e.name = "Field name is required";
    // if (!postcode.trim()) e.postcode = "Postcode is required";
    if (noFarms && !farmName.trim()) e.farmName = "Farm name is required";
    if (!noFarms && !selectedFarmId) e.farm = "Select a farm";

    if (areaAcres && isNaN(parseFloat(areaAcres))) {
      e.areaAcres = "Must be a number";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      farmName: noFarms ? farmName.trim() : null,
      postcode: postcode.trim(),
      soilType: soilType.trim(),
      cropType: cropType.trim(),
      areaAcres: areaAcres ? parseFloat(areaAcres) : null,
      farmId: selectedFarmId,
    });
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: background }]} keyboardShouldPersistTaps="handled">
      {(!farms || farms.length === 0) && (
        <View style={styles.field}>
          <Text style={[styles.label, { color: mutedText }]}>Farm Name *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: card, borderColor: errors.farmName ? danger : border, color: text }]}
            placeholder="e.g. Green Acres Farm"
            placeholderTextColor={mutedText}
            value={farmName}
            onChangeText={setFarmName}
          />
          {errors.farmName && <Text style={[styles.error, { color: danger }]}>{errors.farmName}</Text>}
          <Text style={[styles.hint, { color: mutedText }]}>You'll be able to add more farms later</Text>
        </View>
      )}

      <View style={styles.field}>
        <Text style={[styles.label, { color: mutedText }]}>Field Name *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: card, borderColor: errors.name ? danger : border, color: text }]}
          placeholder="e.g. North Field"
          placeholderTextColor={mutedText}
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={[styles.error, { color: danger }]}>{errors.name}</Text>}
      </View>

      {farms?.length > 1 && (
        <View style={styles.field}>
          <Text style={[styles.label, { color: mutedText }]}>Farm *</Text>
          {farms.map((farm) => (
            <TouchableOpacity
              key={farm.id}
              style={[
                styles.option,
                { backgroundColor: card, borderColor: border },
                selectedFarmId === farm.id && { backgroundColor: primary, borderColor: primary },
              ]}
              onPress={() => setSelectedFarmId(farm.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: text },
                  selectedFarmId === farm.id && styles.optionTextSelected,
                ]}
              >
                {farm.name}
              </Text>
            </TouchableOpacity>
          ))}
          {errors.farm && <Text style={[styles.error, { color: danger }]}>{errors.farm}</Text>}
        </View>
      )}

      <View style={styles.field}>
        <Text style={[styles.label, { color: mutedText }]}>Crop Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.crops}>
          {UK_CROPS.map((crop) => (
            <TouchableOpacity
              key={crop}
              style={[
                styles.cropChip,
                { backgroundColor: card, borderColor: border },
                cropType === crop && { backgroundColor: primary, borderColor: primary },
              ]}
              onPress={() => setCropType(cropType === crop ? "" : crop)}
            >
              <Text
                style={[
                  styles.cropChipText,
                  { color: text },
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
        <Text style={[styles.label, { color: mutedText }]}>Area (acres)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: card, borderColor: errors.areaAcres ? danger : border, color: text }]}
          placeholder="e.g. 12.5"
          placeholderTextColor={mutedText}
          value={areaAcres}
          onChangeText={setAreaAcres}
          keyboardType="decimal-pad"
        />
        {errors.areaAcres && <Text style={[styles.error, { color: danger }]}>{errors.areaAcres}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: primary }, loading && styles.buttonDisabled]}
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
  },
  field: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.small,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.body,
  },
  error: {
    fontSize: theme.fontSize.small,
    marginTop: 4,
  },
  option: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.xs,
  },
  optionSelected: {
    borderColor: theme.colours.primary,
    backgroundColor: theme.colours.primary,
  },
  optionText: {
    fontSize: theme.fontSize.body,
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
    marginRight: theme.spacing.sm,
  },
  cropChipText: {
    fontSize: theme.fontSize.small,
  },
  cropChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  button: {
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
  hint: {
    fontSize: theme.fontSize.small,
    marginTop: 4,
  },
});
