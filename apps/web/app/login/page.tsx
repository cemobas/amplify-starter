"use client";

import { Authenticator, Button, View } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, signUp } from "aws-amplify/auth";

function ConfirmSignUpCancelFooter() {
  const router = useRouter();
  return (
    <View marginTop="1rem" textAlign="center">
      <Button
        type="button"
        variation="link"
        size="small"
        onClick={() => router.replace("/")}
      >
        Cancel — return home
      </Button>
    </View>
  );
}

function RedirectWhenSignedIn() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <p>Signed in. Redirecting…</p>
    </main>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const maxWait = window.setTimeout(() => {
      setCheckingSession(false);
    }, 10_000);

    getCurrentUser()
      .then(() => {
        window.clearTimeout(maxWait);
        router.replace("/");
      })
      .catch(() => {
        window.clearTimeout(maxWait);
        setCheckingSession(false);
      });

    return () => window.clearTimeout(maxWait);
  }, [router]);

  if (checkingSession) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <Authenticator
        components={{
          ConfirmSignUp: {
            Footer: ConfirmSignUpCancelFooter,
          },
        }}
        services={{
          async handleSignUp(input) {
            return signUp(input);
          },
        }}
        formFields={{
          signIn: {
            username: {
              label: "Email",
              placeholder: "Your email address",
            },
          },
          signUp: {
            preferred_username: {
              label: "Username",
              placeholder: "Choose a display username",
            },
          },
        }}
      >
        {() => <RedirectWhenSignedIn />}
      </Authenticator>
    </main>
  );
}
