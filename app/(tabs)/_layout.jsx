import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../context/AuthContext";
import { theme } from "../../constants/theme";

export default function TabsLayout() {
  const { user, loading } = useAuthContext();
  if (loading) return null;
  if (!user) return <Redirect href="/(auth)/login"/>;
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colours.primary },
        headerTintColor: "#FFFFFF",
        headerTitleAlign: "center",
        headerTitleStyle: { fontWeight: "700" },
        tabBarActiveTintColor: theme.colours.primary,
        tabBarInactiveTintColor: theme.colours.mutedText,
        tabBarStyle: {
          backgroundColor: theme.colours.card,
          borderTopColor: theme.colours.border,
        },
      }}
    >
      <Tabs.Screen
        name="addFarm"
        options={{
          title: "Add Farm",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="fields"
        options={{
          title: "Fields",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="observations"
        options={{
          title: "Observations",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="recommendations"
        options={{
          title: "Recommendations",
          tabBarLabel: "Advice",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bulb-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}