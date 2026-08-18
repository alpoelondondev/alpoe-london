/**
 * The metals Alpoe offers, and the PBR values that make them read as metal.
 *
 * UK carats, not US ones. British makers work in 9ct and 18ct; 14ct is legal
 * here but it is an American default and a UK buyer reads it as imported. So
 * the set is platinum plus 18ct and 9ct in the three colours, and there is no
 * sterling silver — an engagement ring in silver would undercut the workshop.
 *
 * Two rules govern the colours, and both run against instinct:
 *
 *   1. Alloying gold DESATURATES it, it does not darken it. 18ct holds about
 *      63% of pure gold's chroma at essentially unchanged lightness, and the
 *      blue channel *rises* as the gold content falls. So 9ct is not "darker
 *      gold" — it is paler and less saturated. The number that tracks gold
 *      content is CIE b*: 24ct ≈ 38, 18ct ≈ 23, 9ct ≈ 14. Vary that, hold
 *      lightness. Values here are anchored on ISO 8654:2018 "Colours of gold
 *      alloys", which measures polished samples under D65 — which is exactly
 *      the F0 a metal wants.
 *
 *   2. Platinum is genuinely DARKER than white gold — linear 0.672 against
 *      0.780, about 14% down. That difference is the only honest visual cue
 *      between them, so the temptation to normalise every metal until its
 *      brightest channel hits 1.0 has to be resisted. Doing that is precisely
 *      why so many configurators render platinum as chrome.
 *
 * Rhodium, not white gold, for the plated whites. Unplated white gold measures
 * b* ≥ 9 and reads visibly straw — which is *why* it is plated. What the
 * customer receives is a rhodium surface, so that is what we render.
 *
 * On the two dead parameters: at metalness 1.0 three.js blends specular into
 * the base colour, so `specularColor`, `specularIntensity`, `ior` and
 * `reflectivity` do nothing at all on these materials. `color` IS F0 and it is
 * the only colour knob. (glTF's KHR_materials_specular says the same: "The
 * metal BRDF is not affected by the parameter.") And roughness has a floor —
 * three clamps it to 0.0525, the sharpest reflection a 256² PMREM base mip can
 * represent — so anything below that is silently ignored.
 */

export type MetalId =
  | "platinum-950"
  | "18ct-white"
  | "18ct-yellow"
  | "18ct-rose"
  | "9ct-white"
  | "9ct-yellow"
  | "9ct-rose";

export type Metal = {
  id: MetalId;
  /** As it appears in the picker and the specification. */
  label: string;
  /** Millesimal fineness, for the spec sheet and the hallmark line. */
  fineness: number;
  /** What the Assay Office will strike, spelled out for the customer. */
  hallmark: string;
  /** Base colour = F0. sRGB hex, for CSS swatches. */
  hex: string;
  /** The same colour linear, which is what the material actually takes. */
  linear: [number, number, number];
  roughness: number;
  /** Warm metals want a hair less environment than the whites. */
  envMapIntensity: number;
  /** Shown inline when selected, where there is something worth knowing. */
  note?: string;
};

export const METALS: Metal[] = [
  {
    id: "platinum-950",
    label: "Platinum 950",
    fineness: 950,
    hallmark: "Platinum 950",
    hex: "#D6D1C9",
    linear: [0.672, 0.637, 0.585],
    roughness: 0.2,
    envMapIntensity: 0.95,
    note: "Naturally white, so it never needs plating. Denser and heavier than gold, and it wears to a soft patina rather than losing its colour.",
  },
  {
    id: "18ct-white",
    label: "18ct White Gold",
    fineness: 750,
    hallmark: "18ct Gold — 750",
    hex: "#E5E3E1",
    linear: [0.78, 0.77, 0.75],
    roughness: 0.1,
    envMapIntensity: 1.05,
    note: "Rhodium-plated for brightness. Expect re-plating roughly every 12–18 months, typically £40–£60. Platinum is naturally white and never needs it.",
  },
  {
    id: "18ct-yellow",
    label: "18ct Yellow Gold",
    fineness: 750,
    hallmark: "18ct Gold — 750",
    hex: "#FDE2AA",
    linear: [0.98, 0.76, 0.4],
    roughness: 0.15,
    envMapIntensity: 1.0,
  },
  {
    id: "18ct-rose",
    label: "18ct Rose Gold",
    fineness: 750,
    hallmark: "18ct Gold — 750",
    hex: "#FAD7B5",
    linear: [0.96, 0.68, 0.46],
    roughness: 0.15,
    envMapIntensity: 1.0,
  },
  {
    id: "9ct-white",
    label: "9ct White Gold",
    fineness: 375,
    hallmark: "9ct Gold — 375",
    hex: "#E7E4E0",
    linear: [0.79, 0.78, 0.76],
    roughness: 0.12,
    envMapIntensity: 1.02,
    note: "Rhodium-plated, like all white gold. Harder than 18ct but more brittle, so 18ct tends to wear better over decades.",
  },
  {
    id: "9ct-yellow",
    label: "9ct Yellow Gold",
    fineness: 375,
    hallmark: "9ct Gold — 375",
    hex: "#F7E3BF",
    linear: [0.93, 0.77, 0.52],
    roughness: 0.17,
    envMapIntensity: 0.98,
  },
  {
    id: "9ct-rose",
    label: "9ct Rose Gold",
    fineness: 375,
    hallmark: "9ct Gold — 375",
    hex: "#F3DAC4",
    linear: [0.92, 0.73, 0.57],
    roughness: 0.17,
    envMapIntensity: 0.98,
  },
];

const BY_ID = new Map(METALS.map((m) => [m.id, m]));

export function metal(id: MetalId): Metal {
  return BY_ID.get(id) ?? METALS[0];
}

export const DEFAULT_METAL: MetalId = "platinum-950";

/**
 * Small parts — grain beads, millgrain, claw tips — render one to three pixels
 * across, and a mirror that size is not a highlight, it is aliasing. Holding
 * them appreciably rougher than the body of the ring is what stops pavé
 * crawling as the ring turns.
 */
export const SMALL_FEATURE_ROUGHNESS_FLOOR = 0.28;
