import type { BandId } from "./bands";
import type { HeadId } from "./heads";
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

/**
 * The old single-axis model lived here: a `SettingId` union of seventeen named
 * settings ("Halo", "Trilogy"), each resolving to a hidden head + band pair,
 * with `resolveForShape` / `resolveForSetting` keeping the two in step.
 *
 * It has been replaced by band and head as first-class axes — see the note at
 * the top of bands.ts for why, which is short: the named list existed to keep
 * the number of photographs affordable, and photographs are no longer the
 * constraint. Which heads hold which stone now lives in heads.ts, beside the
 * heads it constrains, rather than as a `supports` array on a third type that
 * had to agree with both.
 */

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
  band: BandId;
  head: HeadId;
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
  band: "solitaire",
  head: "6-prong-nouveau",
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

/**
 * The carat weights offered, as fixed choices rather than a slider.
 *
 * A slider implies a precision that does not exist. Stones are not made to
 * order at 1.37ct — you buy the one that is in front of you, and the number the
 * customer lands on is only ever a bracket to search within. Worse, a slider
 * invites fiddling with a value that changes nothing on screen, because every
 * render in the library is the 1.00ct preview size.
 *
 * Eight steps, and they are the ones the trade actually quotes. Half-carat
 * intervals above 1.5ct because that is where the price steps are; quarter
 * intervals below it because that is where the British market sits — the UK
 * average is 0.6–0.8ct, and London bespoke around 1.25ct.
 */
export const CARAT_PRESETS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0];

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
