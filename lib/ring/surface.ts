/**
 * The ground the rings are presented on.
 *
 * Defined once because it is needed in four places that cannot see each other:
 * the Tailwind classes on the viewer pane and the option tiles, the WebGL clear
 * colour in the live viewer, and the clear colour in the offscreen thumbnail
 * forge. Those last two are numbers rather than strings, and if any one of them
 * drifts the tiles stop matching the viewer — which reads as a bug rather than
 * as a colour choice.
 *
 * White, and it earns it. The stone is rendered with `transmission`, which
 * refracts whatever is actually behind it: over a dark ground a diamond
 * refracts darkness and comes out a grey pebble, and over white it goes
 * crystal clear. It is the single biggest lever on whether the render reads as
 * a diamond, and it is why every serious ring builder photographs and renders
 * on white.
 *
 * On a dark site this is a deliberate second surface, not an accident. There is
 * precedent: `globals.css` already carries a light palette for /metal-prices,
 * described there as "a document laid on the page rather than another band of
 * it".
 */

/** For CSS — use as `bg-[var(--ring-surface)]` or an inline style. */
export const RING_SURFACE_CSS = "#ffffff";

/** The same colour for `renderer.setClearColor`. */
export const RING_SURFACE_HEX = 0xffffff;
