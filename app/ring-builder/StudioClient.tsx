"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import OptionTile from "./OptionTile";
import OptionRow from "./OptionRow";
import RingViewport from "./RingViewport";
import {
  CARAT_PRESETS,
  DEFAULT_CONFIG,
  magicSizeHint,
  ORIGINS,
  QUALITIES,
  quality,
  type OriginId,
  type QualityId,
  type RingConfig,
} from "@/lib/ring/config";
import { BANDS, band, bandIcon, type BandId } from "@/lib/ring/bands";
import {
  HEADS,
  head,
  headIcon,
  headHoldsShape,
  resolveHead,
  type HeadId,
} from "@/lib/ring/heads";
import { METALS, metalIcon, type MetalId } from "@/lib/ring/metals";
import { SHAPES, shape, shapeIcon, type ShapeId } from "@/lib/ring/shapes";
import { commonSizes, RING_SIZES, SIZE_UNKNOWN } from "@/lib/ring/sizes";
import { ringSpecLines, ringSpecText } from "@/lib/ring/spec";
import { renderUrl, renderViews } from "@/lib/ring/renders";
import { preload, whenIdle } from "./renderCache";
import { buildRingSpecUrl } from "@/lib/whatsapp";

/**
 * The studio.
 *
 * ── The layout ──
 *
 * Two columns on a desktop: the ring pinned in the left, every control
 * scrolling in the right. That is the shape because it is the only one where
 * the customer can see the ring and the control they are touching at the same
 * time — which is the entire job. Stacked, the picture is either above the
 * controls (and gone by the third one) or pinned over them (and eating the
 * screen they need).
 *
 * On a phone there is no second column to have, so the viewport goes back on
 * top and sticks — capped at half the height, which is the rule the viewport
 * enforces for itself.
 *
 * ── The order of the controls ──
 *
 * Band, stone, head, metal — the library's own order, and it is also the order
 * people decide in. The band is the silhouette and the thing somebody says
 * they want ("something twisted", "a plain one"); the stone is the decision
 * with the money in it; the head is a refinement of the stone; metal is nearly
 * always already settled before anyone opens the page. Carat sits with the
 * stone rather than in a row of its own, because it is the same decision.
 */

const GUTTER = "px-[52px] max-md:px-6";

