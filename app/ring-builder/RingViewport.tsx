"use client";

import { useEffect, useRef, useState } from "react";
import type { RingView } from "@/lib/ring/renders";
import { hasFailed, isReady, preload, whenIdle } from "./renderCache";

/**
 * The ring, held on screen for the whole of the studio.
 *
 * The problem this solves is the one every configurator has: the picture is at
 * the top, the controls are underneath it, and by the third control you are
 * choosing a metal for a ring you can no longer see. Changing something and not
 * being shown the change is indistinguishable from the control being broken.
 *
 * ── Size ──
 *
 * Never more than half the screen, and that is a hard rule rather than a
 * default. A pinned panel is charged rent on every screen below it: whatever it
 * takes, the customer scrolls for ever after. The picture is capped in vh so it
 * cannot exceed half the viewport, and again in pixels so a tall desktop window
 * does not turn it into a poster.
 *
 * ── One viewer, three photographs, a carousel ──
 *
 * Angled, front and side answer different questions, and the library has all
 * three for every combination. Angled shows the ring; front is the only view
 * where a halo's real effect on the stone's size is legible; side is where band
 * thickness and head height live, which is what anyone who has worn a ring
 * before actually asks about.
 *
 * They are a swipeable rail rather than three buttons because the gesture is
 * already the one people bring to a product photograph — every shop they have
 * used works this way — and because a rail costs no vertical space, which the
 * half-screen cap makes precious. Native scroll-snap does the work, so momentum
 * and rubber-banding are the platform's rather than a hand-rolled imitation.
 *
 * Only the first frame is eager. The other two are `loading="lazy"` and, being
 * outside the scroll port, are not fetched until the customer swipes — so the
 * two views nobody looks at cost nothing on a page whose LCP is the first.
 */

const VIEW_LABEL: Record<RingView, string> = {
  angled: "Angled",
  front: "Front",
  side: "Side",
};

