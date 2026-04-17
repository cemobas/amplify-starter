"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  fetchUserAttributes,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function App() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  /** checking = spinner; out = not signed in, redirecting to /login; in = show app */
  const [sessionPhase, setSessionPhase] = useState<
    "checking" | "in" | "out"
  >("checking");
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      setEmail(user.signInDetails?.loginId ?? user.username ?? null);
      setSessionPhase("in");
      try {
        const attrs = await fetchUserAttributes();
        const preferred =
          attrs.preferred_username ?? attrs.preferredUsername ?? null;
        const emailValue =
          attrs.email ??
          user.signInDetails?.loginId ??
          user.username;
        setUsername(preferred);
        setEmail(emailValue ?? null);
      } catch {
        setUsername(null);
        setEmail(user.signInDetails?.loginId ?? user.username ?? null);
      }
    } catch {
      setSessionPhase("out");
    }
  }, [router]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  async function sayHello() {
    if (!name.trim()) return;
    setLoading(true);
    const { data } = await client.queries.sayHello({ name });
    setGreeting(data ?? null);
    setLoading(false);
  }

  if (sessionPhase === "checking") {
    return (
      <main style={{ padding: "2rem" }}>
        <p>Loading…</p>
      </main>
    );
  }

  if (sessionPhase === "out") {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "2rem",
          background:
            "linear-gradient(180deg, rgba(241,242,246,1) 0%, rgba(174,184,254,0.20) 80%, rgba(117,139,253,0.10) 100%)",
          color: "#27187E",
        }}
      >
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 22,
            }}
          >
            <div>
              <h1 style={{ margin: 0, letterSpacing: "-0.02em" }}>
                Amplify Starter
              </h1>
              <p style={{ margin: "8px 0 0", opacity: 0.78 }}>
                You’re not signed in. You can still browse the public events
                page.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link
                href="/events"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "#758BFD",
                  color: "#F1F2F6",
                  textDecoration: "none",
                  border: "1px solid rgba(39,24,126,0.12)",
                  boxShadow: "0 16px 36px rgba(39,24,126,0.14)",
                }}
              >
                View events
              </Link>
              <Link
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "#F1F2F6",
                  color: "#27187E",
                  textDecoration: "none",
                  border: "1px solid rgba(39,24,126,0.12)",
                }}
              >
                Sign in
              </Link>
            </div>
          </div>

          <div
            style={{
              borderRadius: 18,
              padding: "1.25rem",
              background: "rgba(241,242,246,0.82)",
              border: "1px solid rgba(39,24,126,0.10)",
              boxShadow: "0 18px 45px rgba(39,24,126,0.10)",
            }}
          >
            <p style={{ margin: 0, lineHeight: 1.55 }}>
              To use the authenticated demo (query + sign out), sign in first.
              The <strong>Events</strong> page is public and uses randomized
              images.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "1.5rem", maxWidth: "32rem" }}>
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.75rem",
          marginBottom: "1.5rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid #e8e8e8",
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href="/events"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 12px",
              borderRadius: 12,
              background: "#758BFD",
              color: "#F1F2F6",
              textDecoration: "none",
              border: "1px solid rgba(39,24,126,0.12)",
            }}
          >
            Events
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            fontSize: "0.95rem",
            color: "#333",
          }}
        >
          {username != null && username !== "" && (
            <span>
              <strong>Username:</strong> {username}
            </span>
          )}
          {email != null && email !== "" && (
            <span>
              <strong>Email:</strong> {email}
            </span>
          )}
          {(username == null || username === "") &&
            (email == null || email === "") && <span>Signed in</span>}
        </div>
        <button type="button" onClick={handleSignOut}>
          Sign out
        </button>
      </header>
      <h1>Say Hello</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sayHello()}
        />
        <button onClick={sayHello} disabled={loading}>
          {loading ? "..." : "Greet"}
        </button>
      </div>
      {greeting && <p>{greeting}</p>}
    </main>
  );
}
