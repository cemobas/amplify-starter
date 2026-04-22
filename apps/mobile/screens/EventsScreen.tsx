import { useMemo } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { makeMockEvents, type MockEvent } from "../lib/mockEvents";
import { PALETTE } from "../lib/theme";
import { FONT } from "../lib/typography";

const HERO = require("../assets/lazienki.png");

type Props = {
  onHome: () => void;
  onLogin: () => void;
};

function EventCard({ ev }: { ev: MockEvent }) {
  const imageUrl = `https://picsum.photos/seed/${ev.seed}/720/540`;

  return (
    <View style={tile.root}>
      <Image source={{ uri: imageUrl }} style={tile.bgImage} />
      <LinearGradient
        colors={[
          "rgba(0,0,0,0)",
          "rgba(0,0,0,0.12)",
          "rgba(0,0,0,0.52)",
          "rgba(0,0,0,0.82)",
        ]}
        locations={[0, 0.42, 0.72, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={tile.footer}>
        <Text style={tile.eyebrow} numberOfLines={1}>
          {ev.date} · {ev.community}
        </Text>
        <Text style={tile.title} numberOfLines={2}>
          {ev.title}
        </Text>
        <Text style={tile.place} numberOfLines={1}>
          {ev.location}
        </Text>
      </View>
    </View>
  );
}

export function EventsScreen({ onHome, onLogin }: Props) {
  const insets = useSafeAreaInsets();
  const seed = useMemo(() => Math.floor(Math.random() * 1_000_000), []);
  const events = useMemo(() => makeMockEvents(12, seed), [seed]);

  const renderItem: ListRenderItem<MockEvent> = ({ item }) => (
    <EventCard ev={item} />
  );

  const header = (
    <View>
      <ImageBackground source={HERO} style={styles.hero} imageStyle={styles.heroImage}>
        <LinearGradient
          colors={["rgba(39,24,126,0.86)", "rgba(39,24,126,0.55)", "rgba(255,77,0,0.18)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.3 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.heroInner, { paddingTop: insets.top + 8 }]}>
          <View style={styles.pill}>
            <View style={styles.pillDot} />
            <Text style={styles.pillText}>Public events board</Text>
          </View>
          <Text style={styles.heroTitle}>What’s happening this month</Text>
          <Text style={styles.heroSub}>
            Mock cards using the web palette, a Łazienki banner, and randomized
            photos. No sign-in required.
          </Text>
          <View style={styles.heroActions}>
            <Pressable style={styles.heroGhost} onPress={onHome}>
              <Text style={styles.heroGhostText}>Home</Text>
            </Pressable>
            <Pressable style={styles.heroSolid} onPress={onLogin}>
              <Text style={styles.heroSolidText}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.sectionHead}>
        <View>
          <Text style={styles.sectionTitle}>Featured picks</Text>
          <Text style={styles.sectionHint}>
            Reload the app to reshuffle photos and tags.
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={header}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PALETTE.paper,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  hero: {
    height: 280,
    marginHorizontal: -16,
    marginBottom: 16,
    justifyContent: "flex-end",
  },
  heroImage: { resizeMode: "cover" },
  heroInner: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(241,242,246,0.14)",
    borderWidth: 1,
    borderColor: "rgba(241,242,246,0.22)",
  },
  pillDot: {
    width: 10,
    height: 10,
    borderRadius: 99,
    backgroundColor: PALETTE.orange,
  },
  pillText: {
    color: "rgba(241,242,246,0.92)",
    fontSize: 13,
    fontFamily: FONT.semibold,
  },
  heroTitle: {
    marginTop: 10,
    fontSize: 28,
    fontFamily: FONT.extrabold,
    color: PALETTE.paper,
    letterSpacing: -0.55,
    lineHeight: 32,
  },
  heroSub: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: FONT.regular,
    color: "rgba(241,242,246,0.9)",
    maxWidth: 520,
  },
  heroActions: { flexDirection: "row", gap: 10, marginTop: 14 },
  heroGhost: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(241,242,246,0.12)",
    borderWidth: 1,
    borderColor: "rgba(241,242,246,0.22)",
  },
  heroGhostText: {
    color: PALETTE.paper,
    fontSize: 15,
    fontFamily: FONT.semibold,
  },
  heroSolid: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: PALETTE.paper,
    borderWidth: 1,
    borderColor: "rgba(39,24,126,0.12)",
  },
  heroSolidText: {
    color: PALETTE.indigo,
    fontSize: 15,
    fontFamily: FONT.semibold,
  },
  sectionHead: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 13,
    fontFamily: FONT.extrabold,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: PALETTE.periwinkle,
  },
  sectionHint: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: FONT.medium,
    color: "rgba(39,24,126,0.72)",
  },
});

const tile = StyleSheet.create({
  root: {
    height: 232,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: PALETTE.indigoDeep,
    borderWidth: 1,
    borderColor: "rgba(39,24,126,0.12)",
    shadowColor: PALETTE.indigo,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 4,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    backgroundColor: "rgba(174,184,254,0.35)",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 14,
    gap: 6,
  },
  eyebrow: {
    fontSize: 10,
    fontFamily: FONT.bold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "rgba(241,242,246,0.78)",
  },
  title: {
    fontSize: 19,
    fontFamily: FONT.extrabold,
    letterSpacing: -0.35,
    lineHeight: 24,
    color: PALETTE.paper,
  },
  place: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: FONT.semibold,
    color: "rgba(241,242,246,0.88)",
  },
});