export default function RingViewport({
  views,
  pieceName,
  meta,
  note,
}: {
  /** The three views of the current configuration, empty if we have none. */
  views: { id: RingView; label: string; url: string }[];
  pieceName: string;
  meta: string;
  /** A caveat the picture cannot express — two-tone, say. */
  note?: string;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  /**
   * What is actually on screen, which lags `views` by exactly as long as it
   * takes to decode the frame being looked at — and by nothing at all once it
   * is cached.
   *
   * Holding the previous set is the whole trick, and it has to be the whole
   * set rather than one image: swapping them individually would leave the rail
   * showing the new angled view beside the old side view, which is a worse lie
   * than either on its own. Swapping `src` immediately leaves a half-loaded
   * image; unmounting leaves a white square. Both read as the click having
   * failed, and both make people click again.
   */
  const [shown, setShown] = useState(views);
  const [pending, setPending] = useState(false);
  const wanted = useRef(views);

  const key = views.map((v) => v.url).join("|");

  useEffect(() => {
    wanted.current = views;
    if (!views.length) {
      setShown([]);
      setPending(false);
      return;
    }
    const lead = (views[index] ?? views[0]).url;
    if (isReady(lead)) {
      setShown(views);
      setPending(false);
      return;
    }
    setPending(true);
    preload(lead, "high").then(() => {
      // Missing from the bucket. Falling back to the specification card is the
      // only honest option: it is never wrong, whereas a broken-image icon
      // tells the customer the site is broken rather than that one photograph
      // is absent.
      if (hasFailed(lead)) {
        if (wanted.current === views) {
          setShown([]);
          setPending(false);
        }
        return;
      }
      // A later selection may have overtaken this one mid-flight. Dropping the
      // stale result is what stops a slow render landing on top of a fast one
      // the customer picked afterwards.
      if (wanted.current !== views) return;
      setShown(views);
      setPending(false);
    });
    // `key` rather than `views`: the array identity changes on every render of
    // the parent, the URLs only change when the ring does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  /**
   * The two views not being looked at, once the page is quiet. Two images, so a
   * swipe is instant without this ever being the reason a page is slow.
   */
  useEffect(() => {
    const others = views.filter((_, i) => i !== index).map((v) => v.url);
    if (!others.length) return;
    return whenIdle(() => others.forEach((u) => preload(u)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, index]);

  /**
   * Which frame is centred, read off the scroll position rather than tracked in
   * a handler. Scroll-snap means the browser owns the animation; asking it
   * where it landed is the only reading that cannot disagree with what is on
   * screen.
   */
  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    setIndex((prev) => (prev === next ? prev : next));
  };

  const goTo = (i: number) => {
    const el = rail.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* On a phone the picture runs the full width of the screen and is
          pinned, so the customer scrolls the options underneath a ring that
          never leaves. `50vh` still caps it — full-bleed is about width, and a
          panel that took more than half the height would leave nothing to
          scroll to.

          On desktop it sits in its own column, so it is centred and capped in
          pixels as well: a tall window should not spend all of itself on one
          photograph. */}
      <div className="mx-auto w-full max-lg:max-w-none lg:max-w-[min(50vh,420px)]">
        {shown.length > 0 ? (
          <>
            <div
              ref={rail}
              onScroll={onScroll}
              aria-label="Views of your ring"
              // max-h-[50vh] is the hard half-screen rule; on a phone the
              // square would otherwise be as tall as the screen is wide.
              className="scrollbar-none flex aspect-square max-h-[50vh] w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-white max-lg:border-y lg:border max-lg:border-sheet-line lg:border-sheet-line lg:shadow-[0_1px_3px_rgba(23,19,18,0.10)]"
            >
              {shown.map((v, i) => (
                <div key={v.id} className="relative w-full shrink-0 snap-center">
                  {/* eslint-disable-next-line @next/next/no-img-element -- see renderCache.ts */}
                  <img
                    src={v.url}
                    width={900}
                    height={900}
                    alt={`${pieceName}, ${v.label.toLowerCase()} view`}
                    decoding="async"
                    // The first frame is the page's LCP element, so it is eager
                    // and prioritised; the other two are off-screen in the rail
                    // and are not fetched until somebody swipes.
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "low"}
                    className={`h-full w-full object-contain transition-opacity duration-150 ${
                      pending ? "opacity-60" : "opacity-100"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Dots, and they are buttons rather than decoration — a desktop
                visitor with a mouse has no swipe, and a rail whose only control
                is a gesture they cannot make is a rail with two hidden thirds. */}
            <div className="mt-2.5 flex items-center justify-center gap-2 max-lg:px-6">
              {shown.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  data-haptic
                  onClick={() => goTo(i)}
                  aria-label={`${VIEW_LABEL[v.id]} view`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === index
                      ? "w-5 bg-accent-deep"
                      : "w-1.5 bg-sheet-ink/25 hover:bg-sheet-ink/45"
                  }`}
                />
              ))}
              <span className="ml-2 text-[9px] tracking-[0.16em] uppercase text-sheet-dim">
                {VIEW_LABEL[(shown[index] ?? shown[0]).id]}
              </span>
            </div>
          </>
        ) : (
          /* No renders configured, or none for this combination. The
             specification is the honest fallback: it is never wrong, and it
             visibly changes on every selection, which is the whole reason the
             panel is pinned. */
          <div className="flex aspect-square max-h-[50vh] w-full flex-col items-center justify-center gap-2 bg-white px-6 text-center max-lg:border-y lg:border lg:border-sheet-line max-lg:border-sheet-line">
            <p className="font-serif text-[clamp(15px,2.4vw,22px)] leading-tight text-sheet-ink">
              {pieceName}
            </p>
            <p className="text-[11px] leading-snug text-sheet-dim">{meta}</p>
            <p className="mt-3 max-w-[26ch] text-[9px] leading-relaxed tracking-[0.16em] uppercase text-sheet-dim/70">
              Photography loading shortly
            </p>
          </div>
        )}
      </div>

      <div className="max-lg:px-6">
        <h2 className="t-sub">{pieceName}</h2>
        <p className="mt-1 text-[12px] leading-snug text-sheet-dim">{meta}</p>
        <p className="mt-1 text-[10px] tracking-[0.16em] uppercase text-sheet-dim">
          Price on request
        </p>
        {note && (
          <p className="mt-2 max-w-[42ch] text-[11px] leading-relaxed text-accent-deep">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
