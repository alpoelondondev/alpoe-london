import type { MetalId } from "./metals";
import type { ShapeId } from "./shapes";

/**
 * What a ring is, as far as the builder is concerned.
 *
 * The whole configuration is small, flat and serialisable, because it lives in
 * the URL. That makes every build shareable and back-button-safe, and it means
 * the WhatsApp message can carry a link the counter can open to see exactly
 * what the customer designed. It also makes WebGL context loss a non-event:
 * there is no asset to re-download, the config *is* the asset.
 */

export type HeadStyle = "claw-4" | "claw-6" | "rubover" | "halo" | "hidden-halo" | "double-halo" | "cluster";
export type BandStyle = "plain" | "grain-set" | "cathedral" | "split-shank" | "knife-edge" | "channel" | "crossover";

/**
 * The named settings, which is what the customer actually picks.
 *
 * Two reference builders take opposite approaches: one splits head and band
 * into separate pickers, the other offers a single list of named settings. The
 * split model is the more capable — it is how you get a halo on a cathedral
 * band without adding a "cathedral halo" entry — but a list of named settings
 * is how people actually shop, because "Halo" is a thing you want and
 * "head=halo, band=plain" is a thing you configure.
 *
 * So: named settings on the surface, the two axes underneath. Each name simply
 * resolves to a pair, and anyone who wants to break them apart can. One
 * mapping, not a second system.
 */
export type SettingId =
  | "solitaire"
  | "side-stone"
  | "trilogy"
  | "halo"
  | "hidden-halo"
  | "double-halo"
  | "grain-set"
  | "channel-set"
  | "split-shank"
  | "cluster"
  | "vintage"
  | "rubover"
  | "tension"
  | "trellis"
  | "crossover"
  | "toi-et-moi"
  | "knife-edge";

export type Setting = {
  id: SettingId;
  /** UK trade name. */
  label: string;
  /** US or older names, so search still finds it. */
  aliases: string[];
  description: string;
  head: HeadStyle;
  band: BandStyle;
  /** Shapes this setting can actually hold. */
  supports: ShapeId[];
  /**
   * Offered in the builder. Kept as a flag rather than removed because it is
   * how a setting gets retired or held back without deleting its data — it no
   * longer means "has 3D geometry", since there is no longer any.
   */
  ready: boolean;
};

const ALL_SHAPES: ShapeId[] = [
  "round", "oval", "cushion", "emerald", "pear", "radiant", "marquise", "asscher",
];
/** Pointed stones need V-claws at the tips; settings without them can't hold one. */
const NO_POINTS: ShapeId[] = ["round", "oval", "cushion", "emerald", "radiant", "asscher"];

