/**
 * Mock “ul. + adjective-like name + number” in a Warsaw district (dzielnica).
 * Uses a PRNG callback so `makeMockEvents` stays deterministic from a seed.
 */
const STREET_ADJECTIVES = [
  "Nowa",
  "Stara",
  "Krótka",
  "Długa",
  "Wąska",
  "Szeroka",
  "Zielona",
  "Biała",
  "Cicha",
  "Piękna",
  "Spokojna",
  "Głęboka",
  "Płaska",
  "Wysoka",
  "Młoda",
  "Jasna",
  "Ciemna",
  "Kręta",
  "Słoneczna",
  "Ciepła",
] as const;

const WARSAW_DISTRICTS = [
  "Śródmieście",
  "Mokotów",
  "Ochota",
  "Wola",
  "Żoliborz",
  "Praga-Północ",
  "Praga-Południe",
  "Ursynów",
  "Wilanów",
  "Bielany",
  "Bemowo",
  "Ursus",
  "Wawer",
  "Włochy",
  "Rembertów",
  "Targówek",
  "Białołęka",
  "Wesoła",
] as const;

export function randomWarsawAddress(rnd: () => number): string {
  const street =
    STREET_ADJECTIVES[Math.floor(rnd() * STREET_ADJECTIVES.length)] ?? "Nowa";
  const number = 1 + Math.floor(rnd() * 118);
  const withApartment = rnd() > 0.72;
  const apartment = withApartment ? `/${1 + Math.floor(rnd() * 28)}` : "";
  const district =
    WARSAW_DISTRICTS[Math.floor(rnd() * WARSAW_DISTRICTS.length)] ?? "Mokotów";
  return `${street} ${number}${apartment}, ${district}`;
}
