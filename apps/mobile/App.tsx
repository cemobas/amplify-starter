import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";

import { HomeScreen } from "./screens/HomeScreen";
import { EventsScreen } from "./screens/EventsScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { PALETTE } from "./lib/theme";

type Route = "home" | "events" | "login";

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const [route, setRoute] = useState<Route>("home");

  const goHome = useCallback(() => setRoute("home"), []);
  const goEvents = useCallback(() => setRoute("events"), []);
  const goLogin = useCallback(() => setRoute("login"), []);

  if (!fontsLoaded) {
    return (
      <View style={styles.fontGate}>
        <ActivityIndicator size="large" color={PALETTE.periwinkle} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar style="dark" />
        {route === "home" && (
          <HomeScreen onEvents={goEvents} onLogin={goLogin} />
        )}
        {route === "events" && (
          <EventsScreen onHome={goHome} onLogin={goLogin} />
        )}
        {route === "login" && (
          <LoginScreen onClose={goHome} onSignedIn={goHome} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fontGate: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PALETTE.paper,
  },
});
