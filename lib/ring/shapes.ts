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
 * which most American shape guides rank second — is under 1% here. It is also
 * the one shape that is not really a brilliant (it needs chevron pavilion
 * facets, a different topology), so the hardest shape to build is also the
 * least wanted. It and heart, the only concave outline, are both out of v1.
 */

export type ShapeId =
  | "round"
  | "oval"
  | "cushion"
  | "emerald"
  | "pear"
  | "radiant"
  | "marquise"
  | "asscher";

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
];

const BY_ID = new Map(SHAPES.map((s) => [s.id, s]));

export function shape(id: ShapeId): Shape {
  return BY_ID.get(id) ?? SHAPES[0];
}

export const DEFAULT_SHAPE: ShapeId = "round";

/** Millimetre dimensions of a stone at a given carat. */
export function stoneSizeMm(id: ShapeId, carat: number) {
  const s = shape(id);
  const width = s.widthAt1ct * Math.cbrt(carat);
  return { widthMm: width, lengthMm: width * s.lengthToWidth };
}

// ---------------------------------------------------------------------------
// Girdle outlines
// ---------------------------------------------------------------------------

export type Point2 = { x: number; y: number };

/**
 * A closed girdle curve, in millimetres, centred on the origin. `x` is across
 * the width, `y` along the length.
 *
 * `corners` marks parameters that a sampler MUST land on. That matters for the
 * cut-corner shapes: sample a cut-corner rectangle at evenly spaced angles and
 * you miss the corners entirely, and every emerald cut comes out with rounded
 * ones. Twenty lines of arc-length sampling with corner snapping is the
 * difference between an emerald cut and a rounded rectangle.
 */
export type Outline = {
  /** t ∈ [0, 1), counter-clockwise from the +x axis. */
  at(t: number): Point2;
  corners: number[];
  halfWidth: number;
  halfLength: number;
};

/** Signed power that keeps the sign of the input — for superellipses. */
function spow(v: number, p: number) {
  return Math.sign(v) * Math.pow(Math.abs(v), p);
}

/** Walks a polyline built from `at` and returns cumulative arc length. */
function polyline(at: (t: number) => Point2, steps = 720) {
  const pts: Point2[] = [];
  const cum: number[] = [0];
  for (let i = 0; i < steps; i++) pts.push(at(i / steps));
  for (let i = 1; i <= steps; i++) {
    const a = pts[i - 1];
    const b = pts[i % steps];
    cum.push(cum[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
  }
  return { pts, cum, total: cum[steps], steps };
}

/**
 * Samples `count` points spaced evenly by arc length, then nudges the nearest
 * sample onto each required corner. Even angular spacing bunches samples at the
 * ends of an elongated stone and starves its flanks; arc length is what a
 * cutter would do.
 */
export function sampleOutline(outline: Outline, count: number): Point2[] {
  const { at, corners } = outline;
  const { cum, total, steps } = polyline(at);

  const tAt = (targetLen: number) => {
    let lo = 0;
    let hi = steps;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < targetLen) lo = mid + 1;
      else hi = mid;
    }
    return lo / steps;
  };

  const ts: number[] = [];
  for (let i = 0; i < count; i++) ts.push(tAt((i / count) * total));

  for (const corner of corners) {
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < ts.length; i++) {
      // Compare around the wrap, so a corner at 0.99 snaps to a sample at 0.01.
      const d = Math.min(
        Math.abs(ts[i] - corner),
        1 - Math.abs(ts[i] - corner),
      );
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    ts[best] = corner;
  }

  return ts.map(at);
}

/** Rectangle with the corners cut off, as a fraction of the width. */
function cutCornerOutline(
  halfWidth: number,
  halfLength: number,
  cutFraction: number,
): Outline {
  const c = cutFraction * halfWidth * 2;
  const verts: Point2[] = [
    { x: halfWidth, y: halfLength - c },
    { x: halfWidth - c, y: halfLength },
    { x: -(halfWidth - c), y: halfLength },
    { x: -halfWidth, y: halfLength - c },
    { x: -halfWidth, y: -(halfLength - c) },
    { x: -(halfWidth - c), y: -halfLength },
    { x: halfWidth - c, y: -halfLength },
    { x: halfWidth, y: -(halfLength - c) },
  ];

  // Parameter is proportional to perimeter travelled, so the corners land on
  // known values we can hand to the sampler.
  const segLens = verts.map((v, i) => {
    const n = verts[(i + 1) % verts.length];
    return Math.hypot(n.x - v.x, n.y - v.y);
  });
  const perimeter = segLens.reduce((a, b) => a + b, 0);
  const starts: number[] = [];
  let acc = 0;
  for (const len of segLens) {
    starts.push(acc / perimeter);
    acc += len;
  }

  return {
    corners: starts,
    halfWidth,
    halfLength,
    at(t) {
      const u = ((t % 1) + 1) % 1;
      let i = starts.length - 1;
      while (i > 0 && starts[i] > u) i--;
      const from = verts[i];
      const to = verts[(i + 1) % verts.length];
      const spanEnd = i + 1 < starts.length ? starts[i + 1] : 1;
      const local = (u - starts[i]) / (spanEnd - starts[i]);
      return {
        x: from.x + (to.x - from.x) * local,
        y: from.y + (to.y - from.y) * local,
      };
    },
  };
}

