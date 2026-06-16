import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";

export function FarmCard({ farm, selected, onSelect, onDelete }) {
    return (
        <TouchableOpacity
            style={[styles.farmCard, selected && styles.farmCardSelected]}
            onPress={onSelect}
            activeOpacity={0.85}
        >
            <Ionicons name="business-outline" size={22} color={theme.colours.primary} />
            <View style={styles.farmInfo}>
                <Text style={styles.farmName}>{farm.name}</Text>
                <Text style={styles.farmLocation}>{farm.location}</Text>
            </View>
            <TouchableOpacity onPress={onDelete}>
                <Ionicons name="trash-outline" size={20} color={theme.colours.danger} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
    farmCardSelected: { borderColor: theme.colours.primary, borderWidth: 2 },
    farmInfo: { flex: 1 },
    farmName: { fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colours.text },
    farmLocation: { fontSize: theme.fontSize.small, color: theme.colours.mutedText },
});