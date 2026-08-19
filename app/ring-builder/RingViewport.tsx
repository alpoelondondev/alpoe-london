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
 * A translucent white disc rather than a solid one: the renders are lit on a
 * white sweep, so a solid chip would read as a hole punched in the photograph,
 * where a wash lets the ring show through behind it.
 */
function Arrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      data-haptic
      onClick={onClick}
      aria-label={side === "left" ? "Previous view" : "Next view"}
      className={`absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-sheet-ink/70 backdrop-blur-sm transition hover:bg-white hover:text-sheet-ink active:scale-95 ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
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
      {/* Bounded by height on every screen, not just desktop, and deliberately
          small.

          This is what the fill scale bought. A fifth of every frame used to be
          white sweep, so a 390px panel on a phone was showing about 300px of
          ring; now the ring meets the edges, and a 42vh panel shows appreciably
          more ring than the old 50vh did while still leaving the page to the
          controls the panel exists to serve.

          356px is not a round number, it is the largest the renders actually
          support. The fill scale means a panel of width W asks for W x 1.26
          CSS pixels of image, so a 2x screen wants W x 2.52 device pixels —
          and 900 / 2.52 is 357. Above that the browser is upscaling a 900px
          render and the facets go soft, which is the one thing worth protecting
          on a photograph of a diamond.

          Raising it further is a re-conversion at 1200px, not a CSS change. */}
      <div className="mx-auto w-full max-w-[min(42vh,356px)]">
        {shown.length > 0 ? (
          <>
            <div className="relative">
              {/* The site's own DragCarousel rather than a bare scroller.
                  Native overflow gives a phone a perfect swipe and gives a
                  desktop nothing at all — a mouse cannot flick, so the rail
                  reads as a still photograph unless you find the arrows. This
                  adds click-and-drag panning and the tap haptic, and it is the
                  same component every other rail on the site uses, so the
                  gesture is identical wherever you meet it.

                  Its trick is worth knowing: it withholds setPointerCapture on
                  pointerdown, because capturing there silently retargets the
                  following click to the container. Capture is taken only once
                  movement passes 12px. */}
              <DragCarousel
                scrollerRef={rail}
                onScroll={onScroll}
                ariaLabel="Views of your ring"
                // Square, because the ring's own bounding box is 1.02:1 — see
                // FILL in ZoomView, which scales the dead sweep away so the ring
                // meets the edges. A square subject cannot fill a wider frame
                // without being clipped or leaving margin, so the panel spends
                // less room by being smaller rather than flatter.
                className={`aspect-square w-full snap-mandatory overscroll-x-contain bg-white transition-opacity duration-150 ${
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
                control reads as a static image on a desktop, where there is no
                swipe to discover — and putting the controls outside the frame
                spends vertical space the half-screen cap cannot afford.

                Hidden at the ends rather than disabled: a greyed-out arrow is
                still a control asking to be understood, where an absent one
                says the same thing and asks nothing. */}
            {index > 0 && (
              <Arrow side="left" onClick={() => goTo(index - 1)} />
            )}
            {index < shown.length - 1 && (
              <Arrow side="right" onClick={() => goTo(index + 1)} />
            )}
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
                      ? "w-5 bg-sheet-ink"
                      : "w-1.5 bg-sheet-ink/25 hover:bg-sheet-ink/45"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          /* No renders configured, or none for this combination. The
             specification is the honest fallback: it is never wrong, and it
             visibly changes on every selection, which is the whole reason the
             panel is pinned. */
          <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 bg-white px-6 text-center">
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

      {/* The piece used to be named here, with its metal and "price on
          request" underneath. All three said what the rows below already say —
          every rail carries its own current value, and the specification at the
          foot of the page carries the lot. Three lines of restatement directly
          under the picture, on a panel whose whole justification is that it
          never takes more than half the screen.

          The two-tone caveat stays, because it is the one thing here the
          picture genuinely cannot express. */}
      {note && (
        <p className="max-w-[42ch] t-copy max-lg:px-6 !text-sheet-ink">{note}</p>
      )}
    </div>
  );
}
