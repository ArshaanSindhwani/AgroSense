import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import RecommendationCard from "../../components/cards/RecommendationCard";
import { theme } from "../../constants/theme";
import { useFarmContext } from "../../context/FarmContext";
import { generateRecommendation } from "../../services/ai/recommendationService";

export default function RecommendationsScreen() {
  const [loading, setLoading] = useState(false);

  const {
    fieldData,
    weatherData,
    soilData,
    observationData,
    recommendation,
    setRecommendation,
  } = useFarmContext();

  async function handleGenerateRecommendation() {
    if (!fieldData || !observationData) {
      Alert.alert(
        "Missing data",
        "Please add a field and observation first."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await generateRecommendation({
        fieldName: fieldData.fieldName,
        cropType: fieldData.cropType,
        growthStage: observationData.growthStage,
        pestSightings: observationData.pestSightings,
        diseaseSightings: observationData.diseaseSightings,
        notes: observationData.notes,
        weatherData,
        soilData,
      });

      setRecommendation(result);
    } catch (error) {
      Alert.alert("Could not generate recommendation", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Recommendations</Text>

        <Text style={styles.subtitle}>
          Generate a practical recommendation using your field and observation data.
        </Text>

        <Pressable
          style={styles.button}
          onPress={handleGenerateRecommendation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Generate recommendation</Text>
          )}
        </Pressable>

        <RecommendationCard recommendation={recommendation} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colours.background,
  },
  container: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: "700",
    color: theme.colours.text,
  },
  subtitle: {
    fontSize: theme.fontSize.body,
    color: theme.colours.mutedText,
  },
  button: {
    backgroundColor: theme.colours.primary,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});