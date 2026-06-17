import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const mutedText = useThemeColor({}, "mutedText");
  const primary = useThemeColor({}, "primary");
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  useEffect(() => {
    if (!farms.length) {
      setSelectedFarm(null);
      setSelectedField(null);
      setWeather(null);
      return;
    }

    if (!selectedFarm) {
      const validFarm = farms.find(
        (farm) => farm.location?.trim()
      );

      setSelectedFarm(validFarm || farms[0]);
    }
  }, [farms]);

  useEffect(() => {
    if (!selectedFarm) {
      setSelectedField(null);
      return;
    }

    const farmFields = fields.filter(
      (field) => field.farmId === selectedFarm.id
    );

    if (farmFields.length) {
      const existingSelectedField = farmFields.find(
        (field) => field.id === selectedField?.id
      );

      setSelectedField(existingSelectedField || farmFields[0]);
    } else {
      setSelectedField(null);
    }
  }, [fields, selectedFarm]);

  useEffect(() => {
    async function loadWeather() {
      if (!selectedFarm) {
        setWeather(null);
        return;
      }

      const postcode = selectedFarm.location?.trim();

      if (!postcode) {
        console.log(
          `Skipping weather for ${selectedFarm.name}: missing postcode`
        );

        setWeather(null);
        setWeatherLoading(false);

        const nextValidFarm = farms.find(
          (farm) =>
            farm.id !== selectedFarm.id &&
            farm.location?.trim()
        );

        if (nextValidFarm) {
          setSelectedFarm(nextValidFarm);
        }

        return;
      }

      setWeatherLoading(true);

      try {
        const coords =
          await getCoordinatesFromPostcode(postcode);

        if (!coords?.latitude || !coords?.longitude) {
          throw new Error("Missing coordinates");
        }

        const data = await getWeatherData(
          coords.latitude,
          coords.longitude
        );

        setWeather({
          ...data,
          place: coords.location || postcode,
        });
      } catch (error) {
        console.log(
          `Weather unavailable for ${postcode}:`,
          error.message
        );

        setWeather(null);

        const nextValidFarm = farms.find(
          (farm) =>
            farm.id !== selectedFarm.id &&
            farm.location?.trim()
        );

        if (nextValidFarm) {
          setSelectedFarm(nextValidFarm);
        }
      } finally {
        setWeatherLoading(false);
      }
    }

    loadWeather();
  }, [selectedFarm, farms]);

  async function requireInternet(action) {
    const online = await isOnline();

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

    return fields.filter(
      (field) => field.farmId === selectedFarm.id
    );
  }

  if (loading) {
    return (
      <View style={styles.centred, { backgroundColor: background }}>
        <ActivityIndicator
          size="large"
          color={primary}
        />
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
            <WeatherCard weather={weather} loading={weatherLoading} />

            <FieldLocationMap field={selectedField} />

            {selectedFarmFields.length > 1 && (
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
                          { color: text },
                          selectedField?.id === item.id &&
                          styles.fieldChipTextSelected,
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
  },
  subheading: {
    fontSize: theme.fontSize.body,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
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
  fieldChipSelected: {
    backgroundColor: theme.colours.primary,
    borderColor: theme.colours.primary,
  },
  fieldChipText: {
    fontSize: theme.fontSize.small,
    fontWeight: "600",
  },
  fieldChipTextSelected: {
    color: "#FFFFFF",
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