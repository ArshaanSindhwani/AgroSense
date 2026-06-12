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

const GROWTH_STAGES = ["Seedling", "Vegetative", "Flowering", "Harvest"];
const PEST_OPTIONS = ["None", "Aphids", "Slugs", "Weevils", "Fungal", "Other"];
const SOIL_OPTIONS = ["Good", "Waterlogged", "Dry", "Compacted", "Eroded"];

function ChipRow({ options, selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.chipScroll}
    >
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, selected === opt && styles.chipSelected]}
          onPress={() => onSelect(opt)}
        >
          <Text
            style={[
              styles.chipText,
              selected === opt && styles.chipTextSelected,
            ]}
          >
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export function ObservationForm({ fields, onSubmit, loading }) {
  const [fieldId, setFieldId] = useState(fields.length === 1 ? fields[0].id : "");
  const [growthStage, setGrowthStage] = useState("");
  const [pestSighting, setPestSighting] = useState("None");
  const [soilCondition, setSoilCondition] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!fieldId) e.fieldId = "Please select a field.";
    if (!growthStage) e.growthStage = "Please select a growth stage.";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSubmit({
      fieldId,
      growthStage,
      pestSighting: pestSighting === "None" ? "" : pestSighting,
      soilCondition,
      notes,
      source: "manual",
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Field *</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
      >
        {fields.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.chip, fieldId === f.id && styles.chipSelected]}
            onPress={() => {
              setFieldId(f.id);
              setErrors((prev) => ({ ...prev, fieldId: undefined }));
            }}
          >
            <Text
              style={[
                styles.chipText,
                fieldId === f.id && styles.chipTextSelected,
              ]}
            >
              {f.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {!!errors.fieldId && (
        <Text style={styles.error}>{errors.fieldId}</Text>
      )}

      <Text style={styles.label}>Growth Stage *</Text>
      <ChipRow
        options={GROWTH_STAGES}
        selected={growthStage}
        onSelect={(v) => {
          setGrowthStage(v);
          setErrors((prev) => ({ ...prev, growthStage: undefined }));
        }}
      />
      {!!errors.growthStage && (
        <Text style={styles.error}>{errors.growthStage}</Text>
      )}

      <Text style={styles.label}>Pest Sighting</Text>
      <ChipRow
        options={PEST_OPTIONS}
        selected={pestSighting}
        onSelect={setPestSighting}
      />

      <Text style={styles.label}>Soil Condition</Text>
      <ChipRow
        options={SOIL_OPTIONS}
        selected={soilCondition}
        onSelect={setSoilCondition}
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Any additional observations..."
        placeholderTextColor={theme.colours.mutedText}
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Observation</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.body,
    fontWeight: "600",
    color: theme.colours.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  chipScroll: {
    flexDirection: "row",
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colours.border,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colours.card,
  },
  chipSelected: {
    backgroundColor: theme.colours.primary,
    borderColor: theme.colours.primary,
  },
  chipText: {
    fontSize: theme.fontSize.small,
    color: theme.colours.text,
  },
  chipTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  textArea: {
    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.body,
    color: theme.colours.text,
    backgroundColor: theme.colours.card,
    minHeight: 100,
  },
  error: {
    fontSize: theme.fontSize.small,
    color: theme.colours.danger,
    marginTop: 4,
  },
  button: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colours.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: theme.fontSize.body,
    fontWeight: "600",
  },
});
