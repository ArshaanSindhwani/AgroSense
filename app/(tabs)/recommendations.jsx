import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import RecommendationCard from "../../components/cards/RecommendationCard";
import { theme } from "../../constants/theme";
import { useThemeColor } from "../../hooks/useThemeColor";
import { useFarmContext } from "../../context/FarmContext";
import { useAuthContext } from "../../context/AuthContext";
import {
  addRecommendation,
  getObs,
  getRecommendations,
} from "../../services/firebase/firestore";
import { generateRecommendation } from "../../services/ai/recommendationService";
import { isOnline } from "../../services/offline/networkStatus";

export default function RecommendationsScreen() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [observations, setObservations] = useState([]);
  const [selectedObservationId, setSelectedObservationId] = useState("");
  const [history, setHistory] = useState([]);

  const { fields } = useFarmContext();
  const { user } = useAuthContext();

  const background = useThemeColor({}, "background");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const mutedText = useThemeColor({}, "mutedText");
  const border = useThemeColor({}, "border");
  const primary = useThemeColor({}, "primary");

  useEffect(() => {
    loadRecommendationData();
  }, [fields, user?.uid]);

  async function loadRecommendationData() {
    if (!fields.length || !user?.uid) {
      setObservations([]);
      setHistory([]);
      setSelectedObservationId("");
      return;
    }

    try {
      setLoadingData(true);

      const observationResults = await Promise.all(
        fields.map((field) => getObs(field.id))
      );

      const flatObservations = observationResults
        .flat()
        .sort((a, b) => getItemTime(b) - getItemTime(a));

      setObservations(flatObservations);

      if (flatObservations.length && !selectedObservationId) {
        setSelectedObservationId(flatObservations[0].id);
      }

      if (
        flatObservations.length &&
        selectedObservationId &&
        !flatObservations.some((item) => item.id === selectedObservationId)
      ) {
        setSelectedObservationId(flatObservations[0].id);
      }

      const recommendationHistory = await getRecommendations(user.uid);
      setHistory(recommendationHistory);
    } catch (error) {
      Alert.alert("Error", error.message || "Could not load recommendations.");
    } finally {
      setLoadingData(false);
    }
  }

  function getItemTime(item) {
    if (item.createdAt?.seconds) {
      return item.createdAt.seconds * 1000;
    }

    if (item.recordedAt) {
      return new Date(item.recordedAt).getTime();
    }

    if (item.createdAt) {
      return new Date(item.createdAt).getTime();
    }

    return 0;
  }

  function getFieldById(fieldId) {
    return fields.find((field) => field.id === fieldId);
  }

  function formatDate(item) {
    const time = getItemTime(item);

    if (!time) return "Unknown date";

    return new Date(time).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleGenerateRecommendation() {
    const online = await isOnline();

    if (!online) {
      Alert.alert(
        "Feature unavailable offline",
        "AI recommendations are not available when offline. Please reconnect to the internet and try again."
      );
      return;
    }

    if (!fields.length) {
      Alert.alert("Missing field", "Please add a field first.");
      return;
    }

    if (!observations.length) {
      Alert.alert("Missing observation", "Please add an observation first.");
      return;
    }

    const selectedObservation = observations.find(
      (item) => item.id === selectedObservationId
    );

    if (!selectedObservation) {
      Alert.alert("Missing observation", "Please select an observation.");
      return;
    }

    const field = getFieldById(selectedObservation.fieldId);

    try {
      setLoading(true);

      const result = await generateRecommendation({
        fieldName: field?.name,
        cropType: field?.cropType,
        growthStage: selectedObservation.growthStage,
        pestSightings: selectedObservation.pestSighting,
        diseaseSightings:
          selectedObservation.diseaseSighting ||
          selectedObservation.soilCondition,
        notes: selectedObservation.notes,
        weatherData: selectedObservation.weatherData || field?.weatherData,
        soilData: selectedObservation.soilData || field?.soilData,
      });

      setRecommendation(result);

      await addRecommendation({
        userId: user.uid,
        fieldId: field?.id || selectedObservation.fieldId,
        fieldName: field?.name || "",
        observationId: selectedObservation.id,
        recommendationText: result,
        inputSnapshot: {
          fieldName: field?.name || "",
          cropType: field?.cropType || "",
          growthStage: selectedObservation.growthStage || "",
          pestSighting: selectedObservation.pestSighting || "",
          diseaseSighting: selectedObservation.diseaseSighting || "",
          soilCondition: selectedObservation.soilCondition || "",
          notes: selectedObservation.notes || "",
          weatherData:
            selectedObservation.weatherData || field?.weatherData || null,
          soilData: selectedObservation.soilData || field?.soilData || null,
        },
      });

      await loadRecommendationData();
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
          Select an observation, generate a field-specific AI recommendation,
          and review previous recommendations.
        </Text>

        {loadingData ? (
          <ActivityIndicator color={primary} />
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Select observation
            </Text>

            {observations.length === 0 ? (
              <Text style={[styles.emptyText, { color: mutedText }]}>
                No observations found. Add an observation first.
              </Text>
            ) : (
              observations.map((observation) => {
                const field = getFieldById(observation.fieldId);
                const selected = selectedObservationId === observation.id;

                return (
                  <TouchableOpacity
                    key={observation.id}
                    style={[
                      styles.observationCard,
                      {
                        backgroundColor: card,
                        borderColor: selected ? primary : border,
                      },
                    ]}
                    onPress={() => setSelectedObservationId(observation.id)}
                  >
                    <Text style={[styles.observationTitle, { color: text }]}>
                      {field?.name || "Unknown field"}
                    </Text>

                    <Text style={[styles.observationText, { color: mutedText }]}>
                      {formatDate(observation)}
                    </Text>

                    <Text style={[styles.observationText, { color: mutedText }]}>
                      Growth: {observation.growthStage || "Unknown"}
                    </Text>

                    {!!observation.pestSighting && (
                      <Text style={[styles.observationText, { color: mutedText }]}>
                        Pest: {observation.pestSighting}
                      </Text>
                    )}

                    {!!observation.diseaseSighting && (
                      <Text style={[styles.observationText, { color: mutedText }]}>
                        Disease: {observation.diseaseSighting}
                      </Text>
                    )}

                    {!!observation.soilCondition && (
                      <Text style={[styles.observationText, { color: mutedText }]}>
                        Soil: {observation.soilCondition}
                      </Text>
                    )}

                    {!!observation.notes && (
                      <Text style={[styles.observationText, { color: mutedText }]}>
                        Notes: {observation.notes}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })
            )}

            <Pressable
              style={[
                styles.button,
                { backgroundColor: primary },
                loading && styles.buttonDisabled,
              ]}
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

            <Text style={[styles.sectionTitle, { color: text }]}>
              Recommendation history
            </Text>

            {history.length === 0 ? (
              <Text style={[styles.emptyText, { color: mutedText }]}>
                No recommendations generated yet.
              </Text>
            ) : (
              history.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.historyCard,
                    { backgroundColor: card, borderColor: border },
                  ]}
                >
                  <Text aria-label="recFieldName" style={[styles.historyTitle, { color: text }]}>
                    {item.fieldName || "Field recommendation"}
                  </Text>

                  <Text style={[styles.historyDate, { color: mutedText }]}>
                    {formatDate(item)}
                  </Text>

                  <Text style={[styles.historyText, { color: text }]}>
                    {item.recommendationText}
                  </Text>
                </View>
              ))
            )}
          </>
        )}
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
  sectionTitle: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "700",
    marginTop: theme.spacing.md,
  },
  observationCard: {
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  observationTitle: {
    fontSize: theme.fontSize.body,
    fontWeight: "700",
    marginBottom: 4,
  },
  observationText: {
    fontSize: theme.fontSize.small,
    marginTop: 2,
  },
  button: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  emptyText: {
    fontSize: theme.fontSize.body,
  },
  historyCard: {
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  historyTitle: {
    fontSize: theme.fontSize.body,
    fontWeight: "700",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: theme.fontSize.small,
    marginBottom: theme.spacing.sm,
  },
  historyText: {
    fontSize: theme.fontSize.body,
    lineHeight: 22,
  },
});