import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "../context/AuthContext";
import { FarmProvider } from "../context/FarmContext";
import { theme } from "../constants/theme";

export default function RootLayout() {
  return (
    <AuthProvider>
      <FarmProvider>
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
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="add-field"
            options={{
              title: "Add Field",
            }}
          />

          <Stack.Screen
            name="add-observation"
            options={{
              title: "Add Observation",
            }}
          />

          <Stack.Screen
            name="field-details"
            options={{
              title: "Field Details",
            }}
          />
        </Stack>

        <StatusBar style="light" />
      </FarmProvider>
    </AuthProvider>
  );
}