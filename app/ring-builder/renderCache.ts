"use client";

/**
 * Keeps the ring picture instant on selection without costing anything at load.
 *
 * Two problems, and they pull in opposite directions.
 *
 * The first is the swap. Pointing an <img> at a new URL leaves the previous
 * frame on screen until the new one has been fetched and decoded, and on a slow
 * connection that gap reads as the click not having worked — so people click
 * again. Unmounting instead is worse: a blank white square, which reads as the
 * ring having been deleted. The fix is to never change what is displayed until
 * the replacement is decoded and ready to paint in the same frame.
 *
 * The second is page speed. The obvious way to make every option instant is to
 * preload all 46 neighbouring renders, which is about a megabyte of images the
 * customer probably will not look at, competing for bandwidth with the one
 * image that IS the page's LCP element. That trades a good Lighthouse score for
 * a feeling.
 *
 * So: nothing is prefetched until the main image has loaded and the browser is
 * idle, everything prefetched goes out at `fetchPriority: "low"` so it queues
 * behind anything real, and the bulk of it is triggered by intent — a pointer
 * entering a tile — rather than speculation. A mouse user gets the image
 * fetched during the 200–300ms between hovering a tile and pressing it, which
 * is long enough for a 21 KB WebP on almost any connection. A touch user gets
 * it from `pointerdown`, roughly 100ms before the click lands, plus the two
 * rails we do prefetch outright.
 */

/**
 * URLs that have been decoded and are sitting in the browser's image cache.
 *
 * Module-level, so the viewport and every tile share one. A `Map` to the
 * in-flight promise rather than a `Set` of strings, so two tiles asking for the
 * same render at once produce one request instead of two.
 */
const cache = new Map<string, Promise<void>>();

/**
 * URLs whose promise has actually resolved.
 *
 * Separate from `cache` because the two answer different questions: `cache`
 * says "has this been asked for", `settled` says "is it ready to paint now".
 * The viewport needs the second — a request that is still in flight must not
 * be swapped to, or the carousel shows a half-loaded frame.
 */
const settled = new Set<string>();

/**
 * URLs that could not be fetched at all.
 *
 * A render is missing when the bucket does not have it — a combination that
 * never made it into the upload, or a hand-edited URL. The viewport needs to
 * know the difference between "not ready yet" and "will never be ready",
 * because the first means wait and the second means show something else. Left
 * unhandled, a 404 paints the browser's broken-image icon, which is worse than
 * any fallback we could choose.
 */
const failed = new Set<string>();

/** Already decoded, so a swap to it can happen in this frame. */
export function isReady(url: string): boolean {
  return settled.has(url);
}

/** Tried and could not be fetched. */
export function hasFailed(url: string): boolean {
  return failed.has(url);
}

/**
 * Fetches and decodes a render, at most once.
 *
 * `decode()` rather than the `load` event, because `load` only means the bytes
 * arrived: painting an undecoded image still blocks on decoding it, on the main
 * thread, which is exactly the jank this is meant to avoid. `decode()` resolves
 * when the frame is ready to be painted for free.
 *
 * A rejection is swallowed on purpose. A missing render — a hand-edited URL, a
 * file that never made it into the bucket — must not throw inside an event
 * handler or an idle callback; the viewport simply keeps showing what it has.
 */
export function preload(url: string, priority: "low" | "high" = "low"): Promise<void> {
  const existing = cache.get(url);
  if (existing) return existing;

  const promise = new Promise<void>((resolve) => {
    const img = new Image();
    // Not in the type definitions in every TS lib version, and harmless where
    // the browser does not know it.
    (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = priority;
    img.decoding = "async";
    img.src = url;
    const done = () => {
      settled.add(url);
      resolve();
    };
    const gone = () => {
      failed.add(url);
      resolve();
    };
    img
      .decode()
      .then(done)
      .catch(() => {
        // Safari has historically rejected decode() for images that load fine,
        // so a rejection is not itself proof of failure — check whether the
        // bytes actually arrived before giving up on the URL.
        if (img.complete && img.naturalWidth > 0) done();
        else {
          img.onload = done;
          img.onerror = gone;
        }
      });
  });

  cache.set(url, promise);
  return promise;
}

/**
 * Runs work once the browser is genuinely idle, and never before load.
 *
 * `requestIdleCallback` is missing in Safari before 17, so it falls back to a
 * timeout — deliberately a long one. The point is not to be quick, it is to be
 * out of the way of everything Lighthouse measures.
 */
export function whenIdle(fn: () => void): () => void {
  let cancelled = false;
  const run = () => {
    if (cancelled) return;
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    if (ric) ric(() => !cancelled && fn());
    else setTimeout(() => !cancelled && fn(), 1200);
  };

  if (document.readyState === "complete") {
    run();
  } else {
    window.addEventListener("load", run, { once: true });
  }

  return () => {
    cancelled = true;
  };
}
