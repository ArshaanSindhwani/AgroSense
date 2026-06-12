import { Stack, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuthContext } from "../context/AuthContext";
import { FarmProvider } from "../context/FarmContext";
import{ FullScreenSpinner } from "../components/shared/LoadingSpinner"
import { theme } from "../constants/theme";

function RootLayoutNav() {
  const { user, loading } = useAuthContext();

  if (loading) return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colours.primary,
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "700",
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
      <Stack.Screen name="add-field" options={{ title: "Add Field" }} />
      <Stack.Screen name="add-observation" options={{ title: "Add Observation" }} />
      <Stack.Screen name="field-details" options={{ title: "Field Details" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <FarmProvider>
        <RootLayoutNav />
        <StatusBar style="light" />
      </FarmProvider>
    </AuthProvider>
  );
}