export const SETTINGS: Setting[] = [
  {
    id: "solitaire", label: "Solitaire", aliases: ["four claw", "4 prong"],
    description: "A single centre diamond held in a timeless four-claw setting.",
    head: "claw-4", band: "plain", supports: ALL_SHAPES, ready: true,
  },
  {
    id: "rubover", label: "Rubover", aliases: ["bezel", "collet", "rub-over"],
    description: "A wall of metal wrapped fully around the stone. The most protective setting, and the most modern.",
    head: "rubover", band: "plain", supports: ALL_SHAPES, ready: true,
  },
  {
    id: "halo", label: "Halo", aliases: ["cluster halo"],
    description: "A ring of grain-set diamonds framing the centre stone, making it read considerably larger.",
    head: "halo", band: "plain", supports: ALL_SHAPES, ready: true,
  },
  {
    id: "grain-set", label: "Grain Set", aliases: ["pavé", "pave", "bead set"],
    description: "Diamonds set into the shoulders with raised beads of metal, so the band itself catches light.",
    head: "claw-4", band: "grain-set", supports: ALL_SHAPES, ready: true,
  },
  {
    id: "hidden-halo", label: "Hidden Halo", aliases: ["under halo", "gallery set"],
    description: "A halo set beneath the girdle, invisible from above and a surprise from the side.",
    head: "hidden-halo", band: "plain", supports: ALL_SHAPES, ready: true,
  },
  {
    id: "double-halo", label: "Double Halo", aliases: ["dual halo"],
    description: "Two concentric rings of diamonds around the centre stone.",
    head: "double-halo", band: "plain", supports: ALL_SHAPES, ready: true,
  },
  {
    id: "trilogy", label: "Trilogy", aliases: ["three stone", "past present future"],
    description: "Three stones together — traditionally read as past, present and future.",
    head: "claw-4", band: "plain", supports: ALL_SHAPES, ready: true,
  },
  {
    id: "side-stone", label: "Side Stone", aliases: ["shoulder set"],
    description: "A centre stone flanked by smaller diamonds set into the shoulders.",
    head: "claw-4", band: "grain-set", supports: ALL_SHAPES, ready: true,
  },
  {
    id: "channel-set", label: "Channel Set", aliases: ["channel"],
    description: "Diamonds sunk between two rails of metal, flush and hard-wearing.",
    head: "claw-4", band: "channel", supports: ALL_SHAPES, ready: true,
  },
  {
    id: "split-shank", label: "Split Shank", aliases: ["forked shoulders", "split band"],
    description: "The band divides as it approaches the setting, lifting the stone.",
    head: "claw-4", band: "split-shank", supports: ALL_SHAPES, ready: true,
  },
  {
    id: "knife-edge", label: "Knife Edge", aliases: [],
    description: "A band rising to a fine ridge, catching light as a single bright line.",
    head: "claw-4", band: "knife-edge", supports: ALL_SHAPES, ready: true,
  },
  {
    id: "crossover", label: "Crossover", aliases: ["twist", "bypass"],
    description: "Two bands crossing beneath the stone, wrapping the finger.",
    head: "claw-4", band: "crossover", supports: ALL_SHAPES, ready: true,
  },
  {
    id: "cluster", label: "Cluster", aliases: ["target"],
    description: "Similarly sized diamonds grouped as one flower-like head. A genuinely British setting, Georgian in origin.",
    head: "cluster", band: "plain", supports: NO_POINTS, ready: true,
  },
  {
    id: "vintage", label: "Vintage", aliases: ["trefoil", "milgrain"],
    description: "Millgrain edging and fine scrollwork, drawn from Edwardian and Art Deco pieces.",
    head: "claw-6", band: "plain", supports: NO_POINTS, ready: true,
  },
  {
    id: "trellis", label: "Trellis", aliases: [],
    description: "Claws that cross beneath the stone like woven basketwork.",
    head: "claw-4", band: "plain", supports: NO_POINTS, ready: true,
  },
  {
    id: "tension", label: "Tension Set", aliases: [],
    description: "The stone appears suspended, held by the spring of the metal alone. It cannot be resized in the ordinary way, so we size it carefully with you.",
    head: "rubover", band: "plain", supports: NO_POINTS, ready: true,
  },
  {
    id: "toi-et-moi", label: "Toi et Moi", aliases: ["you and me", "two stone"],
    description: "Two stones side by side — a French design meaning 'you and me'.",
    head: "claw-4", band: "crossover", supports: ALL_SHAPES, ready: true,
  },
];

const BY_ID = new Map(SETTINGS.map((s) => [s.id, s]));

export function setting(id: SettingId): Setting {
  return BY_ID.get(id) ?? SETTINGS[0];
}

export function readySettings(): Setting[] {
  return SETTINGS.filter((s) => s.ready);
}

/**
 * Resolving a shape and a setting that disagree.
 *
 * Not every setting can hold every stone — a marquise needs V-claws at its
 * points, and a cluster has nowhere to put them — so some pairs are genuinely
 * impossible. The question is what the interface does about it.
 *
 * Disabling one picker based on the other is the obvious answer and it is
 * wrong: it dead-ends. Choose a marquise and half the settings grey out;
 * choose a cluster and half the shapes do. The customer is left looking at the
 * thing they want, unable to click it, with no explanation of which earlier
 * decision is to blame.
 *
 * So nothing is ever disabled. The most recent choice is treated as the real
 * intent and the *other* axis moves to accommodate it — because someone who
 * has just clicked "marquise" wants a marquise, and the setting is the part
 * they are still willing to negotiate. The interface then says what it did,
 * rather than silently rewriting the configuration underneath them.
 */
export function resolveForShape(
  settingId: SettingId,
  shapeId: ShapeId,
): { setting: SettingId; changed: boolean } {
  const current = setting(settingId);
  if (current.supports.includes(shapeId)) {
    return { setting: settingId, changed: false };
  }
  // Prefer a setting that is actually built, and keep the customer as close to
  // what they had as the list order allows.
  const fallback =
    SETTINGS.find((s) => s.ready && s.supports.includes(shapeId)) ??
    SETTINGS.find((s) => s.supports.includes(shapeId));
  return { setting: fallback?.id ?? settingId, changed: Boolean(fallback) };
}

export function resolveForSetting(
  settingId: SettingId,
  shapeId: ShapeId,
): { shape: ShapeId; changed: boolean } {
  const next = setting(settingId);
  if (next.supports.includes(shapeId)) return { shape: shapeId, changed: false };
  // Round is the safe landing: every setting takes one, and it is 36% of the
  // UK market, so it is the least surprising place to end up.
  return { shape: next.supports[0] ?? "round", changed: true };
}

// ---------------------------------------------------------------------------
// Stone quality
// ---------------------------------------------------------------------------

