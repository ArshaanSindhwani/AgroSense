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
            <View style={styles.weatherCard}>
                {weatherLoading ? (
                    <ActivityIndicator color={theme.colours.primary} />
                ) : weather ? (
                    <>
                        <Text style={styles.weatherPlace}>{weather.place}</Text>
                        <Text style={styles.weatherTemp}>
                            {Math.round(weather.temperature)}°C
                        </Text>
                        <Text style={styles.weatherDetail}>
                            Humidity {weather.humidity}%  ·  Rain {weather.rainfall}mm
                        </Text>
                    </>
                ) : (
                    <Text style={styles.weatherDetail}>
                        Add a farm to see local weather.
                    </Text>
                )}
            </View>

            {/* Farms list */}
            <Text style={styles.heading}>Your Farms</Text>
            <FlatList
                data={farms}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.farmCard,
                            selectedFarm?.id === item.id && styles.farmCardSelected,
                        ]}
                        onPress={() => setSelectedFarm(item)}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="business-outline" size={22} color={theme.colours.primary} />
                        <View style={styles.farmInfo}>
                            <Text style={styles.farmName}>{item.name}</Text>
                            <Text style={styles.farmLocation}>{item.location}</Text>
                        </View>
                        <TouchableOpacity onPress={() => confirmDeleteFarm(item)}>
                            <Ionicons name="trash-outline" size={20} color={theme.colours.danger} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
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
    weatherCard: {
        backgroundColor: theme.colours.primary,
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        alignItems: "center",
        marginBottom: theme.spacing.lg,
    },
    weatherPlace: { color: "#FFFFFF", fontSize: theme.fontSize.body, marginBottom: 4 },
    weatherTemp: { color: "#FFFFFF", fontSize: 40, fontWeight: "800" },
    weatherDetail: { color: "#FFFFFF", fontSize: theme.fontSize.small, marginTop: 4 },
    heading: { fontSize: theme.fontSize.subtitle, fontWeight: "700", color: theme.colours.text, marginBottom: theme.spacing.sm },
    list: { paddingBottom: 100 },
    farmCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        backgroundColor: theme.colours.card,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colours.border,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    farmCardSelected: {borderColor: theme.colours.primary, borderWidth: 2},
    farmInfo: { flex: 1 },
    farmName: { fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colours.text },
    farmLocation: { fontSize: theme.fontSize.small, color: theme.colours.mutedText },
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