"use client";

import { useEffect, useState } from "react";

/**
 * False until the browser has finished the work that matters, then true.
 *
 * The live rose gold lockup is decoration — a logo that turns. three.js, the
 * GLTF and Draco loaders and the Draco decoder are close to half a megabyte of
 * JavaScript to draw it, and both the nav and the hero were pulling that chunk
 * the instant hydration finished. On a throttled phone that lands squarely on
 * top of the largest contentful paint: Lighthouse measured nearly three
 * seconds of "render delay" on the hero, which is not the browser waiting for
 * a file but the main thread being too busy to paint one it already has.
 *
 * Waiting for idle costs the mark a couple of hundred milliseconds nobody will
 * notice — the flat SVG is already on screen and it is the same artwork — and
 * gives those milliseconds back to the thing the visitor is actually looking
 * at. The 2.5s ceiling is there so a permanently busy page still gets its
 * lockup rather than never loading it at all.
 */
export function useDeferredUntilIdle(timeout = 2500): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleHandle: number | undefined;
    const go = () => {
      if (!cancelled) setReady(true);
    };

    const schedule = () => {
      const ric = (
        window as Window & {
          requestIdleCallback?: (
            cb: IdleRequestCallback,
            opts?: { timeout: number },
          ) => number;
        }
      ).requestIdleCallback;
      // Safari still has no requestIdleCallback. A timeout is a coarser
      // instrument but it clears the same window.
      if (ric) idleHandle = ric(go, { timeout });
      else idleHandle = window.setTimeout(go, 600);
    };

    // `load` rather than mount: it fires after the images and the film that
    // define the paint we are trying not to compete with.
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleHandle !== undefined) window.clearTimeout(idleHandle);
    };
  }, [timeout]);

  return ready;
}