/**
 * Quality as presets rather than four dropdowns.
 *
 * Making somebody learn the 4Cs before they can use the tool is a good way to
 * lose them, and the grades are a bench concern more than a customer one. Three
 * named tiers plus an honest "not sure" covers what people actually decide
 * between, and it produces a cleaner specification for the workshop.
 *
 * It also sidesteps a real mess. Since 1 October 2025 GIA no longer issues
 * colour and clarity grades for laboratory-grown diamonds at all — they get a
 * two-tier "Premium" or "Standard" assessment instead — so a flat colour and
 * clarity filter would simply break depending on the stone's origin, its lab
 * and its report date. A preset can map to different underlying schemas without
 * ever showing the customer the seam.
 */
export type QualityId = "brilliant" | "exceptional" | "collection" | "guided";

export type Quality = {
  id: QualityId;
  label: string;
  /** What it means for a natural stone, in GIA terms. */
  natural: string;
  /** Laboratory-grown equivalent, under GIA's post-2025 scheme. */
  laboratoryGrown: string;
  note?: string;
};

export const QUALITIES: Quality[] = [
  {
    id: "brilliant", label: "Brilliant",
    natural: "Very Good cut · G–H colour · VS2",
    laboratoryGrown: "Standard · Very Good cut",
    note: "Bright and lively, with nothing visible to the eye. Where most of our commissions land.",
  },
  {
    id: "exceptional", label: "Exceptional",
    natural: "Excellent cut · F colour · VS1",
    laboratoryGrown: "Premium · Excellent cut",
    note: "A noticeable step up in white and in life.",
  },
  {
    id: "collection", label: "Collection",
    natural: "Excellent cut · D colour · VVS1",
    laboratoryGrown: "Premium · Excellent cut",
    note: "The top of the scale — colourless and very nearly flawless.",
  },
  {
    id: "guided", label: "Not sure yet",
    natural: "We'll recommend the best grade for your budget",
    laboratoryGrown: "We'll recommend the best grade for your budget",
  },
];

export function quality(id: QualityId): Quality {
  return QUALITIES.find((q) => q.id === id) ?? QUALITIES[0];
}

/**
 * Origin.
 *
 * Note the labels. "Laboratory-grown" is always written in full and never
 * abbreviated — ISO 18323 cl. 2.4 prohibits "lab grown", "lab created" and
 * "lab diamond" outright, CIBJO says the same, and the NAJ's guideline saying
 * so is Trading Standards Assured Advice, which is a legal safe harbour if
 * followed. The ASA upheld complaints against two UK retailers on exactly this
 * point in May 2026 and held that disclosing it deeper in the site was not
 * enough. Also note that ISO defines "diamond" unqualified as meaning a natural
 * one, which is why the natural label can be plain.
 */
export type OriginId = "natural" | "laboratory-grown";

export const ORIGINS: { id: OriginId; label: string; note: string }[] = [
  {
    id: "natural", label: "Natural Diamond",
    note: "Formed over billions of years and certified by GIA. Holds rarity value.",
  },
  {
    id: "laboratory-grown", label: "Laboratory-Grown Diamond",
    note: "Chemically and optically identical to a natural diamond, and a considerably larger stone for the same outlay.",
  },
];

// ---------------------------------------------------------------------------

export type RingConfig = {
  setting: SettingId;
  shape: ShapeId;
  carat: number;
  origin: OriginId;
  quality: QualityId;
  /** Head and band are separate so two-tone works. */
  headMetal: MetalId;
  bandMetal: MetalId;
  /** A ring size id, or "unknown" — which is the default, and deliberately so. */
  size: string;
  engraving: string;
};

export const DEFAULT_CONFIG: RingConfig = {
  setting: "solitaire",
  shape: "round",
  carat: 1.0,
  origin: "natural",
  quality: "brilliant",
  headMetal: "platinum-950",
  bandMetal: "platinum-950",
  size: "unknown",
  engraving: "",
};

/**
 * Carat range. Anchored on London rather than on the national average — the UK
 * as a whole sits at 0.6–0.8ct, but London bespoke averages 1.25ct, and 98% of
 * stones bought above two carats are laboratory-grown. Opening the slider at
 * the national figure would read as a different shop.
 */
export const CARAT_MIN = 0.3;
export const CARAT_MAX = 3.0;
export const CARAT_STEP = 0.05;

/**
 * Buying just under a magic size — 0.90 rather than 1.00 — saves around 10% for
 * a diameter difference nobody can see. Surfacing it unprompted is the kind of
 * thing that makes a customer trust the rest of the tool.
 */
export const MAGIC_SIZES = [1.0, 1.5, 2.0];

export function magicSizeHint(carat: number): number | null {
  for (const m of MAGIC_SIZES) {
    if (carat > m - 0.001 && carat < m + 0.08) return m - 0.1;
  }
  return null;
}
