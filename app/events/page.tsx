"use client";

import Link from "next/link";
import { useMemo } from "react";

type Tag =
  | "sports"
  | "new"
  | "seniors"
  | "kids"
  | "students"
  | "festival"
  | "art"
  | "chess"
  | "seminar"
  | "concert"
  | "metal"
  | "pop";

type FeatureFlag = "NEW" | "FREE" | "HIT";
type VenueKind = "hub" | "circle" | "venue";

type MockEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  tags: Tag[];
  community: string;
  venueKind: VenueKind;
  description: string;
  feature: FeatureFlag | null;
  seed: number;
};

const PALETTE = {
  indigo: "#27187E",
  /** Hover veil: same hue family, noticeably darker than `indigo`. */
  indigoDeep: "#0c061f",
  periwinkle: "#758BFD",
  lavender: "#AEB8FE",
  paper: "#F1F2F6",
  orange: "#FF4D00",
} as const;

const TAGS: Tag[] = [
  "sports",
  "new",
  "seniors",
  "kids",
  "students",
  "festival",
  "art",
  "chess",
  "seminar",
  "concert",
  "metal",
  "pop",
];

const FEATURES: FeatureFlag[] = ["NEW", "FREE", "HIT"];
const VENUE_KINDS: VenueKind[] = ["hub", "circle", "venue"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function seeded(seed: number) {
  // Deterministic-ish PRNG for stable “random” cards per render.
  // Source: simple LCG
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

function communityFromTitle(title: string, pick: () => number) {
  const t = title.toLowerCase();
  const nouns = (() => {
    if (t.includes("chess")) return ["Chess", "Checkmate", "Board Games"];
    if (t.includes("run")) return ["Runners", "Sunset", "Track"];
    if (t.includes("art") || t.includes("design")) return ["Art", "Design", "Studio"];
    if (
      t.includes("music") ||
      t.includes("concert") ||
      t.includes("pop") ||
      t.includes("metal")
    )
      return ["Music", "Live", "Stage"];
    if (t.includes("kids")) return ["Kids", "Makers", "Play"];
    if (t.includes("seniors")) return ["Seniors", "Coffee", "Stories"];
    if (t.includes("career") || t.includes("seminar"))
      return ["Career", "Talks", "Workshop"];
    if (t.includes("festival")) return ["Festival", "City", "Weekend"];
    return ["Community", "Meetup", "Friends"];
  })();

  const shapes = ["Community", "Group", "Hub", "Campus", "Neighborhood"];
  const noun = nouns[Math.floor(pick() * nouns.length)] ?? "Community";
  const shape = shapes[Math.floor(pick() * shapes.length)] ?? "Group";
  return `${noun} ${shape}`;
}

function makeMockEvents(count: number, seed: number): MockEvent[] {
  const rnd = seeded(seed);
  const now = new Date();
  const cities = [
    "Warsaw",
    "Kraków",
    "Gdańsk",
    "Wrocław",
    "Poznań",
    "Łódź",
    "Katowice",
  ];

  const titles = [
    "Sunset Run",
    "Beginner Chess Meetup",
    "Open-Air Art Jam",
    "Campus Career Seminar",
    "Community Music Night",
    "Kids Maker Morning",
    "Seniors Coffee & Stories",
    "City Festival Warm‑Up",
    "Indie Pop Showcase",
    "Metal Night Live",
    "Weekend Sports Social",
    "Design Circle: Posters",
  ];

  const blurbs = [
    "Bring a friend (or come solo) for a relaxed hangout with good people, quick intros, and a simple plan you can join at any time.",
    "A friendly, low-pressure meetup with a short warm‑up, a main activity, and time to chat. Perfect if you’re new or just curious.",
    "A community session with bite‑sized moments: a mini opener, a main segment, and a cool-down. Expect good vibes and easy conversations.",
    "Come as you are. We’ll keep it simple: show up, pick your pace, and enjoy a welcoming group — plus a few surprises along the way.",
  ];

  return Array.from({ length: count }, (_, i) => {
    const dayOffset = Math.floor(rnd() * 28) + 1;
    const date = new Date(now);
    date.setDate(now.getDate() + dayOffset);

    const title = titles[Math.floor(rnd() * titles.length)] ?? `Event ${i + 1}`;
    const location =
      cities[Math.floor(rnd() * cities.length)] ?? "City Center";

    const hour = clamp(9 + Math.floor(rnd() * 10), 9, 20);
    const minute = rnd() > 0.7 ? "30" : "00";
    const dateStr = `${date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })} · ${hour}:${minute}`;

    const tagCount = 2 + Math.floor(rnd() * 2); // 2–3
    const picked: Tag[] = [];
    while (picked.length < tagCount) {
      const t = TAGS[Math.floor(rnd() * TAGS.length)] ?? "new";
      if (!picked.includes(t)) picked.push(t);
    }

    const feature =
      rnd() < 0.45
        ? (FEATURES[Math.floor(rnd() * FEATURES.length)] ?? "NEW")
        : null;

    const community = communityFromTitle(title, rnd);
    const venueKind =
      VENUE_KINDS[Math.floor(rnd() * VENUE_KINDS.length)] ?? "hub";
    const description =
      blurbs[Math.floor(rnd() * blurbs.length)] ??
      "A friendly community meetup with a simple flow and time to connect.";

    const seedForImg = Math.floor(rnd() * 100000) + i * 97;

    return {
      id: `${seed}-${i}`,
      title,
      date: dateStr,
      location,
      tags: picked,
      community,
      venueKind,
      description,
      feature,
      seed: seedForImg,
    };
  });
}

function EventCard({ ev }: { ev: MockEvent }) {
  const imageUrl = `https://picsum.photos/seed/${ev.seed}/720/540`;
  const venueLabel = ev.venueKind.toUpperCase();
  const tagLine = ev.tags.join(" · ");
  return (
    <article
      className="event-card"
      style={{
        position: "relative",
        height: 260,
        borderRadius: 18,
        overflow: "hidden",
        background: PALETTE.paper,
        border: `1px solid rgba(39, 24, 126, 0.10)`,
        boxShadow: "0 18px 45px rgba(39, 24, 126, 0.12)",
      }}
    >
      <div className="event-card__media" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <div
          className="event-card__photo"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(1.05)",
            transform: "scale(1.02)",
          }}
        />
        <div
          className="event-card__gradient"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(39,24,126,0.10) 0%, rgba(39,24,126,0.18) 68%, rgba(39,24,126,0.62) 86%, rgba(39,24,126,0.82) 100%)",
          }}
        />
      </div>

      <div
        className="event-card__veil"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: PALETTE.indigoDeep,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          pointerEvents: "none",
        }}
      />

      {/* Top row: venue + optional feature (left) · date (right) */}
      <div
        className="event-card__chrome event-card__toprow"
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          right: 14,
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 6,
            minWidth: 0,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 7px",
              borderRadius: 4,
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: PALETTE.paper,
              background: PALETTE.periwinkle,
              border: `1px solid rgba(241,242,246,0.28)`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
            }}
          >
            {venueLabel}
          </span>
          {ev.feature != null && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "2px 7px",
                borderRadius: 4,
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: PALETTE.paper,
                background: PALETTE.orange,
                border: "1px solid rgba(0,0,0,0.12)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              {ev.feature}
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "rgba(241,242,246,0.92)",
            textAlign: "right",
            textShadow: "0 2px 8px rgba(0,0,0,0.35)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "58%",
            flexShrink: 0,
          }}
        >
          {ev.date}
        </span>
      </div>

      <div
        className="event-card__description"
        style={{
          position: "absolute",
          zIndex: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 0,
          color: "rgba(241,242,246,0.96)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 5,
              minWidth: 0,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "2px 7px",
                borderRadius: 4,
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: PALETTE.paper,
                background: PALETTE.periwinkle,
                border: "1px solid rgba(241,242,246,0.28)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
              }}
            >
              {venueLabel}
            </span>
            {ev.feature != null && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px 7px",
                  borderRadius: 4,
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: PALETTE.paper,
                  background: PALETTE.orange,
                  border: "1px solid rgba(0,0,0,0.12)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                {ev.feature}
              </span>
            )}
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.03em",
              color: "rgba(241,242,246,0.88)",
              textAlign: "right",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "55%",
              flexShrink: 0,
            }}
          >
            {ev.date}
          </span>
        </div>

        <div
          aria-hidden="true"
          style={{
            height: 1,
            background: "rgba(241,242,246,0.14)",
            marginBottom: 10,
          }}
        />

        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: PALETTE.lavender,
            opacity: 0.95,
            marginBottom: 6,
          }}
        >
          {ev.community}
        </div>

        <h3
          style={{
            margin: 0,
            fontSize: 16,
            lineHeight: 1.22,
            letterSpacing: "-0.02em",
            fontWeight: 800,
            color: "rgba(241,242,246,0.98)",
            marginBottom: 8,
          }}
        >
          {ev.title}
        </h3>

        <p
          style={{
            margin: 0,
            flex: "1 1 auto",
            minHeight: 0,
            fontSize: 12.5,
            lineHeight: 1.55,
            opacity: 0.9,
            fontWeight: 400,
            display: "-webkit-box",
            WebkitLineClamp: 5,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {ev.description}
        </p>

        <div
          aria-hidden="true"
          style={{
            height: 1,
            background: "rgba(241,242,246,0.14)",
            marginTop: 10,
            marginBottom: 8,
          }}
        />

        <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.92 }}>
          📍 {ev.location}
        </div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "rgba(241,242,246,0.58)",
            marginTop: 4,
          }}
        >
          {tagLine}
        </div>
      </div>

      <div
        className="event-card__footer"
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 14,
          zIndex: 4,
          color: PALETTE.paper,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: PALETTE.lavender,
            opacity: 0.95,
            textShadow: "0 2px 10px rgba(0,0,0,0.35)",
          }}
        >
          {ev.community}
        </div>

        <h3
          style={{
            margin: 0,
            fontSize: 19,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            fontWeight: 700,
            textShadow: "0 10px 28px rgba(0,0,0,0.45)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {ev.title}
        </h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: "6px 10px",
            fontSize: 12,
            color: "rgba(241,242,246,0.9)",
          }}
        >
          <span style={{ fontWeight: 600 }}>📍 {ev.location}</span>
        </div>

        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "rgba(241,242,246,0.65)",
            borderTop: "1px solid rgba(241,242,246,0.18)",
            paddingTop: 8,
            marginTop: 2,
          }}
        >
          {tagLine}
        </div>
      </div>

      <style jsx>{`
        .event-card__veil {
          opacity: 0;
          transition: opacity 180ms ease;
        }

        .event-card:hover .event-card__veil {
          opacity: 1;
        }

        .event-card__photo {
          transition: filter 200ms ease, transform 200ms ease;
        }

        .event-card:hover .event-card__photo {
          filter: blur(16px) saturate(1.05);
          transform: scale(1.08);
        }

        .event-card__gradient {
          transition: opacity 180ms ease;
        }

        .event-card:hover .event-card__gradient {
          opacity: 0;
        }

        .event-card__chrome {
          transition: opacity 140ms ease;
        }

        .event-card:hover .event-card__chrome {
          opacity: 0;
          pointer-events: none;
        }

        .event-card__description {
          opacity: 0;
          transform: translateY(6px);
          pointer-events: none;
          left: 12px;
          right: 12px;
          top: 12px;
          bottom: 12px;
          border-radius: 12px;
          padding: 14px 14px 12px;
          background: rgba(39, 24, 126, 0.42);
          border: 1px solid rgba(241, 242, 246, 0.18);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
          transition:
            opacity 160ms ease,
            transform 180ms ease,
            left 180ms ease,
            right 180ms ease,
            top 180ms ease,
            bottom 180ms ease,
            border-radius 180ms ease,
            padding 180ms ease,
            background 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .event-card:hover .event-card__description {
          opacity: 1;
          transform: translateY(0);
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          border-radius: 18px;
          padding: 18px;
          background: transparent;
          border-color: transparent;
          box-shadow: none;
        }

        .event-card__footer {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 140ms ease, transform 180ms ease;
        }

        .event-card:hover .event-card__footer {
          opacity: 0;
          pointer-events: none;
          transform: translateY(6px);
        }
      `}</style>
    </article>
  );
}

