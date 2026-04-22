import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { HomeScreen } from "./HomeScreen";
import { EventsScreen } from "./EventsScreen";
import { LoginScreen } from "./LoginScreen";

type Route = "home" | "events" | "login";

type Props = {
  onBack: () => void;
};

export function AlternativeRoot({ onBack }: Props) {
  const [route, setRoute] = useState<Route>("home");

  const goHome = useCallback(() => setRoute("home"), []);
  const goEvents = useCallback(() => setRoute("events"), []);
  const goLogin = useCallback(() => setRoute("login"), []);

  return (
    <View style={styles.root}>
      <View style={styles.backBar}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← MJASTO</Text>
        </Pressable>
      </View>
      <View style={styles.screen}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  backBtn: { alignSelf: "flex-start" },
  backText: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "700",
    color: "#555",
  },
  screen: { flex: 1 },
});
