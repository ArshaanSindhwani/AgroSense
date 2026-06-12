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
import { getObs } from "../../services/firebase/firestore";
import { generateRecommendation } from "../../services/ai/recommendationService";

export default function RecommendationsScreen() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");

  const { fields } = useFarmContext();

  async function getLatestObservation() {
    const results = await Promise.all(fields.map((field) => getObs(field.id)));
    const observations = results.flat();

    if (!observations.length) {
      return null;
    }

    return observations.sort((a, b) => {
      const getTime = (item) => {
        if (item.createdAt?.seconds) {
          return item.createdAt.seconds * 1000;
        }

        if (item.recordedAt) {
          return new Date(item.recordedAt).getTime();
        }

        return 0;
      };

      return getTime(b) - getTime(a);
    })[0];
  }

  async function handleGenerateRecommendation() {
    if (!fields.length) {
      Alert.alert("Missing field", "Please add a field first.");
      return;
    }

    try {
      setLoading(true);

      const latestObservation = await getLatestObservation();

      if (!latestObservation) {
        Alert.alert("Missing observation", "Please add an observation first.");
        return;
      }

      const field = fields.find((item) => item.id === latestObservation.fieldId);

      const result = await generateRecommendation({
        fieldName: field?.name,
        cropType: field?.cropType,
        growthStage: latestObservation.growthStage,
        pestSightings: latestObservation.pestSightings,
        diseaseSightings: latestObservation.diseaseSightings,
        notes: latestObservation.notes,
        weatherData: latestObservation.weatherData,
        soilData: latestObservation.soilData,
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
          Generate a practical recommendation using your latest observation.
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