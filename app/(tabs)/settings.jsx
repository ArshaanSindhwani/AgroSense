import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { useAuthContext } from "../../context/AuthContext";
// Currently I'm assuming this function exists as auth is not done yet
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";
import { logoutUser } from "../../services/firebase/auth";

export default function SettingsScreen() {
  // const router = useRouter();
  const { user } = useAuthContext();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutUser();
          } catch (error) {
            console.log("Failed to logout:", error);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="person" size={32} color={theme.colours.primary} />
        </View>
        <Text style={styles.name}>{user?.displayName || "Farmer"}</Text>
        {!!user?.email && <Text style={styles.email}>{user.email}</Text>}
      </View>

      <View style={styles.card}>
        <SettingsRow
          icon="mail-outline"
          label="Email"
          value={user?.email || "—"}
        />
        <SettingsRow
          icon="key-outline"
          label="User ID"
          value={user?.uid ? `${user.uid.slice(0, 8)}…` : "—"}
        />
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <Ionicons
          name="log-out-outline"
          size={18}
          color={theme.colours.danger}
        />
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SettingsRow({ icon, label, value }) {
  return (
    <View style={styles.row}>
      <Ionicons
        name={icon}
        size={18}
        color={theme.colours.mutedText}
        style={styles.rowIcon}
      />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colours.background,
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
    backgroundColor: theme.colours.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colours.border,
  },
  name: {
    fontSize: theme.fontSize.title,
    fontWeight: "700",
    color: theme.colours.text,
    marginBottom: 4,
  },
  email: {
    fontSize: theme.fontSize.body,
    color: theme.colours.mutedText,
  },
  card: {
    backgroundColor: theme.colours.card,
    borderRadius: theme.radius.md,
    marginHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colours.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colours.border,
  },
  rowIcon: {
    marginRight: theme.spacing.sm,
  },
  rowLabel: {
    flex: 1,
    fontSize: theme.fontSize.body,
    color: theme.colours.mutedText,
  },
  rowValue: {
    fontSize: theme.fontSize.body,
    fontWeight: "600",
    color: theme.colours.text,
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
    borderColor: theme.colours.danger,
  },
  logoutText: {
    color: theme.colours.danger,
    fontWeight: "600",
    fontSize: theme.fontSize.body,
  },
});
