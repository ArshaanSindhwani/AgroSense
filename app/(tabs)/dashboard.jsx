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

export default function HomeScreen() {
  const router = useRouter();
  const { farms, fields, loading, refresh } = useFarmContext();
  const [weather, setWeather] = useState(null);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    if (farms.length && !selectedFarm) {
      setSelectedFarm(farms[0]);
    }

    if (!farms.length) {
      setSelectedFarm(null);
      setSelectedField(null);
      setWeather(null);
    }
  }, [farms, selectedFarm]);

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
  }, [fields, selectedFarm, selectedField]);

  useEffect(() => {
    async function loadWeather() {
      if (!selectedFarm?.location) {
        setWeather(null);
        return;
      }

      setWeatherLoading(true);

      try {
        const coords = await getCoordinatesFromPostcode(selectedFarm.location);
        const data = await getWeatherData(coords.latitude, coords.longitude);

        setWeather({
          ...data,
          place: coords.location,
        });
      } catch (err) {
        console.log("Weather unavailable:", err.message);
        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    }

    loadWeather();
  }, [selectedFarm]);

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
      <View style={styles.centred}>
        <ActivityIndicator size="large" color={theme.colours.primary} />
      </View>
    );
  }

  const selectedFarmFields = getSelectedFarmFields();

  return (
    <View style={styles.container}>
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
                <Text style={styles.subheading}>Map Field</Text>

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
                        selectedField?.id === item.id &&
                          styles.fieldChipSelected,
                      ]}
                      onPress={() => setSelectedField(item)}
                    >
                      <Text
                        style={[
                          styles.fieldChipText,
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

            <Text style={styles.heading}>Your Farms</Text>
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
          <Text style={styles.empty}>No farms yet. Tap + to add one.</Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add-farm")}
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
    backgroundColor: theme.colours.background,
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
    color: theme.colours.text,
    marginBottom: theme.spacing.sm,
  },
  subheading: {
    fontSize: theme.fontSize.body,
    fontWeight: "700",
    color: theme.colours.text,
    marginBottom: theme.spacing.sm,
  },
  list: {
    paddingBottom: 100,
  },
  fieldSelector: {
    marginBottom: theme.spacing.md,
  },
  fieldChip: {
    backgroundColor: theme.colours.card,
    borderWidth: 1,
    borderColor: theme.colours.border,
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
    color: theme.colours.text,
    fontSize: theme.fontSize.small,
    fontWeight: "600",
  },
  fieldChipTextSelected: {
    color: "#FFFFFF",
  },
  empty: {
    textAlign: "center",
    color: theme.colours.mutedText,
    marginTop: theme.spacing.xl,
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colours.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});