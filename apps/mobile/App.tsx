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

import { MjastoScreen } from "./screens/MjastoScreen";
import { AlternativeRoot } from "./screens/alternative/AlternativeRoot";
import { PALETTE } from "./lib/theme";

type Route = "mjasto" | "alternative";

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const [route, setRoute] = useState<Route>("mjasto");

  const goMjasto = useCallback(() => setRoute("mjasto"), []);
  const goAlternative = useCallback(() => setRoute("alternative"), []);

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
        {route === "mjasto" && (
          <MjastoScreen onAlternative={goAlternative} />
        )}
        {route === "alternative" && (
          <AlternativeRoot onBack={goMjasto} />
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
