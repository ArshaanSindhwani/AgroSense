import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider, useAuthContext } from "../context/AuthContext";
import { FarmProvider } from "../context/FarmContext";
import { FullScreenSpinner } from "../components/shared/LoadingSpinner";
import useNetworkStatus from "../hooks/useNetworkStatus";
import { ThemeProvider } from "../context/ThemeContext";
import AnimatedSplash from '../components/shared/AnimatedSplash';
import { COLOURS } from "../constants/colours";
import { NetworkIndicator } from "../components/shared/NetworkIndicator";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
    const { loading } = useAuthContext();
    const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);

    useNetworkStatus();

    useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (loading || showAnimatedSplash) {
    return (
      <AnimatedSplash onFinish={() => setShowAnimatedSplash(false)} />
    );
  }

    return (
    <Stack
    screenOptions={{
    headerStyle: {
    backgroundColor: COLOURS.light.primary,
    },
    headerTintColor: "#FFFFFF",
    headerTitleStyle: {
    fontWeight: "700",
    },
    headerRight: () => <NetworkIndicator />,
    }}
    >
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="add-field" options={{ title: "Add Field" }} />
    <Stack.Screen name="add-observation" options={{ title: "Add Observation" }} />
    <Stack.Screen name="field-details" options={{ title: "Field Details" }} />
    <Stack.Screen name="add-farm" options={{ title: "Add Farm" }} />
    </Stack>
    );
    }

    export default function RootLayout() {
    return (
    <AuthProvider>
    <FarmProvider>
    <ThemeProvider>
    <RootLayoutNav />
    <StatusBar style="light" />
    </ThemeProvider>
    </FarmProvider>
    </AuthProvider>
    );
}