export default function EventsPage() {
  const seed = useMemo(() => Math.floor(Math.random() * 1_000_000), []);
  const events = useMemo(() => makeMockEvents(12, seed), [seed]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${PALETTE.paper} 0%, rgba(174,184,254,0.20) 60%, rgba(117,139,253,0.10) 100%)`,
        color: PALETTE.indigo,
      }}
    >
      <section
        className="events-hero"
        style={{
          position: "relative",
          height: 360,
          borderBottom: `1px solid rgba(39, 24, 126, 0.10)`,
          overflow: "hidden",
          backgroundImage: "url(/pics/lazienki.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(110deg, rgba(39,24,126,0.86) 0%, rgba(39,24,126,0.62) 45%, rgba(255,77,0,0.20) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 1.25rem 1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "7px 12px",
                    borderRadius: 999,
                    background: "rgba(241,242,246,0.14)",
                    border: "1px solid rgba(241,242,246,0.22)",
                    color: "rgba(241,242,246,0.92)",
                    fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: PALETTE.orange,
                      boxShadow: "0 10px 20px rgba(255,77,0,0.22)",
                    }}
                  />
                  Public events board
                </div>
                <h1
                  style={{
                    margin: "10px 0 0",
                    fontSize: 34,
                    lineHeight: 1.06,
                    letterSpacing: "-0.02em",
                    color: PALETTE.paper,
                    textShadow: "0 18px 40px rgba(0,0,0,0.35)",
                  }}
                >
                  What’s happening this month
                </h1>
                <p
                  style={{
                    margin: "10px 0 0",
                    maxWidth: 620,
                    color: "rgba(241,242,246,0.88)",
                    lineHeight: 1.5,
                    fontSize: 14,
                  }}
                >
                  Mock cards using your palette, a Łazienki banner, and
                  randomized photos. No sign-in required.
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <Link
                  href="/"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 14px",
                    borderRadius: 12,
                    color: PALETTE.paper,
                    textDecoration: "none",
                    background: "rgba(241,242,246,0.12)",
                    border: "1px solid rgba(241,242,246,0.22)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  Home
                </Link>
                <Link
                  href="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 14px",
                    borderRadius: 12,
                    color: PALETTE.indigo,
                    textDecoration: "none",
                    background: PALETTE.paper,
                    border: "1px solid rgba(39,24,126,0.12)",
                  }}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "1.25rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 14,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                letterSpacing: "-0.01em",
              }}
            >
              Featured picks
            </h2>
            <p style={{ margin: "6px 0 0", color: "rgba(39,24,126,0.74)" }}>
              Refresh the page to reshuffle photos and tags.
            </p>
          </div>
          <div
            style={{
              display: "inline-flex",
              gap: 8,
              padding: 8,
              borderRadius: 14,
              background: "rgba(174,184,254,0.22)",
              border: "1px solid rgba(39,24,126,0.08)",
            }}
          >
            {(["hub", "circle", "event"] as const).map((k) => (
              <span
                key={k}
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: k === "event" ? PALETTE.periwinkle : PALETTE.paper,
                  color: k === "event" ? PALETTE.paper : PALETTE.indigo,
                  border: `1px solid rgba(39,24,126,0.10)`,
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                {k}
              </span>
            ))}
          </div>
        </div>

        <div
          className="events-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 14,
          }}
        >
          {events.map((ev) => (
            <div key={ev.id}>
              <EventCard ev={ev} />
            </div>
          ))}
        </div>

        <style jsx global>{`
          .events-grid > div {
            grid-column: span 12;
          }
          @media (min-width: 720px) {
            .events-grid > div {
              grid-column: span 6;
            }
          }
          @media (min-width: 1024px) {
            .events-hero {
              height: 440px;
            }
            .events-grid > div {
              grid-column: span 4;
            }
          }
          @media (min-width: 1280px) {
            .events-grid > div {
              grid-column: span 3;
            }
          }
        `}</style>
      </section>
    </main>
  );
}
