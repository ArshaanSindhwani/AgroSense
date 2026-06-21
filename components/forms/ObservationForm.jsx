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

const GROWTH_STAGES = ["Seedling", "Vegetative", "Flowering", "Harvest"];
const PEST_OPTIONS = ["None", "Aphids", "Slugs", "Weevils", "Fungal", "Other"];
const SOIL_OPTIONS = ["Good", "Waterlogged", "Dry", "Compacted", "Eroded"];

function ChipRow({ options, selected, onSelect, card, border, primary, text }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.chipScroll}
    >
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[
            styles.chip,
            { backgroundColor: card, borderColor: border },
            selected === opt && { backgroundColor: primary, borderColor: primary },
          ]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[
            styles.chipText,
            { color: text },
            selected === opt && styles.chipTextSelected,
          ]}>
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

  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const text = useThemeColor({}, 'text');
  const mutedText = useThemeColor({}, 'mutedText');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');
  const danger = useThemeColor({}, 'danger');

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
    <ScrollView
      style={{ backgroundColor: background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.label, { color: text }]}>Field *</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
      >
        {fields.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[
              styles.chip,
              { backgroundColor: card, borderColor: border },
              fieldId === f.id && { backgroundColor: primary, borderColor: primary },
            ]}
            onPress={() => {
              setFieldId(f.id);
              setErrors((prev) => ({ ...prev, fieldId: undefined }));
            }}
          >
            <Text style={[
              styles.chipText,
              { color: text },
              fieldId === f.id && styles.chipTextSelected,
            ]}>
              {f.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {!!errors.fieldId && (
        <Text style={[styles.error, { color: danger }]}>{errors.fieldId}</Text>
      )}

      <Text style={[styles.label, { color: text }]}>Growth Stage *</Text>
      <ChipRow
        options={GROWTH_STAGES}
        selected={growthStage}
        onSelect={(v) => {
          setGrowthStage(v);
          setErrors((prev) => ({ ...prev, growthStage: undefined }));
        }}
        card={card}
        border={border}
        primary={primary}
        text={text}
      />
      {!!errors.growthStage && (
        <Text style={[styles.error, { color: danger }]}>{errors.growthStage}</Text>
      )}

      <Text style={[styles.label, { color: text }]}>Pest Sighting</Text>
      <ChipRow
        options={PEST_OPTIONS}
        selected={pestSighting}
        onSelect={setPestSighting}
        card={card}
        border={border}
        primary={primary}
        text={text}
      />

      <Text style={[styles.label, { color: text }]}>Soil Condition</Text>
      <ChipRow
        options={SOIL_OPTIONS}
        selected={soilCondition}
        onSelect={setSoilCondition}
        card={card}
        border={border}
        primary={primary}
        text={text}
      />

      <Text style={[styles.label, { color: text }]}>Notes</Text>
      <TextInput
        style={[styles.textArea, { borderColor: border, color: text, backgroundColor: card }]}
        placeholder="Any additional observations..."
        placeholderTextColor={mutedText}
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: primary }, loading && styles.buttonDisabled]}
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
    marginRight: theme.spacing.sm,
  },
  chipTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  chipText: {
    fontSize: theme.fontSize.small,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.body,
    minHeight: 100,
  },
  error: {
    fontSize: theme.fontSize.small,
    marginTop: 4,
  },
  button: {
    marginTop: theme.spacing.lg,
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
