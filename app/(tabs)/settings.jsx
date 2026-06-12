import { Alert, Text, useRouter, View } from "react-native";

import { useAuthContext } from "../../context/AuthContext";
// Currently I'm assuming this function exists as auth is not done yet
import { logoutUser } from "../../services/firebase/auth";

export default function SettingsScreen() {
  const router = useRouter();
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
    <View>
      <Text>Settings</Text>
    </View>
  );
}
