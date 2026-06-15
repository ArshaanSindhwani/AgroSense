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
import { useThemeColor } from "../../hooks/useThemeColor";
import { useFarmContext } from "../../context/FarmContext";
import { generateRecommendation } from "../../services/ai/recommendationService";
import { getObs } from "../../services/firebase/firestore";

export default function RecommendationsScreen() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");

  const { fields } = useFarmContext();

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const mutedText = useThemeColor({}, 'mutedText');
  const primary = useThemeColor({}, 'primary');

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

      const field = fields.find(
        (item) => item.id === latestObservation.fieldId,
      );

      const result = await generateRecommendation({
        fieldName: field?.name,
        cropType: field?.cropType,
        growthStage: latestObservation.growthStage,
        pestSightings: latestObservation.pestSighting,
        diseaseSightings: latestObservation.diseaseSighting,
        notes: latestObservation.notes,
        weatherData: latestObservation.weatherData || field?.weatherData,
        soilData: latestObservation.soilData || field?.soilData,
      });

      setRecommendation(result);
    } catch (error) {
      Alert.alert("Could not generate recommendation", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={[styles.screen, { backgroundColor: background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: text }]}>Recommendations</Text>

        <Text style={[styles.subtitle, { color: mutedText }]}>
          Generate a practical recommendation using your latest observation and field data.
        </Text>

        <Pressable
          style={[styles.button, { backgroundColor: primary }]}
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
  },
  container: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: theme.fontSize.body,
  },
  button: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
