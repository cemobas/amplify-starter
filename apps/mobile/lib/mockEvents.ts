/**
 * Same mock event data as `apps/web/app/events/page.tsx` (logic only, no DOM).
 */

import { randomWarsawAddress } from "@repo/shared";

export type Tag =
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

export type FeatureFlag = "NEW" | "FREE" | "HIT";
export type VenueKind = "hub" | "circle" | "venue";

export type MockEvent = {
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
    if (t.includes("art") || t.includes("design"))
      return ["Art", "Design", "Studio"];
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

export function makeMockEvents(count: number, seed: number): MockEvent[] {
  const rnd = seeded(seed);
  const now = new Date();

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
    const location = randomWarsawAddress(rnd);

    const hour = clamp(9 + Math.floor(rnd() * 10), 9, 20);
    const minute = rnd() > 0.7 ? "30" : "00";
    const dateStr = `${date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })} · ${hour}:${minute}`;

    const tagCount = 2 + Math.floor(rnd() * 2);
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
