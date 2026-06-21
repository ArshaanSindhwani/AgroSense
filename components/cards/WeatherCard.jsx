import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { theme } from "../../constants/theme";

export function WeatherCard({ weather, loading }) {
    return (
        <View style={styles.weatherCard}>
            {loading ? (
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
    );
}

const styles = StyleSheet.create({
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
});