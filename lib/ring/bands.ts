import { ICON_FILES } from "./generated/icon-manifest";

/**
 * Band styles — the shank, and the first thing the customer picks.
 *
 * ── Why band and head are separate pickers now ──
 *
 * The builder used to offer a single list of named settings ("Halo",
 * "Trilogy") with head and band as hidden axes underneath, on the reasoning
 * that "Halo" is a thing you want while `head=halo, band=plain` is a thing you
 * configure. That reasoning was sound, and it was answering a constraint that
 * no longer exists.
 *
 * The constraint was pictures. Splitting the axes multiplies the combinations —
 * 15 bands × 15 heads is 225 rings, none of which could be photographed because
 * none of them had been made. A named-settings list kept the count down to
 * something a shoot could cover. Now every combination of band, shape, head and
 * metal has a render, so the split model costs nothing and buys the thing it
 * was always better at: a hidden halo on a cathedral band, without anybody
 * having to invent a "cathedral hidden halo" entry for it.
 *
 * Order is the reference library's own, which runs plain to ornate rather than
 * alphabetically. That is the right order for a rail — the first thing in view
 * should be the thing most people want.
 */

export type BandId =
  | "solitaire"
  | "knife-edge-solitaire"
  | "split-ring-solitaire"
  | "french-pave"
  | "cathedral-pave"
  | "triple-row-pave"
  | "round-channel"
  | "baguette-channel"
  | "floating-station"
  | "alternating-marquise"
  | "three-stone"
  | "knife-edge-pave"
  | "floral-bypass"
  | "twist-pave"
  | "alternating-baguette";

export type Band = {
  id: BandId;
  /** As the UK trade writes it. */
  label: string;
  /** US and older names, so search still finds it. */
  aliases: string[];
  description: string;
  /** True where the band itself carries stones — drives the melee note. */
  set: boolean;
};

export const BANDS: Band[] = [
  {
    id: "solitaire", label: "Solitaire", aliases: ["plain band", "plain shank"],
    description: "A plain, softly rounded band. Nothing competes with the centre stone, and nothing dates.",
    set: false,
  },
  {
    id: "knife-edge-solitaire", label: "Knife Edge", aliases: ["knife-edge shank"],
    description: "The band rises to a fine central ridge, so it catches a line of light along its whole length and reads narrower than it is.",
    set: false,
  },
  {
    id: "split-ring-solitaire", label: "Split Shank", aliases: ["split band", "forked shoulders"],
    description: "The band divides at the shoulders and closes again beneath the stone, framing it with open metal.",
    set: false,
  },
  {
    id: "french-pave", label: "French Pavé", aliases: ["french cut pave", "fishtail"],
    description: "Diamonds seated in small V-shaped cutouts, so light reaches them from underneath as well as above. More work at the bench than plain pavé, and visibly brighter for it.",
    set: true,
  },
  {
    id: "cathedral-pave", label: "Cathedral Pavé", aliases: ["cathedral shoulders"],
    description: "The shoulders arch up to meet the head the way cathedral vaulting meets a column. It lifts the stone and gives the profile its height.",
    set: true,
  },
  {
    id: "triple-row-pave", label: "Triple Row Pavé", aliases: ["three row pave"],
    description: "Three rows of diamonds across the band. The widest thing here, and the one that reads as a ring rather than as a stone on a wire.",
    set: true,
  },
  {
    id: "round-channel", label: "Round Channel", aliases: ["channel set"],
    description: "Round diamonds sunk between two walls of metal with no claws at all. Nothing protrudes, which makes it the most forgiving band to wear daily.",
    set: true,
  },
  {
    id: "baguette-channel", label: "Baguette Channel", aliases: ["baguette set"],
    description: "Step-cut baguettes channel-set shoulder to shoulder. Long flat facets rather than sparkle — closer to an Art Deco line than a modern pavé.",
    set: true,
  },
  {
    id: "floating-station", label: "Floating Station", aliases: ["station set", "spaced diamonds"],
    description: "Diamonds spaced along the band with bare metal between them, each held so the setting barely shows.",
    set: true,
  },
  {
    id: "alternating-marquise", label: "Alternating Marquise", aliases: ["marquise shoulders"],
    description: "Marquise diamonds laid along the band, tips meeting, with rounds between them. A leaf-like line down the shoulders.",
    set: true,
  },
  {
    id: "three-stone", label: "Three Stone", aliases: ["trilogy", "past present future"],
    description: "A diamond either side of the centre, sized to it. The classic three-stone, and the shoulders do the work rather than the band.",
    set: true,
  },
  {
    id: "knife-edge-pave", label: "Knife Edge Pavé", aliases: [],
    description: "The knife edge's ridge, with pavé worked into each sloping face. Sharper than a rounded pavé band and it throws light in two directions.",
    set: true,
  },
  {
    id: "floral-bypass", label: "Floral Bypass", aliases: ["bypass", "crossover"],
    description: "The shoulders sweep past one another rather than meeting, with diamond detail where they cross. Asymmetric on purpose.",
    set: true,
  },
  {
    id: "twist-pave", label: "Twist Pavé", aliases: ["twisted band", "rope"],
    description: "Two pavé lines wound around each other and around the stone. It suits an elongated centre — the twist follows the length.",
    set: true,
  },
  {
    id: "alternating-baguette", label: "Alternating Baguette", aliases: [],
    description: "Baguettes and rounds alternating along the shoulders. Two cuts in one band, which is what gives it its rhythm.",
    set: true,
  },
];

const BY_ID = new Map(BANDS.map((b) => [b.id, b]));

export function band(id: BandId): Band {
  return BY_ID.get(id) ?? BANDS[0];
}

export function bandIcon(id: BandId): string | undefined {
  const file = ICON_FILES[`band/${id}`];
  return file ? `/ring-builder/icons/band/${file}` : undefined;
}
