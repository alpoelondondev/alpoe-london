"use client";

import { useEffect, useRef, useState } from "react";
import type { RingView } from "@/lib/ring/renders";
import DragCarousel from "../components/DragCarousel";
import ZoomView from "./ZoomView";
import { hasFailed, isReady, preload, whenIdle } from "./renderCache";

/**
 * The ring, held on screen for the whole of the studio.
 *
 * The problem this solves is the one every configurator has: the picture is at
 * the top, the controls are underneath it, and by the third control you are
 * choosing a metal for a ring you can no longer see. Changing something and not
 * being shown the change is indistinguishable from the control being broken.
 *
 * The name of the piece is deliberately NOT in here. Everything this component
 * renders is pinned, and a title that stays on screen while the page scrolls
 * past it reads as part of the furniture rather than as a caption for the
 * photograph. It is rendered by StudioClient, below the sticky box, where it
 * scrolls away like the rest of the page.
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

/**
 * One overlay arrow.
 *
 * No disc at all now that the arrows sit in the band's margin rather than over
 * the photograph. The chip existed to keep them legible against the ring; out
 * here there is nothing behind them but the band, and a bare stroke is quieter.
 */
function Arrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      data-haptic
      onClick={onClick}
      aria-label={side === "left" ? "Previous view" : "Next view"}
      className={`absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-sheet-ink/45 transition hover:text-sheet-ink active:scale-95 ${
        side === "left" ? "left-2 lg:left-4" : "right-2 lg:right-4"
      }`}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
        <path
          d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

const VIEW_LABEL: Record<RingView, string> = {
  angled: "Angled",
  front: "Front",
  side: "Side",
};

export default function RingViewport({
  views,
  pieceName,
  meta,
}: {
  /** The three views of the current configuration, empty if we have none. */
  views: { id: RingView; label: string; url: string }[];
  /** Only for the alt text and the no-render fallback. */
  pieceName: string;
  meta: string;
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
    <div className="flex flex-col">
      {/* ---- the picture ---------------------------------------------------
          The colour comes from the pinned strip this sits in, not from here.
          Painting it on a box around the picture is what made it read as a
          border: the strip had white padding above and below, so the grey
          became a framed panel rather than a band of the page. */}
      <div className="relative">
        <div className="mx-auto w-full max-w-[min(32vh,268px)] lg:max-w-[min(42vh,356px)]">
          {shown.length > 0 ? (
            <div className="relative">
              {/* The site's own DragCarousel rather than a bare scroller.
                  Native overflow gives a phone a perfect swipe and gives a
                  desktop nothing at all, since a mouse cannot flick. This adds
                  click and drag panning and the tap haptic, and it is the same
                  component every other rail on the site uses, so the gesture is
                  identical wherever you meet it. */}
              <DragCarousel
                scrollerRef={rail}
                onScroll={onScroll}
                ariaLabel="Views of your ring"
                className={`aspect-square w-full snap-mandatory overscroll-x-contain transition-opacity duration-150 ${
                  pending ? "opacity-60" : "opacity-100"
                }`}
              >
                {shown.map((v, i) => (
                  <div key={v.id} data-haptic className="w-full shrink-0 snap-center">
                    <ZoomView
                      src={v.url}
                      alt={`${pieceName}, ${v.label.toLowerCase()} view`}
                      eager={i === 0}
                    />
                  </div>
                ))}
              </DragCarousel>

              {/* On the picture rather than beside it. A rail with no visible
                  control reads as a static image on a desktop, where there is
                  no swipe to discover.

                  Hidden at the ends rather than disabled: a greyed out arrow is
                  still a control asking to be understood, where an absent one
                  says the same thing and asks nothing. */}
            </div>
          ) : (
            /* No renders configured, or none for this combination. The
               specification is the honest fallback: it is never wrong, and it
               visibly changes on every selection, which is the whole reason the
               panel is pinned. */
            <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 px-6 text-center">
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

        {/* Positioned against the band rather than the picture, so on a wide
            column they sit out in the margin either side of the ring instead of
            over it. The picture is capped at 356px and the band is the column,
            so there is usually room to spare. */}
        {shown.length > 1 && index > 0 && (
          <Arrow side="left" onClick={() => goTo(index - 1)} />
        )}
        {shown.length > 1 && index < shown.length - 1 && (
          <Arrow side="right" onClick={() => goTo(index + 1)} />
        )}
      </div>

      {/* ---- below the band, on the page ---------------------------------- */}
      {shown.length > 0 && (
        <div className="mt-3 flex items-center justify-center gap-2 max-lg:px-6">
          {shown.map((v, i) => (
            <button
              key={v.id}
              type="button"
              data-haptic
              onClick={() => goTo(i)}
              aria-label={`${VIEW_LABEL[v.id]} view`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === index ? "w-5 bg-sheet-ink" : "w-1.5 bg-sheet-ink/25 hover:bg-sheet-ink/45"
              }`}
            />
          ))}
        </div>
      )}

    </div>
  );
}
