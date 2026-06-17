import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useFarmContext } from "../../context/FarmContext";
import { getCoordinatesFromPostcode } from "../../services/external/coordinateService";
import { getWeatherData } from "../../services/external/weatherService";
import { theme } from "../../constants/theme";
import { deleteFarm } from "../../services/firebase/firestore";
import { WeatherCard } from "../../components/cards/WeatherCard";
import { FarmCard } from "../../components/cards/FarmCard";
import FieldLocationMap from "../../components/maps/FieldLocationMap";
import { isOnline } from "../../services/offline/networkStatus";
import { useThemeColor } from "../../hooks/useThemeColor";

export default function HomeScreen() {
  const router = useRouter();
  const { farms, fields, loading, refresh } = useFarmContext();

  const [weather, setWeather] = useState(null);
  const [weatherMessage, setWeatherMessage] = useState("");
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const mutedText = useThemeColor({}, "mutedText");
  const primary = useThemeColor({}, "primary");
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  useEffect(() => {
    let mounted = true;
    let wasOffline = false;

    async function checkConnection() {
      const online = await isOnline();

      if (!mounted) return;

      setOffline(!online);

      if (online && wasOffline) {
        await refresh();
      }

      wasOffline = !online;
    }

    checkConnection();

    const interval = setInterval(checkConnection, 3000);

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkConnection();
      }
    });

    return () => {
      mounted = false;
      clearInterval(interval);
      subscription.remove();
    };
  }, [refresh]);

  useEffect(() => {
    if (!farms.length) {
      setSelectedFarm(null);
      setSelectedField(null);
      setWeather(null);
      setWeatherMessage("");
      return;
    }

    const selectedStillExists = farms.some(
      (farm) => farm.id === selectedFarm?.id
    );

    if (!selectedFarm || !selectedStillExists) {
      setSelectedFarm(farms[0]);
    }
  }, [farms, selectedFarm?.id]);

  useEffect(() => {
    if (!selectedFarm) {
      setSelectedField(null);
      return;
    }

    const farmFields = fields.filter(
      (field) => field.farmId === selectedFarm.id
    );

    if (!farmFields.length) {
      setSelectedField(null);
      return;
    }

    const selectedStillExists = farmFields.some(
      (field) => field.id === selectedField?.id
    );

    if (!selectedField || !selectedStillExists) {
      setSelectedField(farmFields[0]);
    }
  }, [fields, selectedFarm?.id, selectedField?.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      if (!selectedFarm) {
        setWeather(null);
        setWeatherMessage("");
        return;
      }

      const postcode = selectedFarm.location?.trim();

      if (!postcode) {
        setWeather(null);
        setWeatherMessage(
          "Weather is unavailable because this farm has no postcode."
        );
        return;
      }

      const online = await isOnline();

      setOffline(!online);

      if (!online) {
        setWeather(null);
        setWeatherMessage("Weather is unavailable offline.");
        return;
      }

      setWeatherLoading(true);
      setWeatherMessage("");

      try {
        const coords = await getCoordinatesFromPostcode(postcode);

        if (!coords?.latitude || !coords?.longitude) {
          throw new Error("Missing coordinates");
        }

        const data = await getWeatherData(coords.latitude, coords.longitude);

        if (!cancelled) {
          setWeather({
            ...data,
            place: coords.location || postcode,
          });
          setWeatherMessage("");
        }
      } catch (error) {
        console.log(`Weather unavailable for ${postcode}:`, error.message);

        if (!cancelled) {
          setWeather(null);
          setWeatherMessage("Weather is unavailable for this farm.");
        }
      } finally {
        if (!cancelled) {
          setWeatherLoading(false);
        }
      }
    }

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, [selectedFarm?.id]);

  async function requireInternet(action) {
    const online = await isOnline();

    setOffline(!online);

    if (!online) {
      Alert.alert(
        "Feature unavailable offline",
        "This feature requires an internet connection. Please reconnect and try again."
      );
      return;
    }

    action();
  }

  function confirmDeleteFarm(farm) {
    Alert.alert(
      "Delete Farm",
      `Are you sure you want to delete "${farm.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const online = await isOnline();

            setOffline(!online);

            if (!online) {
              Alert.alert(
                "Feature unavailable offline",
                "Deleting a farm requires an internet connection. Please reconnect and try again."
              );
              return;
            }

            try {
              await deleteFarm(farm.id);

              if (selectedFarm?.id === farm.id) {
                setSelectedFarm(null);
                setSelectedField(null);
              }

              await refresh();
            } catch (err) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  }

  function getSelectedFarmFields() {
    if (!selectedFarm) return [];

    return fields.filter((field) => field.farmId === selectedFarm.id);
  }

  if (loading) {
    return (
      <View style={[styles.centred, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  const selectedFarmFields = getSelectedFarmFields();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <FlatList
        data={farms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {offline && (
              <View
                style={[
                  styles.offlineBanner,
                  {
                    backgroundColor: card,
                    borderColor: border,
                  },
                ]}
              >
                <View style={[styles.offlineIcon, { backgroundColor: primary }]}>
                  <Ionicons
                    name="cloud-offline-outline"
                    size={30}
                    color="#FFFFFF"
                  />
                </View>

                <View style={styles.offlineContent}>
                  <Text style={[styles.offlineTitle, { color: text }]}>
                    You are offline
                  </Text>

                  <Text style={[styles.offlineText, { color: mutedText }]}>
                    Weather and map data are unavailable until you reconnect.
                  </Text>
                </View>
              </View>
            )}

            {offline ? (
              <>
                <UnavailableCard
                  icon="rainy-outline"
                  title="Weather unavailable"
                  message="Connect to the internet to view local weather for your farm."
                  backgroundColor={card}
                  borderColor={border}
                  iconColor={primary}
                  textColor={text}
                  mutedColor={mutedText}
                />

                <UnavailableCard
                  icon="map-outline"
                  title="Field Map unavailable"
                  message="Connect to the internet to view your field location on the map."
                  backgroundColor={card}
                  borderColor={border}
                  iconColor={primary}
                  textColor={text}
                  mutedColor={mutedText}
                />
              </>
            ) : (
              <>
                <WeatherCard weather={weather} loading={weatherLoading} />

                {!!weatherMessage && (
                  <Text style={[styles.statusMessage, { color: mutedText }]}>
                    {weatherMessage}
                  </Text>
                )}

                <FieldLocationMap field={selectedField} />
              </>
            )}

            {selectedFarmFields.length > 1 && !offline && (
              <>
                <Text style={[styles.subheading, { color: text }]}>
                  Map Field
                </Text>

                <FlatList
                  data={selectedFarmFields}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.fieldSelector}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.fieldChip,
                        { backgroundColor: card, borderColor: border },
                        selectedField?.id === item.id && {
                          backgroundColor: primary,
                          borderColor: primary,
                        },
                      ]}
                      onPress={() => setSelectedField(item)}
                    >
                      <Text
                        style={[
                          styles.fieldChipText,
                          {
                            color:
                              selectedField?.id === item.id
                                ? "#FFFFFF"
                                : text,
                          },
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}

            <Text style={[styles.heading, { color: text }]}>Your Farms</Text>
          </>
        }
        renderItem={({ item }) => (
          <FarmCard
            farm={item}
            selected={selectedFarm?.id === item.id}
            onSelect={() => setSelectedFarm(item)}
            onDelete={() => confirmDeleteFarm(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: mutedText }]}>
            No farms yet. Tap + to add one.
          </Text>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: primary }]}
        onPress={() => requireInternet(() => router.push("/add-farm"))}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

function UnavailableCard({
  icon,
  title,
  message,
  backgroundColor,
  borderColor,
  iconColor,
  textColor,
  mutedColor,
}) {
  return (
    <View
      style={[
        styles.unavailableCard,
        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <View style={[styles.unavailableIcon, { backgroundColor: iconColor }]}>
        <Ionicons name={icon} size={26} color="#FFFFFF" />
      </View>

      <View style={styles.unavailableTextContainer}>
        <Text style={[styles.unavailableTitle, { color: textColor }]}>
          {title}
        </Text>

        <Text style={[styles.unavailableText, { color: mutedColor }]}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  centred: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  subheading: {
    fontSize: theme.fontSize.body,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
  },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  offlineIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  offlineContent: {
    flex: 1,
  },
  offlineTitle: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "700",
    marginBottom: 4,
  },
  offlineText: {
    fontSize: theme.fontSize.body,
    lineHeight: 20,
  },
  unavailableCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  unavailableIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  unavailableTextContainer: {
    flex: 1,
  },
  unavailableTitle: {
    fontSize: theme.fontSize.body,
    fontWeight: "700",
    marginBottom: 4,
  },
  unavailableText: {
    fontSize: theme.fontSize.body,
    lineHeight: 20,
  },
  statusMessage: {
    fontSize: theme.fontSize.small,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  list: {
    paddingBottom: 100,
  },
  fieldSelector: {
    marginBottom: theme.spacing.md,
  },
  fieldChip: {
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  fieldChipText: {
    fontSize: theme.fontSize.small,
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    marginTop: theme.spacing.xl,
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});