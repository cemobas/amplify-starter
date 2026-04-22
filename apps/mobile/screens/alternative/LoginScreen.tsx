import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Authenticator, ThemeProvider } from "@aws-amplify/ui-react-native";
import { getCurrentUser, signUp } from "aws-amplify/auth";

import { PALETTE } from "../../lib/theme";

type Props = {
  onClose: () => void;
  onSignedIn: () => void;
};

function SignedInRedirect({ onSignedIn }: { onSignedIn: () => void }) {
  useEffect(() => {
    onSignedIn();
  }, [onSignedIn]);
  return (
    <View style={styles.redirectBox}>
      <Text style={styles.redirectText}>Signed in. Taking you home…</Text>
    </View>
  );
}

export function LoginScreen({ onClose, onSignedIn }: Props) {
  useEffect(() => {
    getCurrentUser()
      .then(() => onSignedIn())
      .catch(() => {});
  }, [onSignedIn]);

  return (
    <View style={styles.root}>
      <Pressable onPress={onClose} style={styles.back}>
        <Text style={styles.backText}>← Home</Text>
      </Pressable>
      <ThemeProvider>
        <Authenticator
          services={{
            async handleSignUp(input) {
              return signUp(input);
            },
          }}
        >
          <SignedInRedirect onSignedIn={onSignedIn} />
        </Authenticator>
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PALETTE.paper,
  },
  back: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: 16,
    color: PALETTE.periwinkle,
    fontWeight: "600",
  },
  redirectBox: {
    padding: 24,
    alignItems: "center",
  },
  redirectText: {
    fontSize: 16,
    color: PALETTE.indigo,
  },
});
