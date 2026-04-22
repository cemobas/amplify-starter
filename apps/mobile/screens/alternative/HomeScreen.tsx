import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  fetchUserAttributes,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";

import { PALETTE } from "../../lib/theme";

/** Typed client without importing backend `resource.ts` into the RN bundle. */
type DataClient = {
  queries: {
    sayHello: (input: { name: string }) => Promise<{ data?: string | null }>;
  };
};

const dataClient = generateClient() as DataClient;

type Phase = "checking" | "in" | "out";

type Props = {
  onEvents: () => void;
  onLogin: () => void;
};

export function HomeScreen({ onEvents, onLogin }: Props) {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<Phase>("checking");
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      setEmail(user.signInDetails?.loginId ?? user.username ?? null);
      setPhase("in");
      try {
        const attrs = await fetchUserAttributes();
        const preferred =
          attrs.preferred_username ?? attrs.preferredUsername ?? null;
        const emailValue =
          attrs.email ?? user.signInDetails?.loginId ?? user.username;
        setUsername(preferred);
        setEmail(emailValue ?? null);
      } catch {
        setUsername(null);
        setEmail(user.signInDetails?.loginId ?? user.username ?? null);
      }
    } catch {
      setPhase("out");
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  async function handleSignOut() {
    await signOut();
    setPhase("out");
    setUsername(null);
    setEmail(null);
    setGreeting(null);
    setName("");
  }

  async function sayHello() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const { data } = await dataClient.queries.sayHello({ name });
      setGreeting(data ?? null);
    } catch {
      setGreeting(null);
    } finally {
      setLoading(false);
    }
  }

  if (phase === "checking") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={PALETTE.periwinkle} />
        <Text style={styles.muted}>Loading…</Text>
      </View>
    );
  }

  if (phase === "out") {
    return (
      <View style={styles.outRoot}>
        <View style={styles.outHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.outTitle}>Amplify Starter</Text>
            <Text style={styles.outSubtitle}>
              You’re not signed in. You can still browse the public events board.
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <Pressable style={styles.btnPrimary} onPress={onEvents}>
            <Text style={styles.btnPrimaryText}>View events</Text>
          </Pressable>
          <Pressable style={styles.btnSecondary} onPress={onLogin}>
            <Text style={styles.btnSecondaryText}>Sign in</Text>
          </Pressable>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            To use the authenticated demo (Data query + sign out), sign in first.
            The Events screen is public and uses randomized photos — same idea as
            the web app.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.inRoot}>
      <View style={styles.inHeader}>
        <Pressable style={styles.btnPrimarySm} onPress={onEvents}>
          <Text style={styles.btnPrimaryText}>Events</Text>
        </Pressable>
        <View style={styles.userBlock}>
          {username != null && username !== "" && (
            <Text style={styles.userLine}>
              <Text style={styles.userLabel}>Username: </Text>
              {username}
            </Text>
          )}
          {email != null && email !== "" && (
            <Text style={styles.userLine}>
              <Text style={styles.userLabel}>Email: </Text>
              {email}
            </Text>
          )}
          {(username == null || username === "") &&
            (email == null || email === "") && (
              <Text style={styles.userLine}>Signed in</Text>
            )}
        </View>
        <Pressable onPress={handleSignOut} style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </View>

      <Text style={styles.h1}>Say Hello</Text>
      <View style={styles.helloRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="rgba(39,24,126,0.45)"
          value={name}
          onChangeText={setName}
          onSubmitEditing={sayHello}
          returnKeyType="done"
        />
        <Pressable
          style={[styles.greetBtn, loading && styles.greetBtnDisabled]}
          onPress={sayHello}
          disabled={loading}
        >
          <Text style={styles.greetBtnText}>{loading ? "…" : "Greet"}</Text>
        </Pressable>
      </View>
      {greeting != null && greeting !== "" && (
        <Text style={styles.greeting}>{greeting}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: PALETTE.paper,
  },
  muted: { color: "rgba(39,24,126,0.65)" },
  outRoot: {
    flex: 1,
    padding: 20,
    backgroundColor: PALETTE.paper,
  },
  outHeader: { marginBottom: 16 },
  outTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: PALETTE.indigo,
    letterSpacing: -0.3,
  },
  outSubtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(39,24,126,0.78)",
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 18 },
  btnPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: PALETTE.periwinkle,
    borderWidth: 1,
    borderColor: "rgba(39,24,126,0.12)",
  },
  btnPrimaryText: {
    color: PALETTE.paper,
    fontWeight: "600",
    fontSize: 15,
  },
  btnSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: PALETTE.paper,
    borderWidth: 1,
    borderColor: "rgba(39,24,126,0.12)",
  },
  btnSecondaryText: {
    color: PALETTE.indigo,
    fontWeight: "600",
    fontSize: 15,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "rgba(241,242,246,0.9)",
    borderWidth: 1,
    borderColor: "rgba(39,24,126,0.1)",
  },
  cardText: {
    lineHeight: 22,
    fontSize: 15,
    color: PALETTE.indigo,
  },
  inRoot: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  inHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },
  btnPrimarySm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: PALETTE.periwinkle,
    alignSelf: "flex-start",
  },
  userBlock: { flex: 1, minWidth: 140 },
  userLine: { fontSize: 14, color: "#333", marginBottom: 4 },
  userLabel: { fontWeight: "700" },
  signOutBtn: { alignSelf: "center" },
  signOutText: {
    color: PALETTE.indigo,
    textDecorationLine: "underline",
    fontSize: 15,
  },
  h1: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 14,
    color: PALETTE.indigo,
  },
  helloRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: PALETTE.indigo,
  },
  greetBtn: {
    backgroundColor: PALETTE.periwinkle,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  greetBtnDisabled: { opacity: 0.6 },
  greetBtnText: { color: PALETTE.paper, fontWeight: "600", fontSize: 16 },
  greeting: {
    marginTop: 16,
    fontSize: 16,
    color: PALETTE.indigo,
  },
});