/**
 * Builds the girdle outline for a shape at a given carat.
 *
 * Note the marquise and pear are exact constructions rather than eyeballed
 * splines — a marquise is two circular arcs meeting at the tips, and its arc
 * radius falls out of the half-axes as (A² + B²)/2B. Getting that right is what
 * makes the tips read as points rather than as a squashed oval.
 */
export function girdleOutline(id: ShapeId, carat: number): Outline {
  const { widthMm, lengthMm } = stoneSizeMm(id, carat);
  const a = widthMm / 2; // half-width, along x
  const b = lengthMm / 2; // half-length, along y

  switch (id) {
    case "round":
    case "oval":
      return {
        corners: [],
        halfWidth: a,
        halfLength: b,
        at: (t) => ({
          x: a * Math.cos(2 * Math.PI * t),
          y: b * Math.sin(2 * Math.PI * t),
        }),
      };

    case "cushion": {
      // A superellipse does the whole cushion family with one exponent: 2.6 is
      // a rounded cushion, 3.2 a squarer "cushion modified".
      const n = 3.0;
      const p = 2 / n;
      return {
        corners: [],
        halfWidth: a,
        halfLength: b,
        at: (t) => {
          const th = 2 * Math.PI * t;
          return { x: a * spow(Math.cos(th), p), y: b * spow(Math.sin(th), p) };
        },
      };
    }

    case "marquise": {
      // Two circular arcs meeting at (0, ±b). Solving for the arc that passes
      // through the tip and the widest point puts its centre on the x-axis.
      const R = (b * b + a * a) / (2 * a);
      const cx = a - R;
      return {
        corners: [0.25, 0.75], // the two tips must be sampled
        halfWidth: a,
        halfLength: b,
        at: (t) => {
          const u = ((t % 1) + 1) % 1;
          // Right arc sweeps tip-to-tip through +x, left arc mirrors it.
          const right = u < 0.5;
          const phase = right ? u * 2 : (u - 0.5) * 2;
          const half = Math.asin(Math.min(1, b / R));
          const ang = -half + phase * 2 * half;
          const x = cx + R * Math.cos(ang);
          const y = R * Math.sin(ang);
          return { x: right ? x : -x, y: right ? y : -y };
        },
      };
    }

    case "pear": {
      // A circular belly with two straight tangents running up to the point.
      const rBelly = a;
      const cy = -(b - rBelly);
      const tipY = b;
      const d = tipY - cy;
      const touch = Math.acos(Math.min(1, rBelly / d));
      return {
        corners: [0.25], // the point
        halfWidth: a,
        halfLength: b,
        at: (t) => {
          const u = ((t % 1) + 1) % 1;
          // Sweep: belly arc from the right tangent point, round the bottom, to
          // the left tangent point; then straight up to the tip and back down.
          const arcFrom = touch;
          const arcTo = 2 * Math.PI - touch;
          const arcSpan = arcTo - arcFrom;
          const arcShare = 0.62;
          if (u < arcShare) {
            const ang = arcFrom + (u / arcShare) * arcSpan;
            return { x: rBelly * Math.sin(ang), y: cy + rBelly * Math.cos(ang) };
          }
          const left = { x: -rBelly * Math.sin(touch), y: cy + rBelly * Math.cos(touch) };
          const right = { x: rBelly * Math.sin(touch), y: cy + rBelly * Math.cos(touch) };
          const tip = { x: 0, y: tipY };
          const v = (u - arcShare) / (1 - arcShare);
          if (v < 0.5) {
            const k = v * 2;
            return { x: left.x + (tip.x - left.x) * k, y: left.y + (tip.y - left.y) * k };
          }
          const k = (v - 0.5) * 2;
          return { x: tip.x + (right.x - tip.x) * k, y: tip.y + (right.y - tip.y) * k };
        },
      };
    }

    case "emerald":
      return cutCornerOutline(a, b, 0.16);
    case "asscher":
      return cutCornerOutline(a, b, 0.22);
    case "radiant":
      return cutCornerOutline(a, b, 0.13);
  }
}
