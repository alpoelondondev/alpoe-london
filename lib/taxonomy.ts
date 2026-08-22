import type { WatchBrandSlug, JewelleryCategorySlug } from "./types";

export const WATCH_BRANDS: {
  slug: WatchBrandSlug;
  name: string;
  heritage: string;
  models: string[];
}[] = [
  {
    slug: "rolex",
    name: "Rolex",
    heritage:
      "Founded in 1905, Rolex is the benchmark for Swiss precision. Alpoe London holds authenticated Rolex timepieces including discontinued and limited-edition references — delivered from our Hatton Garden showroom.",
    models: ["Submariner", "Daytona", "GMT-Master II", "Datejust", "Lady-Datejust", "Day-Date", "Explorer", "Yacht-Master", "Sky-Dweller", "Sea-Dweller", "Oyster Perpetual", "Land-Dweller"],
  },
  {
    slug: "patek-philippe",
    name: "Patek Philippe",
    heritage:
      "Patek Philippe represents the pinnacle of haute horlogerie. Nautilus, Aquanaut, Calatrava and Grand Complication references, held in stock for discerning collectors.",
    models: ["Nautilus", "Aquanaut", "Calatrava", "Complications", "Grand Complications", "Twenty~4"],
  },
  {
    slug: "audemars-piguet",
    name: "Audemars Piguet",
    heritage:
      "Since 1875. Home of the Royal Oak — the watch that redefined luxury in steel. Alpoe London holds Royal Oak, Royal Oak Offshore and Code 11.59 references in stock.",
    models: ["Royal Oak", "Royal Oak Offshore", "Code 11.59", "Millenary"],
  },
  {
    slug: "richard-mille",
    name: "Richard Mille",
    heritage:
      "Avant-garde Swiss watchmaking with materials borrowed from Formula One and aerospace. All Richard Mille references available on request.",
    models: ["RM 011", "RM 035", "RM 055", "RM 67", "RM 07"],
  },
  {
    slug: "cartier",
    name: "Cartier",
    heritage:
      "Founded in 1847. The jeweller of kings, the king of jewellers. Alpoe London carries Santos, Tank, Ballon Bleu and Panthère.",
    models: ["Santos", "Tank", "Ballon Bleu", "Panthère", "Pasha", "Drive"],
  },
  {
    slug: "hublot",
    name: "Hublot",
    heritage:
      "The art of fusion — unconventional materials and bold design. Big Bang, Classic Fusion and Spirit of Big Bang, held in stock.",
    models: ["Big Bang", "Classic Fusion", "Spirit of Big Bang", "MP Collection"],
  },
  {
    slug: "omega",
    name: "Omega",
    heritage:
      "From the Moon to the seabed. Speedmaster and Seamaster references, held in stock at our London dealership.",
    models: ["Speedmaster", "Seamaster", "Constellation", "De Ville", "Aqua Terra"],
  },
  {
    slug: "breitling",
    name: "Breitling",
    heritage:
      "Instruments for professionals since 1884. Navitimer, Chronomat and Superocean, held in stock.",
    models: ["Navitimer", "Chronomat", "Superocean", "Avenger", "Premier"],
  },
  {
    slug: "iwc",
    name: "IWC",
    heritage:
      "International Watch Company, Schaffhausen. Engineering-led design — Portugieser, Pilot's, Portofino and Ingenieur, held in stock.",
    models: ["Portugieser", "Pilot's Watch", "Portofino", "Ingenieur", "Aquatimer"],
  },
  {
    slug: "panerai",
    name: "Panerai",
    heritage:
      "Italian design, Swiss precision, maritime heritage. Luminor and Radiomir references, held in stock.",
    models: ["Luminor", "Radiomir", "Submersible", "Luminor Due"],
  },
  {
    slug: "vacheron-constantin",
    name: "Vacheron Constantin",
    heritage:
      "Founded in 1755 — the oldest continuously operating watch manufacturer. Overseas, Patrimony and Historiques, held in stock.",
    models: ["Overseas", "Patrimony", "Traditionnelle", "Historiques", "Fiftysix"],
  },
];

export const JEWELLERY_CATEGORIES: {
  slug: JewelleryCategorySlug;
  name: string;
  heritage: string;
  /**
   * Where the category's card should actually send someone, when that is not
   * its own catalogue page.
   *
   * Engagement and wedding rings are the case this exists for. They are still
   * product categories — pieces live in them and hang their URLs off them, so
   * the slugs cannot go — but the page a customer wants for either is the
   * builder's, not a list of two items. The slug keeps the products; this sends
   * the person.
   */
  href?: string;
}[] = [
  {
    slug: "engagement-rings",
    href: "/rings/engagement-and-wedding-rings",
    name: "Engagement Rings",
    heritage:
      "Bespoke diamond engagement rings designed and crafted in Hatton Garden. Round brilliant, oval, emerald, cushion and pear-cut centre stones set in platinum or 18ct gold.",
  },
  {
    slug: "wedding-rings",
    href: "/rings/engagement-and-wedding-rings",
    name: "Wedding Rings & Bands",
    heritage:
      "Men's and women's wedding bands — plain, diamond-set, court-profile and D-shape — in platinum, 18ct white, yellow and rose gold.",
  },
  {
    slug: "mens-jewellery",
    name: "Men's Jewellery",
    heritage:
      "Statement chains, signet rings, pendants and bracelets made for men. Solid gold Cuban links, iced-out pendants and bespoke signets commissioned in our London workshop.",
  },
  {
    slug: "bracelets",
    name: "Bracelets",
    heritage:
      "Diamond tennis bracelets, Cuban link bracelets and bangles in platinum and 18ct gold. Every piece available for hallmarking and resizing.",
  },
  {
    slug: "earrings",
    name: "Earrings",
    heritage:
      "Diamond studs, hoops and drop earrings. GIA-certified centre stones and bespoke settings available.",
  },
  {
    slug: "necklaces-pendants",
    name: "Necklaces & Pendants",
    heritage:
      "Bespoke ice pendants, initial pendants, Cuban chains and diamond rivière necklaces. Made-to-order in the Alpoe London workshop.",
  },
  {
    slug: "rings",
    name: "Rings",
    heritage:
      "Engagement rings and wedding rings made to order in Hatton Garden, plus eternity bands, signet and cocktail rings. Choose a style and customise the diamond, setting, metal and size.",
  },
];

export function watchBrandBySlug(slug: string) {
  return WATCH_BRANDS.find((b) => b.slug === slug);
}

export function jewelleryCategoryBySlug(slug: string) {
  return JEWELLERY_CATEGORIES.find((c) => c.slug === slug);
}
