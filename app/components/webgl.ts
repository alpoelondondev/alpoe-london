/**
 * Is a WebGL context actually obtainable in this browser, right now?
 *
 * This exists because `new THREE.WebGLRenderer()` does not fail softly — when
 * a context cannot be created it *throws*, synchronously, from a constructor
 * we were calling inside `useEffect`. React treats a throw during commit as a
 * render error, and with no error boundary above it the whole tree unmounts
 * and Next.js swaps the document for `<html id="__next_error__">`. The head
 * goes with it: no <title>, no meta description, no lang attribute, no copy.
 *
 * That is not a hypothetical. Headless Chrome without a GPU — which is what
 * Lighthouse, PageSpeed Insights and Google's own rendering service run — hits
 * it every single time, so the rendered version of the site search engines saw
 * was a blank error page while the raw HTML looked perfect. Probing first
 * turns "site is broken for crawlers" into "mark quietly doesn't animate".
 *
 * Cached because the answer cannot change within a page's life, and each probe
 * costs a real context we then have to hand back.
 */
let cached: boolean | null = null;

export function supportsWebGL(): boolean {
  if (cached !== null) return cached;
  if (typeof window === "undefined") return (cached = false);

  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ??
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return (cached = false);
    // Hand the context straight back. Browsers cap how many live at once, and
    // a probe that keeps one costs the page a slot it may need for the mark.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return (cached = true);
  } catch {
    return (cached = false);
  }
}
