import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useThemeColor } from "../../hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";

export default function SettingsScreen() {
  const { user, logout } = useAuthContext();
  const {isDark, toggleTheme} = useTheme()

  const background = useThemeColor({}, "background");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const mutedText = useThemeColor({}, "mutedText");
  const border = useThemeColor({}, "border");
  const primary = useThemeColor({}, "primary");
  const danger = useThemeColor({}, "danger");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.log("Failed to logout:", error);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: card, borderColor: border },
          ]}
        >
          <Ionicons name="person" size={32} color={primary} />
        </View>

        <Text style={[styles.name, { color: text }]}>
          {user?.displayName || "Farmer"}
        </Text>

        {!!user?.email && (
          <Text style={[styles.email, { color: mutedText }]}>
            {user.email}
          </Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <SettingsRow
          icon="mail-outline"
          label="Email"
          value={user?.email || "—"}
          mutedColor={mutedText}
          textColor={text}
          borderColor={border}
          isLast
        />
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: card,
            borderColor: border,
            marginTop: theme.spacing.md,
          },
        ]}
      >
        <View style={[styles.row, { borderBottomColor: border }]}>
          <Ionicons
            name={isDark ? "moon" : "sunny-outline"}
            size={18}
            color={mutedText}
            style={styles.rowIcon}
          />

          <Text style={[styles.rowLabel, { color: mutedText }]}>
            Dark Mode
          </Text>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: border, true: primary }}
            thumbColor={card}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: danger }]}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <Ionicons name="log-out-outline" size={18} color={danger} />

        <Text style={[styles.logoutText, { color: danger }]}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  mutedColor,
  textColor,
  borderColor,
  isLast,
}) {
  return (
    <View
      style={[
        styles.row,
        {
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: borderColor,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={mutedColor}
        style={styles.rowIcon}
      />

      <Text style={[styles.rowLabel, { color: mutedColor }]}>{label}</Text>

      <Text style={[styles.rowValue, { color: textColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    borderWidth: 1,
  },
  name: {
    fontSize: theme.fontSize.title,
    fontWeight: "700",
    marginBottom: 4,
  },
  email: {
    fontSize: theme.fontSize.body,
  },
  card: {
    borderRadius: theme.radius.md,
    marginHorizontal: theme.spacing.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
  },
  rowIcon: {
    marginRight: theme.spacing.sm,
  },
  rowLabel: {
    flex: 1,
    fontSize: theme.fontSize.body,
  },
  rowValue: {
    fontSize: theme.fontSize.body,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    margin: theme.spacing.md,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
  },
  logoutText: {
    fontWeight: "600",
    fontSize: theme.fontSize.body,
  },
});