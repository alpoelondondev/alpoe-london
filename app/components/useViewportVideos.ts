"use client";

import { useEffect, useRef } from "react";

/**
 * Decorative films that play only while on screen.
 *
 * Two behaviours, deliberately separate. Buffering starts early and for every
 * clip, so a film is decoded well before anyone scrolls to it — that is what
 * makes a tile start instantly rather than showing a frozen poster for a beat.
 * Playback is then gated on visibility, so the clips off screen aren't burning
 * decode behind the viewport.
 *
 * Attach the returned ref callback to each <video> and start them at
 * `preload="none"` — this hook raises that once the page is past its splash.
 */
export function useViewportVideos() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Buffer in the background once the splash has dismissed, staggered so a
  // page of clips doesn't contend with itself — or with the hero, which is
  // still the first thing anyone actually looks at.
  useEffect(() => {
    const buffer = () => {
      videoRefs.current.forEach((video, i) => {
        if (!video) return;
        setTimeout(() => {
          if (video.preload === "none") {
            video.preload = "auto";
            video.load();
          }
        }, i * 600);
      });
    };

    window.addEventListener("page-loaded", buffer, { once: true });
    // Nothing will ever fire page-loaded if the splash is already dismissed or
    // was never mounted, so the films need a deadline of their own.
    const fallback = setTimeout(buffer, 3000);

    return () => {
      window.removeEventListener("page-loaded", buffer);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            // Autoplay is only permitted while muted, and React reflects the
            // attribute on first render alone — so reassert it on every start.
            video.muted = true;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      // Starts a beat before the tile lands, so it is already running rather
      // than visibly kicking off under the viewer's thumb.
      { threshold: 0.2, rootMargin: "100px 0px" },
    );

    videoRefs.current.forEach((video) => video && observer.observe(video));
    return () => observer.disconnect();
  }, []);

  /** Ref callback for the video at position `i` in the list. */
  const registerVideo = (i: number) => (el: HTMLVideoElement | null) => {
    videoRefs.current[i] = el;
  };

  return { registerVideo };
}
