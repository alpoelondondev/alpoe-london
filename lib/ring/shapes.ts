import { ICON_FILES } from "./generated/icon-manifest";

/**
 * Diamond shapes: what they're called, how big they are, and the girdle outline
 * every cut is generated from.
 *
 * The outline is the whole trick. A brilliant cut is a set of planar facets
 * whose vertices sit on rings at fixed positions around the girdle — so if the
 * girdle is expressed as a closed curve rather than a circle, the same
 * generator produces a round, an oval, a cushion, a pear and a marquise. One
 * piece of code, eight outlines.
 *
 * Shapes are ordered by UK demand, not alphabetically and not by US convention.
 * Round and oval together are about 69% of the British market, and princess —
 * which most American shape guides rank second — is under 1% here. That is why
 * it sits low in the rail rather than second, where an American guide would put
 * it.
 *
 * Princess and heart were out of the first version because both were awkward to
 * generate: a princess is not really a brilliant (it needs chevron pavilion
 * facets, a different topology) and a heart is the only concave outline. That
 * reasoning was about generating geometry, and there is no geometry any more —
 * the builder is photographic, and the reference library has both. So both are
 * in, and neither carries an `Outline` below; nothing reads one.
 */

export type ShapeId =
  | "round"
  | "oval"
  | "cushion"
  | "princess"
  | "emerald"
  | "pear"
  | "radiant"
  | "marquise"
  | "asscher"
  | "heart";

export type CutStyle = "brilliant" | "step";

export type Shape = {
  id: ShapeId;
  /** As the UK trade writes it. */
  label: string;
  /** Trade synonyms, so search finds them. */
  aliases: string[];
  cut: CutStyle;
  /**
   * Width in mm for a 1.00ct stone. Weight goes as volume, so every dimension
   * scales with the cube root of carat and this constant carries the rest.
   */
  widthAt1ct: number;
  /** Length ÷ width. 1.0 for the symmetrical cuts. */
  lengthToWidth: number;
  /** How many pavilion mains — the rotational symmetry of the facet pattern. */
  mains: number;
  /**
   * Pointed shapes need a claw at the point, and a round claw sitting on a
   * marquise tip looks broken. Flags the shapes that need a V-claw.
   */
  pointed: boolean;
};

/**
 * The 1.00ct constants. Round is verified against the full published trade
 * table to within 0.05 mm; the fancy constants are trade approximations good to
 * roughly ±0.2 mm and they genuinely differ between vendors, mostly because
 * cushions and radiants vary in depth. They live in a table rather than a
 * formula for exactly that reason — when Alpoe settles on a supplier, this is
 * the thing to overwrite with their figures.
 */
export const SHAPES: Shape[] = [
  { id: "round",    label: "Round Brilliant", aliases: ["brilliant", "round cut"], cut: "brilliant", widthAt1ct: 6.5,  lengthToWidth: 1.0,  mains: 8, pointed: false },
  { id: "oval",     label: "Oval",            aliases: ["oval brilliant"],          cut: "brilliant", widthAt1ct: 5.7,  lengthToWidth: 1.35, mains: 8, pointed: false },
  { id: "cushion",  label: "Cushion",         aliases: ["cushion brilliant", "pillow"], cut: "brilliant", widthAt1ct: 5.5, lengthToWidth: 1.0, mains: 8, pointed: false },
  { id: "emerald",  label: "Emerald",         aliases: ["emerald cut", "step cut"], cut: "step",      widthAt1ct: 5.0,  lengthToWidth: 1.4,  mains: 4, pointed: false },
  { id: "pear",     label: "Pear",            aliases: ["teardrop", "pendeloque"],  cut: "brilliant", widthAt1ct: 5.5,  lengthToWidth: 1.55, mains: 8, pointed: true  },
  { id: "radiant",  label: "Radiant",         aliases: ["radiant cut"],             cut: "brilliant", widthAt1ct: 5.1,  lengthToWidth: 1.25, mains: 8, pointed: false },
  { id: "marquise", label: "Marquise",        aliases: ["navette"],                 cut: "brilliant", widthAt1ct: 5.25, lengthToWidth: 2.0,  mains: 8, pointed: true  },
  { id: "asscher",  label: "Asscher",         aliases: ["square emerald"],          cut: "step",      widthAt1ct: 5.5,  lengthToWidth: 1.05, mains: 4, pointed: false },
  { id: "princess", label: "Princess",        aliases: ["square modified brilliant"], cut: "brilliant", widthAt1ct: 5.5, lengthToWidth: 1.0, mains: 4, pointed: true },
  { id: "heart",    label: "Heart",           aliases: ["heart brilliant"],         cut: "brilliant", widthAt1ct: 6.2,  lengthToWidth: 1.0,  mains: 8, pointed: true  },
];

const BY_ID = new Map(SHAPES.map((s) => [s.id, s]));

export function shape(id: ShapeId): Shape {
  return BY_ID.get(id) ?? SHAPES[0];
}

export const DEFAULT_SHAPE: ShapeId = "round";

/** Millimetre dimensions of a stone at a given carat. */
/**
 * The reference library's folder name for a shape.
 *
 * Every one is the id with `-diamond` appended, so this is a rule rather than a
 * table — which is the point of keeping our ids as the bare cut name. The URL
 * stays readable (`?shape=oval`, not `?shape=oval-diamond`) and the renders
 * still resolve.
 */
export function shapeSlug(id: ShapeId): string {
  return `${id}-diamond`;
}

export function shapeIcon(id: ShapeId): string | undefined {
  const file = ICON_FILES[`shape/${shapeSlug(id)}`];
  return file ? `/ring-builder/icons/shape/${file}` : undefined;
}

export function stoneSizeMm(id: ShapeId, carat: number) {
  const s = shape(id);
  const width = s.widthAt1ct * Math.cbrt(carat);
  return { widthMm: width, lengthMm: width * s.lengthToWidth };
}

// ---------------------------------------------------------------------------
// The girdle outlines used to live here: closed parametric curves per shape,
// arc-length sampled with corner snapping, which is what let one brilliant-cut
// generator produce a round, an oval, a cushion, a pear and a marquise from a
// single piece of code. They were genuinely nice, and they went with the 3D.
//
// Deleted rather than left in place because they were also load-bearing on the
// wrong thing: `girdleOutline` switched exhaustively on ShapeId, so a dead
// two-hundred-line geometry section was the only obstacle to adding princess
// and heart to a builder that is now photographic end to end. Nothing read
// them. They are in the history if the 3D ever comes back.
// ---------------------------------------------------------------------------
