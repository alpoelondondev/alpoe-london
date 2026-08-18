/**
 * UK ring sizes.
 *
 * The British scale is arithmetic, not a lookup someone invented: size A has an
 * inside circumference of 37.83 mm and every whole letter adds 1.2467 mm of
 * circumference (half letters add half that). So the table is generated from
 * the standard rather than transcribed from a chart — transcription is how you
 * inherit somebody else's rounding errors.
 *
 * Circumference is the source of truth, not diameter and not the letter. ISO
 * 8653 defines a ring size as its inside circumference in millimetres, so the
 * letter is a display label over the top of it and the diameter is derived. The
 * shank geometry wants the radius, and taking that from the circumference keeps
 * one number authoritative.
 *
 * A caution worth carrying: published UK↔US charts genuinely disagree, by up to
 * a quarter of a US size, and the disagreement is worst below size I. There is
 * no authoritative mapping. The US column here is a cross-reference to show the
 * customer, never something to manufacture from — which is why `usSize` is a
 * string ("5¾") rather than a number you might be tempted to compute with.
 */

/** Inside circumference of size A, in millimetres. British Standard. */
const SIZE_A_CIRCUMFERENCE_MM = 37.83;

/** Circumference added by one whole letter. Half sizes add half of this. */
const MM_PER_LETTER = 1.2467;

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export type RingSize = {
  /** "L", "L½", "Z+2" — the label as a UK jeweller writes it. */
  label: string;
  /** URL- and filename-safe form: "L", "L-half", "Z2", "Z2-half". */
  id: string;
  circumferenceMm: number;
  diameterMm: number;
  /** Cross-reference only. Charts vary; never manufacture from this. */
  usSize: string;
};

/**
 * US sizes run in quarters from ¼ at UK A. Two UK steps (a half letter each)
 * make one US quarter, so the US scale advances half as fast as ours does.
 */
function usLabel(halfSteps: number): string {
  const quarters = halfSteps + 1;
  const whole = Math.floor(quarters / 4);
  const rem = quarters % 4;
  const fraction = ["", "¼", "½", "¾"][rem];
  if (whole === 0) return fraction || "0";
  return `${whole}${fraction}`;
}

function build(): RingSize[] {
  const sizes: RingSize[] = [];

  // A through Z, then Z+1 … Z+6 — the extension the UK uses above Z rather
  // than carrying on into a second alphabet.
  const stops: { label: string; id: string }[] = [];
  for (const letter of LETTERS) {
    stops.push({ label: letter, id: letter });
    stops.push({ label: `${letter}½`, id: `${letter}-half` });
  }
  for (let n = 1; n <= 6; n++) {
    stops.push({ label: `Z+${n}`, id: `Z${n}` });
    stops.push({ label: `Z+${n}½`, id: `Z${n}-half` });
  }

  stops.forEach((stop, halfSteps) => {
    const circumferenceMm =
      SIZE_A_CIRCUMFERENCE_MM + (halfSteps * MM_PER_LETTER) / 2;
    sizes.push({
      ...stop,
      circumferenceMm: round2(circumferenceMm),
      diameterMm: round2(circumferenceMm / Math.PI),
      usSize: usLabel(halfSteps),
    });
  });

  return sizes;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export const RING_SIZES: RingSize[] = build();

const BY_ID = new Map(RING_SIZES.map((s) => [s.id, s]));

export function ringSize(id: string): RingSize | undefined {
  return BY_ID.get(id);
}

/**
 * The default is deliberately *not* a size.
 *
 * Alpoe is on Hatton Garden with a bench and a sizing gauge, and asking someone
 * to guess their partner's finger is the single biggest point of abandonment in
 * a ring builder. Offering to measure them — or to post a sizer, which is the
 * answer when it's a surprise — turns the hardest question in the flow into a
 * reason to come in. It is also the one advantage a London workshop has over a
 * US site that a US site cannot copy.
 */
export const SIZE_UNKNOWN = "unknown" as const;

/**
 * L is the UK average for a woman's engagement ring, and L–N covers roughly
 * 60% of them, so the picker opens on that part of the scale rather than at A.
 * T is the men's average, seven sizes up, which matters when wedding bands
 * arrive in phase 2.
 */
export const COMMON_WOMENS_RANGE = { from: "G", to: "T" } as const;
export const AVERAGE_WOMENS_SIZE = "L" as const;
export const AVERAGE_MENS_SIZE = "T" as const;

/** The subset shown before the customer asks for the full scale. */
export function commonSizes(): RingSize[] {
  const from = RING_SIZES.findIndex((s) => s.id === COMMON_WOMENS_RANGE.from);
  const to = RING_SIZES.findIndex((s) => s.id === COMMON_WOMENS_RANGE.to);
  return RING_SIZES.slice(from, to + 1);
}

/**
 * The inner radius the shank is built to. This is what makes a size change a
 * real geometric change rather than a label on an unchanged ring.
 *
 * Note what deliberately does *not* scale with size: band width and profile
 * thickness. A size Z ring is made from the same 2.5 mm stock as a size J — the
 * hole gets bigger, the metal does not.
 */
export function innerRadiusMm(sizeId: string): number {
  const size = ringSize(sizeId);
  // An unknown size still has to render something, so fall back to the UK
  // average rather than refusing to draw a ring.
  const fallback = ringSize(AVERAGE_WOMENS_SIZE)!;
  return (size ?? fallback).diameterMm / 2;
}
