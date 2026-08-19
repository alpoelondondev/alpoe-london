import { BANDS, band, type BandId } from "@/lib/ring/bands";
import { head, headHoldsShape, type HeadId } from "@/lib/ring/heads";
import type { MetalId } from "@/lib/ring/metals";
import type { ShapeId } from "@/lib/ring/shapes";
import { renderUrl } from "@/lib/ring/renders";

/**
 * The fifteen band styles, each shown as one finished ring.
 *
 * ── Why the band is the style ──
 *
 * A style has to be the thing somebody says they want, and nobody walks in
 * asking for a hidden halo on a cathedral band. They ask for "something
 * twisted", "a plain one", "the sort with stones down the sides" — all of which
 * are bands. The head is a refinement made once the silhouette is settled,
 * which is why it is a decision inside the builder rather than a page of its
 * own. Fifteen cards is a page you can look at; the 225 band × head
 * combinations would be a catalogue nobody reaches the end of.
 *
 * ── Why each one is shown differently ──
 *
 * Every card carries a distinct head, a varied stone and a varied metal. That
 * is not decoration. A grid of fifteen identical round platinum solitaires
 * differing only in the shank teaches the customer that the band is the only
 * thing they get to choose, which is the opposite of true — and the one thing
 * this page exists to disprove, since every card opens a builder where all four
 * axes are live.
 *
 * The assignment is fixed rather than random so the page is stable between
 * visits and between server and client, and it was solved rather than picked:
 * all fifteen heads used exactly once, stones and metals spread as evenly as
 * fifteen cards allow, and every pair checked against the coverage table. The
 * constrained shapes come first — heart, pear and marquise rule out the most
 * heads — because assigning them last is what leaves a band with nothing legal.
 */

export type RingStyle = {
  id: BandId;
  label: string;
  description: string;
  aliases: string[];
  /** The exact ring photographed for this card. */
  showcase: { shape: ShapeId; head: HeadId; metal: MetalId };
};

const SHOWCASE: Record<BandId, RingStyle["showcase"]> = {
  solitaire: { shape: "heart", head: "4-prong-nouveau", metal: "platinum-950" },
  "knife-edge-solitaire": { shape: "pear", head: "6-prong-nouveau", metal: "18ct-yellow" },
  "split-ring-solitaire": { shape: "marquise", head: "6-prong-diamond", metal: "18ct-rose" },
  "french-pave": { shape: "princess", head: "classic-basket", metal: "18ct-white" },
  "cathedral-pave": { shape: "emerald", head: "diamond-basket", metal: "9ct-yellow" },
  "triple-row-pave": { shape: "radiant", head: "floral-halo", metal: "9ct-rose" },
  "round-channel": { shape: "asscher", head: "vintage-trefoil", metal: "9ct-white" },
  "baguette-channel": { shape: "cushion", head: "fancy-halo", metal: "platinum-950" },
  "floating-station": { shape: "oval", head: "dual-halo", metal: "18ct-yellow" },
  "alternating-marquise": { shape: "round", head: "surprise-diamond", metal: "18ct-rose" },
  "three-stone": { shape: "marquise", head: "diamond-tulip", metal: "18ct-white" },
  "knife-edge-pave": { shape: "pear", head: "classic-halo", metal: "9ct-yellow" },
  "floral-bypass": { shape: "cushion", head: "hidden-halo", metal: "9ct-rose" },
  "twist-pave": { shape: "oval", head: "clustered-diamond", metal: "9ct-white" },
  "alternating-baguette": { shape: "round", head: "classic-bezel", metal: "platinum-950" },
};

export function ringStyles(): RingStyle[] {
  return BANDS.map((b) => ({
    id: b.id,
    label: b.label,
    description: b.description,
    aliases: b.aliases,
    showcase: SHOWCASE[b.id],
  }));
}

/**
 * The front view of a style's showcase ring.
 *
 * Front rather than angled, because fifteen of these sit in a grid together:
 * face-on is the only view where the bands line up with each other, so the
 * differences between them read as differences rather than as fifteen
 * photographs taken from slightly different places.
 */
export function styleImage(style: RingStyle): string | undefined {
  return renderUrl(
    {
      band: style.id,
      shape: style.showcase.shape,
      head: style.showcase.head,
      bandMetal: style.showcase.metal,
    },
    "front",
  );
}

/**
 * Into the builder, on the exact ring in the picture.
 *
 * All four axes, not just the band. Carrying only the band would open the
 * builder on a round platinum four-claw — a visibly different ring from the one
 * just clicked, which reads as the link having gone somewhere else. The
 * customer changes what they like from there; that is the point of arriving
 * inside the builder rather than on a product page.
 */
export function styleHref(style: RingStyle): string {
  const { shape, head: headId, metal } = style.showcase;
  return `/ring-builder?band=${style.id}&shape=${shape}&head=${headId}&metal=${metal}&headMetal=${metal}`;
}

/** What the card calls the ring, in the same order the builder names it. */
export function styleTitle(style: RingStyle): string {
  return `${style.label} Engagement Ring`;
}

/** The head shown, for the line under the title. */
export function styleSubtitle(style: RingStyle): string {
  return `${head(style.showcase.head).label} head`;
}

/**
 * Every showcase pair is inside coverage — asserted rather than assumed,
 * because a pair outside it resolves to no URL and the card would silently
 * render without a picture.
 */
export function invalidStyles(): string[] {
  return ringStyles()
    .filter((s) => !headHoldsShape(s.showcase.head, s.showcase.shape))
    .map((s) => `${s.id}: ${s.showcase.head} cannot hold a ${s.showcase.shape}`);
}

export { band };