export default function StudioClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  /**
   * The configuration lives entirely in the URL: shareable, back-button-safe,
   * and it means the WhatsApp message can carry a link the counter opens to see
   * the exact ring.
   */
  const config: RingConfig = useMemo(
    () => ({
      band: (params.get("band") as BandId) ?? DEFAULT_CONFIG.band,
      head: (params.get("head") as HeadId) ?? DEFAULT_CONFIG.head,
      shape: (params.get("shape") as ShapeId) ?? DEFAULT_CONFIG.shape,
      carat: Number(params.get("ct") ?? DEFAULT_CONFIG.carat),
      origin: (params.get("origin") as OriginId) ?? DEFAULT_CONFIG.origin,
      quality: (params.get("quality") as QualityId) ?? DEFAULT_CONFIG.quality,
      headMetal: (params.get("headMetal") as MetalId) ?? DEFAULT_CONFIG.headMetal,
      bandMetal: (params.get("metal") as MetalId) ?? DEFAULT_CONFIG.bandMetal,
      size: params.get("size") ?? DEFAULT_CONFIG.size,
      engraving: params.get("engraving") ?? "",
    }),
    [params],
  );

  const set = useCallback(
    (patch: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (!v) next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  /** Metals move together until the customer deliberately breaks them apart. */
  const setMetal = (id: MetalId) =>
    config.headMetal === config.bandMetal
      ? set({ metal: id, headMetal: id })
      : set({ metal: id });

  const activeBand = band(config.band);
  const activeHead = head(config.head);
  const activeShape = shape(config.shape);
  const activeMetal = METALS.find((m) => m.id === config.bandMetal)!;
  const activeQuality = quality(config.quality);
  const activeOrigin = ORIGINS.find((o) => o.id === config.origin)!;
  const specLines = ringSpecLines(config);
  const hint = magicSizeHint(config.carat);
  const views = renderViews(config);

  /** A one-line note when a choice moved the other axis to accommodate it. */
  const [adjusted, setAdjusted] = useState<string | null>(null);

  /**
   * Changing the stone can invalidate the head — a heart will not sit in a
   * six-claw. The customer keeps their head wherever it is legal, and is only
   * moved when it genuinely cannot hold the new stone. Silently moving them
   * without saying so is how a builder loses trust; refusing the change outright
   * is how it feels broken.
   */
  const chooseShape = (id: ShapeId) => {
    const { head: nextHead, changed } = resolveHead(config.head, id);
    setAdjusted(
      changed
        ? `A ${shape(id).label.toLowerCase()} won't sit in the ${activeHead.label.toLowerCase()}, so the head is now a ${head(nextHead).label.toLowerCase()}.`
        : null,
    );
    set({ shape: id, head: nextHead });
  };

  const chooseHead = (id: HeadId) => {
    if (!headHoldsShape(id, config.shape)) {
      setAdjusted(
        `The ${head(id).label.toLowerCase()} can't hold a ${activeShape.label.toLowerCase()} — pick another stone first and it opens up.`,
      );
      return;
    }
    setAdjusted(null);
    set({ head: id });
  };

  /**
   * The render one click away, for any single change to the configuration.
   *
   * One helper rather than four, because every rail is asking the same
   * question: "what would the ring look like if only this changed?" That is
   * literally the config with one field replaced, which is also exactly what
   * `renderUrl` takes.
   */
  const neighbour = useCallback(
    (patch: Partial<typeof config>) => {
      const url = renderUrl({ ...config, ...patch });
      return url ? () => preload(url) : undefined;
    },
    [config],
  );

  /**
   * Warm the two rails people actually move most, once the page is quiet.
   *
   * Shape and metal, and only those: ten plus seven renders is about 350 KB,
   * which is affordable at low priority after load, whereas warming all four
   * rails would be over a megabyte competing with the image that IS the LCP
   * element. Bands and heads are left to hover intent, which covers them for
   * the cost of nothing.
   */
  useEffect(() => {
    const urls = [
      ...SHAPES.map((s) => renderUrl({ ...config, shape: s.id, head: resolveHead(config.head, s.id).head })),
      ...METALS.map((m) => renderUrl({ ...config, bandMetal: m.id })),
    ].filter((u): u is string => Boolean(u));
    if (!urls.length) return;
    return whenIdle(() => urls.forEach((u) => preload(u)));
  }, [config]);

  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const shareUrl = origin ? `${origin}${pathname}?${params.toString()}` : undefined;

  const pieceName = `${config.carat.toFixed(2)}ct ${activeShape.label} ${activeHead.label}`;
  const twoTone = config.headMetal !== config.bandMetal;

  return (
    /* `on-sheet` flips the type roles — which carry their own colour — onto the
       sheet's ink; see the note beside it in globals.css. The studio is a light
       document because a diamond is photographed against white for a physical
       reason, and the page was the thing disagreeing with the pictures. */
    <div className="on-sheet bg-sheet">
      <div className={`mx-auto grid max-w-7xl grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] gap-10 ${GUTTER} py-6 max-lg:grid-cols-1 max-lg:gap-0 max-lg:px-0 max-lg:py-0`}>
        {/* ---- the ring ---------------------------------------------------
            Sticky in its own column on desktop; on a phone it stacks above the
            rails and stays pinned to the top of the viewport, so it is on
            screen for every selection made below it. That is the whole reason
            it is pinned — it changes on each one, and a control whose effect
            has scrolled out of sight is indistinguishable from a broken one.

            `--nav-h` is the fixed bar's measured height, kept in one place so
            this cannot drift the next time a row is added to the bar. The sheet
            ground and the padding are on the sticky box itself: without them
            the rails would scroll through the strip between the bar and the
            panel rather than behind it. */}
        <div
          className="sticky z-20 self-start bg-sheet py-3 max-lg:px-6"
          style={{ top: "var(--nav-h)" }}
        >
          <div>
            <RingViewport
              views={views}
              pieceName={pieceName}
              meta={`${activeBand.label} band · ${activeMetal.label} · ${activeOrigin.label}`}
              note={
                twoTone
                  ? "Shown in the band metal — we have no two-tone photograph, but the specification carries both."
                  : undefined
              }
            />
          </div>
        </div>

        {/* ---- the selections ---------------------------------------------
            Rails rather than grids. Fifteen bands in a grid is a wall; in a
            rail it is a run you flick through, and every group keeps the same
            height so the column has a rhythm. */}
        <div className="min-w-0 divide-y divide-sheet-line max-lg:border-t max-lg:border-sheet-line">
          <OptionRow
            label="Band"
            value={activeBand.label}
            hint={<p className="max-w-[56ch] t-copy">{activeBand.description}</p>}
          >
            {BANDS.map((b) => (
              <OptionTile
                key={b.id}
                label={b.label}
                icon={bandIcon(b.id)}
                active={b.id === config.band}
                title={b.description}
                onPrefetch={neighbour({ band: b.id })}
                onSelect={() => set({ band: b.id })}
              />
            ))}
          </OptionRow>

          <OptionRow
            label="Centre stone"
            value={`${config.carat.toFixed(2)}ct ${activeShape.label}`}
          >
            {SHAPES.map((s) => (
              <OptionTile
                key={s.id}
                label={s.label}
                icon={shapeIcon(s.id)}
                active={s.id === config.shape}
                title={s.label}
                onPrefetch={neighbour({ shape: s.id, head: resolveHead(config.head, s.id).head })}
                onSelect={() => chooseShape(s.id)}
              />
            ))}
          </OptionRow>

          {/* Carat sits directly under the shapes because it is the same
              decision, and it is a row of fixed choices rather than a slider —
              see the note on CARAT_PRESETS for why. It keeps the rail pattern
              so the column has one rhythm, but the cards are numbers rather
              than pictures: there is nothing to photograph, since every render
              in the library is the 1.00ct preview size. */}
          <OptionRow label="Carat weight" value={`${config.carat.toFixed(2)}ct`}>
            {CARAT_PRESETS.map((ct) => (
              <button
                key={ct}
                type="button"
                data-haptic
                onClick={() => set({ ct: String(ct) })}
                aria-pressed={ct === config.carat}
                className={`flex h-[52px] w-[74px] shrink-0 snap-start items-center justify-center border font-serif text-[15px] tabular-nums transition-[border-color,transform,background-color] duration-200 max-sm:w-[66px] ${
                  ct === config.carat
                    ? "border-accent-deep bg-accent/[0.10] text-sheet-ink"
                    : "border-sheet-line text-sheet-ink/70 hover:border-sheet-ink/40 active:scale-[0.97]"
                }`}
              >
                {ct % 1 === 0 ? ct.toFixed(0) : ct}
              </button>
            ))}
          </OptionRow>

          <section className={`-mt-2 pb-5 ${GUTTER}`}>
            <p className="max-w-[56ch] t-copy">
              A guide only — tell us roughly where you&rsquo;d like to be and we&rsquo;ll
              show you comparable stones either side of it. The photograph stays at one
              carat; your millimetres are in the specification below.
            </p>
            {hint && (
              <p className="t-copy mt-2 max-w-[56ch]">
                {/* The saving is real and worth naming, so the shy weight is a
                    control rather than a fact to act on manually — being told
                    about a cheaper stone and then having to go and find it is a
                    worse experience than not being told. */}
                <span className="text-sheet-ink/72">Worth knowing — a </span>
                <button
                  type="button"
                  data-haptic
                  onClick={() => set({ ct: hint.toFixed(2) })}
                  className="text-accent-deep underline underline-offset-4 transition hover:text-sheet-ink"
                >
                  {hint.toFixed(2)}ct
                </button>
                <span className="text-sheet-ink/72">
                  {" "}
                  stone looks all but identical to a {(hint + 0.1).toFixed(2)}ct and
                  usually costs around 10% less.
                </span>
              </p>
            )}
          </section>

          <OptionRow
            label="Head"
            value={activeHead.label}
            hint={
              <>
                <p className="max-w-[56ch] t-copy">{activeHead.description}</p>
                {adjusted && (
                  <p className="t-copy mt-2 max-w-[56ch] !text-accent-deep">{adjusted}</p>
                )}
              </>
            }
          >
            {HEADS.map((h) => {
              const holds = headHoldsShape(h.id, config.shape);
              return (
                <OptionTile
                  key={h.id}
                  label={h.label}
                  icon={headIcon(h.id)}
                  active={h.id === config.head}
                  unavailable={!holds}
                  onPrefetch={holds ? neighbour({ head: h.id }) : undefined}
                  title={
                    holds
                      ? h.description
                      : `${h.description} — not made for a ${activeShape.label.toLowerCase()}`
                  }
                  onSelect={() => chooseHead(h.id)}
                />
              );
            })}
          </OptionRow>

          <OptionRow
            label="Precious metal"
            value={activeMetal.label}
            hint={
              activeMetal.note ? (
                <p className="max-w-[56ch] t-copy">{activeMetal.note}</p>
              ) : undefined
            }
          >
            {METALS.map((m) => (
              <OptionTile
                key={m.id}
                label={m.label}
                icon={metalIcon(m.id)}
                active={m.id === config.bandMetal}
                title={m.label}
                onPrefetch={neighbour({ bandMetal: m.id })}
                onSelect={() => setMetal(m.id)}
              />
            ))}
          </OptionRow>

          <OptionRow
            label="Origin"
            value={activeOrigin.label}
            hint={
              <p className="max-w-[56ch] t-copy">
                {activeOrigin.note}{" "}
                <a
                  href="/guides/natural-vs-lab-grown-diamonds"
                  className="text-accent-deep underline underline-offset-4"
                >
                  A straight answer on the difference
                </a>
              </p>
            }
          >
            {ORIGINS.map((o) => (
              <Chip
                key={o.id}
                label={o.label}
                active={o.id === config.origin}
                onSelect={() => set({ origin: o.id })}
              />
            ))}
          </OptionRow>

          <OptionRow
            label="Quality"
            value={activeQuality.label}
            hint={
              activeQuality.note ? (
                <p className="max-w-[56ch] t-copy">{activeQuality.note}</p>
              ) : undefined
            }
          >
            {QUALITIES.map((q) => (
              <Chip
                key={q.id}
                label={q.label}
                sub={config.origin === "laboratory-grown" ? q.laboratoryGrown : q.natural}
                active={q.id === config.quality}
                onSelect={() => set({ quality: q.id })}
              />
            ))}
          </OptionRow>

          {/* ---- finishing ------------------------------------------------ */}
          <section className={`grid grid-cols-2 gap-6 py-7 max-sm:grid-cols-1 ${GUTTER}`}>
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-sheet-dim">
                UK ring size
              </p>
              <select
                value={config.size}
                onChange={(e) => set({ size: e.target.value })}
                aria-label="UK ring size"
                className="mt-3 w-full border border-sheet-line bg-transparent px-3 py-2.5 text-[13px] text-sheet-ink outline-none transition focus:border-accent-deep"
              >
                <option value={SIZE_UNKNOWN} className="bg-sheet-panel">
                  I&rsquo;m not sure — measure me in store
                </option>
                <optgroup label="Most common" className="bg-sheet-panel">
                  {commonSizes().map((s) => (
                    <option key={s.id} value={s.id} className="bg-sheet-panel">
                      UK {s.label} — {s.diameterMm.toFixed(2)}mm
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Full range" className="bg-sheet-panel">
                  {RING_SIZES.map((s) => (
                    <option key={`all-${s.id}`} value={s.id} className="bg-sheet-panel">
                      UK {s.label} — {s.diameterMm.toFixed(2)}mm
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="mt-2 t-copy">
                We&rsquo;ll size you free of charge at Hatton Garden.
              </p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-sheet-dim">
                Engraving — optional
              </p>
              <input
                type="text"
                maxLength={30}
                value={config.engraving}
                onChange={(e) => set({ engraving: e.target.value })}
                placeholder="e.g. Forever, 12.09.26"
                aria-label="Engraving"
                className="mt-3 w-full border border-sheet-line bg-transparent px-3 py-2.5 text-[13px] text-sheet-ink outline-none transition placeholder:text-sheet-dim/60 focus:border-accent-deep"
              />
              <p className="mt-2 flex justify-between text-[12px] text-sheet-dim">
                <span>Set inside the shank, where the hallmark goes.</span>
                <span>{config.engraving.length}/30</span>
              </p>
            </div>
          </section>

          {/* ---- specification -------------------------------------------- */}
          <section className={`py-7 ${GUTTER}`}>
            <p className="text-[10px] tracking-[0.22em] uppercase text-sheet-dim">
              Your specification
            </p>

            <dl className="mt-4 flex flex-col divide-y divide-sheet-line">
              {specLines.map((line) => (
                <div key={line.label} className="flex gap-5 py-2 text-[13px]">
                  <dt className="w-28 shrink-0 tracking-[0.06em] text-sheet-dim">
                    {line.label}
                  </dt>
                  <dd className="text-sheet-ink">{line.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={buildRingSpecUrl(ringSpecText(config, shareUrl))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-accent px-8 py-3.5 font-serif text-[15px] font-semibold tracking-[0.08em] uppercase text-sheet-panel transition hover:bg-accent-deep"
              >
                Send to our workshop
              </a>
              <a
                href="/book-appointment"
                className="inline-flex items-center justify-center border border-sheet-ink/25 px-8 py-3.5 font-serif text-[15px] font-semibold tracking-[0.08em] uppercase text-sheet-ink transition hover:border-sheet-ink/50"
              >
                Book an appointment
              </a>
            </div>

            <p className="mt-4 max-w-[58ch] text-[12px] leading-relaxed text-sheet-dim">
              Every dimension above is real, but the photograph is an illustration — your
              design is agreed with you before anything is cut, and hand-set in London.
              We handle your booking privately, as a one-to-one service at our Hatton
              Garden showroom.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

/**
 * A text-only rail card, for the options that have no useful picture. Origin
 * and quality are words rather than objects — an icon for them would say
 * nothing, and four identical rings would say less than nothing.
 */
function Chip({
  label,
  sub,
  active,
  onSelect,
}: {
  label: string;
  sub?: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      data-haptic
      onClick={onSelect}
      aria-pressed={active}
      className={`flex w-[170px] shrink-0 snap-start flex-col justify-center gap-1.5 border px-4 py-3.5 text-left transition-[border-color,transform,background-color] duration-200 max-sm:w-[150px] ${
        active
          ? "border-accent-deep bg-accent/[0.10]"
          : "border-sheet-line hover:border-sheet-ink/40 active:scale-[0.98]"
      }`}
    >
      <span className="text-[10px] tracking-[0.14em] uppercase text-sheet-ink">{label}</span>
      {sub && <span className="text-[11px] leading-snug text-sheet-dim">{sub}</span>}
    </button>
  );
}
