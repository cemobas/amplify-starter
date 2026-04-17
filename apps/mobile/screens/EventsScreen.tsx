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
  const tagLine = ev.tags.join(" · ");

  return (
    <View style={tile.root}>
      <Image source={{ uri: imageUrl }} style={tile.leadImage} />
      <View style={tile.article}>
        <Text style={tile.section} numberOfLines={2}>
          {tagLine}
        </Text>
        <Text style={tile.headline} numberOfLines={3}>
          {ev.title}
        </Text>
        <Text style={tile.standfirst} numberOfLines={4}>
          {ev.description}
        </Text>
        <View style={tile.ruleAccent} />
        <View style={tile.metaRow}>
          <Text style={tile.metaText}>{ev.date}</Text>
          <Text style={tile.metaSep}>·</Text>
          <Text style={tile.metaText} numberOfLines={1}>
            {ev.community}
          </Text>
        </View>
        <Text style={tile.placeLine} numberOfLines={1}>
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
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: PALETTE.paper,
    borderWidth: 1,
    borderColor: "rgba(39,24,126,0.1)",
    shadowColor: PALETTE.indigo,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  leadImage: {
    width: "100%",
    height: 168,
    backgroundColor: "rgba(174,184,254,0.35)",
  },
  article: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  section: {
    fontSize: 11,
    fontFamily: FONT.semibold,
    letterSpacing: 1.35,
    textTransform: "uppercase",
    color: PALETTE.periwinkle,
    marginBottom: 6,
  },
  headline: {
    fontSize: 20,
    fontFamily: FONT.extrabold,
    letterSpacing: -0.4,
    lineHeight: 25,
    color: PALETTE.indigo,
  },
  standfirst: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: FONT.regular,
    lineHeight: 22,
    color: "rgba(39,24,126,0.78)",
  },
  ruleAccent: {
    marginTop: 14,
    marginBottom: 10,
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: PALETTE.orange,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontFamily: FONT.medium,
    color: "rgba(39,24,126,0.52)",
    letterSpacing: 0.15,
  },
  metaSep: {
    fontSize: 12,
    fontFamily: FONT.medium,
    color: "rgba(39,24,126,0.35)",
  },
  placeLine: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: FONT.semibold,
    color: PALETTE.indigo,
    letterSpacing: -0.1,
  },
});
