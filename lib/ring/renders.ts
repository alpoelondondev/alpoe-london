import { headHoldsShape, type HeadId } from "./heads";
import { metalSlug, type MetalId } from "./metals";
import { shapeSlug, type ShapeId } from "./shapes";
import type { BandId } from "./bands";

/**
 * Where the photograph of a given configuration lives.
 *
 * This is the thing the whole builder was missing. Every previous version had
 * one picture per setting, shot with one stone in one metal, so the viewer
 * showed the same round platinum solitaire whatever the customer chose — a
 * picture actively contradicting the specification printed under it.
 *
 * The reference library closes that completely: 15 bands × 10 shapes × 15 heads
 * × 6 metals, three views each, and the route is entirely derivable from the
 * configuration. No lookup table, no manifest, no generation step — the ids
 * ARE the path. That is why the ids in bands.ts, heads.ts and shapes.ts are the
 * library's own strings rather than tidier ones: keeping them identical means
 * this function is four string concatenations and can never fall out of step
 * with what is on disk.
 *
 * ── Coverage ──
 *
 * 119 of the 150 shape × head pairs exist, identically for every band. A
 * missing pair means "not sold", never "download failed". `headHoldsShape` is
 * the same table, and the pickers use it to keep the customer inside coverage
 * rather than letting them walk into a 404 — so by the time we get here the
 * combination is valid. The guard stays anyway: a hand-edited URL is a
 * perfectly ordinary way to arrive at this function.
 *
 * ── Carat ──
 *
 * Deliberately absent from the path. Every render is the 1.00ct preview size,
 * and the library's own source site reuses them across its 1.5, 2 and 2.5ct
 * buttons. Stone size is quoted in millimetres in the specification, which is
 * the honest place for it — a photograph on a screen has no scale.
 */

export type RingView = "angled" | "front" | "side";

/**
 * The three views, in the order a customer wants them — front first.
 *
 * Front is how you look at a ring on a hand, and it is the only view where the
 * stone's outline, the head's proportion to it and a halo's real effect on
 * apparent size are all legible at once. Angled is the more flattering
 * photograph, which is why catalogues lead with it, but this is a tool for
 * deciding rather than a shop window: the first frame should answer the
 * question the customer is actually asking.
 */
export const RING_VIEWS: { id: RingView; label: string }[] = [
  { id: "front", label: "Front" },
  { id: "angled", label: "Angled" },
  { id: "side", label: "Side" },
];

/**
 * Where the library is served from.
 *
 * An env var rather than a hard-coded `/renders/...`, because at roughly a
 * gigabyte the library cannot live in the repository: it would blow past
 * deployment size limits and make every clone of this project a gigabyte
 * heavier for ever. It belongs on object storage with a CDN in front.
 *
 * Unset, every lookup returns undefined and the builder degrades to type — the
 * same well-worn path the old photography took. Nothing breaks locally.
 *
 * The bucket's layout is the source tree's, unchanged, with `.webp` in place of
 * `.jpg` — see scripts/build-ring-renders.py. So the root you point this at is
 * whatever prefix sits directly above the fifteen band folders.
 */
const BASE = process.env.NEXT_PUBLIC_RING_RENDERS_URL?.replace(/\/$/, "");

export function hasRenders(): boolean {
  return Boolean(BASE);
}

/**
 * Deliberately the fields of `RingConfig` rather than a reshaped copy, so a
 * whole configuration can be handed straight to `renderUrl` with no adapter to
 * keep in step.
 *
 * `bandMetal` and not `headMetal`: the library has no two-tone renders, so a
 * customer who has broken the two metals apart cannot be shown their exact
 * ring. The band is the larger surface and the one read as "the metal" at a
 * glance, so it is the honest half to picture — and the viewport says so rather
 * than letting the picture quietly overrule the specification.
 */
export type RenderConfig = {
  band: BandId;
  shape: ShapeId;
  head: HeadId;
  bandMetal: MetalId;
};

export function renderUrl(config: RenderConfig, view: RingView = "front"): string | undefined {
  if (!BASE) return undefined;
  if (!headHoldsShape(config.head, config.shape)) return undefined;

  const shape = shapeSlug(config.shape);
  const metal = metalSlug(config.bandMetal);
  const stem = `${config.band}_${shape}_${config.head}_${metal}`;

  return `${BASE}/${config.band}/${shape}/${config.head}/${metal}/${stem}_${view}.webp`;
}

/**
 * The origin the renders are served from, for a `<link rel="preconnect">`.
 *
 * Worth the tag on its own line in the head. The first render is the page's
 * LCP element and it lives on a different host to the document, so without a
 * preconnect the browser pays DNS + TCP + TLS — three round trips, easily
 * 200–300ms on mobile — only *after* it has parsed the markup far enough to
 * discover the image. Preconnecting starts that handshake while the HTML is
 * still arriving, so the connection is warm by the time the URL is known.
 */
export function rendersOrigin(): string | undefined {
  if (!BASE) return undefined;
  try {
    return new URL(BASE).origin;
  } catch {
    return undefined;
  }
}

/** All three views of one configuration, for the viewport's view switcher. */
export function renderViews(config: RenderConfig): { id: RingView; label: string; url: string }[] {
  return RING_VIEWS.flatMap((v) => {
    const url = renderUrl(config, v.id);
    return url ? [{ ...v, url }] : [];
  });
}
