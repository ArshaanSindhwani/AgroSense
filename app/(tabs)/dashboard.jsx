import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
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

export default function HomeScreen() {
    const router = useRouter();
    const { farms, loading, refresh } = useFarmContext();
    const [weather, setWeather] = useState(null);
    const [selectedFarm, setSelectedFarm] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(false);

    useEffect(() => {
        if (farms.length && !selectedFarm) {
            setSelectedFarm(farms[0]);
        }
        async function loadWeather() {
            if (!selectedFarm?.location) return;
            setWeatherLoading(true);
            try {
                const coords = await getCoordinatesFromPostcode(selectedFarm.location);
                const data = await getWeatherData(coords.latitude, coords.longitude);
                setWeather({ ...data, place: coords.location });
            } catch (err) {
                console.log("Weather unavailable:", err.message);
            } finally {
                setWeatherLoading(false);
            }
        }
        loadWeather();
    }, [farms, selectedFarm]);

    function confirmDeleteFarm(farm) {
        Alert.alert(
            "Delete Farm",
            `Are you sure you want to Delete "${farm.name}"? This cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteFarm(farm.id);
                            await refresh();
                        } catch (err) {
                            Alert.alert("Error", err.message);
                        }
                    },
                },
            ]
        );
    }

    if (loading) {
        return (
            <View style={styles.centred}>
                <ActivityIndicator size="large" color={theme.colours.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WeatherCard weather={weather} loading={weatherLoading} />

            <Text style={styles.heading}>Your Farms</Text>
            <FlatList
                data={farms}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
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
    container: { flex: 1, backgroundColor: theme.colours.background, padding: theme.spacing.md },
    centred: { flex: 1, alignItems: "center", justifyContent: "center" },
    heading: { fontSize: theme.fontSize.subtitle, fontWeight: "700", color: theme.colours.text, marginBottom: theme.spacing.sm },
    list: { paddingBottom: 100 },
    empty: { textAlign: "center", color: theme.colours.mutedText, marginTop: theme.spacing.xl },
    fab: {
        position: "absolute",
        bottom: theme.spacing.xl,
        right: theme.spacing.lg,
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: theme.colours.primary,
        alignItems: "center", justifyContent: "center",
        elevation: 4,
    },
});