"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import OptionTile from "./OptionTile";
import OptionRow from "./OptionRow";
import {
  CARAT_MAX,
  CARAT_MIN,
  CARAT_STEP,
  DEFAULT_CONFIG,
  magicSizeHint,
  ORIGINS,
  QUALITIES,
  SETTINGS,
  quality,
  resolveForSetting,
  resolveForShape,
  setting,
  type OriginId,
  type QualityId,
  type RingConfig,
  type SettingId,
} from "@/lib/ring/config";
import { METALS, type MetalId } from "@/lib/ring/metals";
import { SHAPES, shape, type ShapeId } from "@/lib/ring/shapes";
import { commonSizes, RING_SIZES, SIZE_UNKNOWN } from "@/lib/ring/sizes";
import { ringSpecLines, ringSpecText } from "@/lib/ring/spec";
import { settingPhoto, shapePhoto } from "@/lib/ring/photos";
import { compositePhoto } from "@/lib/ring/composites";
import { hasSpin, spinFrames } from "@/lib/ring/spins";
import { buildRingSpecUrl } from "@/lib/whatsapp";

/**
 * Both viewers land after hydration. The spin viewer preloads 36 photographs
 * and the ring viewer pulls in three.js; neither belongs in the first paint.
 */
const SpinViewer = dynamic(() => import("./SpinViewer"), { ssr: false });

const GUTTER = "mx-auto max-w-6xl px-[52px] max-md:px-6";

/**
 * What the setting photographs actually show. Every one is shot in the same
 * metal with the same centre stone so the grid reads as one family — see
 * docs/ring-builder-photography.md — which also means a photograph is only an
 * honest picture of the customer's ring while their choices match these.
 */
const PHOTOGRAPHED = {
  shape: "round" as ShapeId,
  carat: 1.0,
  metal: "platinum-950" as MetalId,
};

export default function StudioClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  /**
   * The configuration lives entirely in the URL: shareable, back-button-safe,
   * and it means the WhatsApp message can carry a link the counter opens to see
   * the exact ring. It also makes a lost WebGL context a non-event, because
   * there is no asset to reload — the config *is* the asset.
   */
  const config: RingConfig = useMemo(
    () => ({
      setting: (params.get("setting") as SettingId) ?? DEFAULT_CONFIG.setting,
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

  const active = setting(config.setting);
  const activeShape = shape(config.shape);
  const supported = new Set(active.supports);
  const specLines = ringSpecLines(config);
  const hint = magicSizeHint(config.carat);
  const activeMetal = METALS.find((m) => m.id === config.bandMetal)!;
  const activeQuality = quality(config.quality);
  const activeOrigin = ORIGINS.find((o) => o.id === config.origin)!;
  /**
   * Prefer the composite showing the customer's actual stone; fall back to the
   * plain setting photograph, which is shot with a round. Falling back is not a
   * failure state — it is the correct picture whenever the stone IS round.
   */
  const photo =
    compositePhoto(config.setting, config.shape) ?? settingPhoto(config.setting);
  const spin = spinFrames(config.setting);

  /**
   * Reading `window.location` during render is a server/client branch, and the
   * href would then differ between the two without React patching it — a silent
   * wrong-link bug rather than a visible one. Resolve after mount instead.
   */
  /** A one-line note when a choice moved the other axis to accommodate it. */
  const [adjusted, setAdjusted] = useState<string | null>(null);

  const chooseShape = (id: ShapeId) => {
    const { setting: nextSetting, changed } = resolveForShape(config.setting, id);
    setAdjusted(
      changed
        ? `A ${shape(id).label.toLowerCase()} won't sit in the ${active.label.toLowerCase()} setting, so we've moved you to ${setting(nextSetting).label}.`
        : null,
    );
    set({ shape: id, setting: nextSetting });
  };

  const chooseSetting = (id: SettingId) => {
    const { shape: nextShape, changed } = resolveForSetting(id, config.shape);
    setAdjusted(
      changed
        ? `The ${setting(id).label.toLowerCase()} can't hold a ${activeShape.label.toLowerCase()}, so the stone is now a ${shape(nextShape).label.toLowerCase()}.`
        : null,
    );
    set({ setting: id, shape: nextShape });
  };

  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const shareUrl = origin ? `${origin}${pathname}?${params.toString()}` : undefined;

  const pieceName = `${config.carat.toFixed(2)}ct ${activeShape.label} ${active.label}`;

  return (
    <div>
      {/* ---- the hero ------------------------------------------------------
          Full-bleed, and now purely photographic. The live 3D preview that used
          to sit behind a toggle here has been removed along with the rest of
          the modelling — what the customer sees is a picture of a real ring,
          spun if we have shot the sequence and still if we have not. */}
      <div className="relative h-[68vh] min-h-[460px] w-full bg-white">
        {spin.length > 0 ? (
          <SpinViewer
            frames={spin}
            label={`${active.label} setting`}
            className="h-full w-full"
          />
        ) : photo ? (
          <Image
            src={photo}
            alt={`${active.label} setting`}
            fill
            sizes="100vw"
            className="object-contain p-12 max-md:p-8"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] tracking-[0.16em] uppercase text-sheet-dim">
              {active.label}
            </span>
          </div>
        )}

        <p className="pointer-events-none absolute left-6 top-6 text-[10px] tracking-[0.18em] uppercase text-sheet-dim max-md:left-4 max-md:top-4">
          {active.label}
          {spin.length > 0 && " — drag to turn"}
        </p>
      </div>

      {/* ---- the piece, named ---------------------------------------------- */}
      <div className={`${GUTTER} flex items-baseline justify-between gap-6 py-8`}>
        <div>
          <h2 className="font-serif text-[clamp(20px,2.4vw,28px)] leading-tight">
            {pieceName}
          </h2>
          <p className="mt-1 text-[13px] text-dim">
            {activeMetal.label} · {activeOrigin.label}
          </p>
        </div>
        <p className="shrink-0 text-right text-[11px] tracking-[0.16em] uppercase text-champagne">
          Price on request
        </p>
      </div>

      {/* ---- the options ---------------------------------------------------
          Each group is a rail rather than a grid. Seventeen settings in a grid
          is a wall; in a rail it is a run you flick through, and every group
          keeps the same height so the page has a rhythm. */}
      <div className="divide-y divide-fg/[0.07] border-t border-fg/[0.10]">
        <OptionRow
          label="Setting"
          value={active.label}
          hint={
            <>
              <p className="max-w-[58ch] text-[13px] leading-relaxed text-dim">
                {active.description}
              </p>
              {adjusted && (
                <p className="mt-2 max-w-[58ch] text-[13px] leading-relaxed text-champagne">
                  {adjusted}
                </p>
              )}
            </>
          }
        >
          {SETTINGS.map((s) => (
            <OptionTile
              key={s.id}
              value={s.id}
              label={s.label}
              photo={compositePhoto(s.id, config.shape) ?? settingPhoto(s.id)}
              active={s.id === config.setting}
              title={
                s.supports.includes(config.shape)
                  ? s.description
                  : `${s.description} — takes a round rather than a ${activeShape.label.toLowerCase()}`
              }
              onSelect={() => chooseSetting(s.id)}
            />
          ))}
        </OptionRow>

        <OptionRow label="Centre stone" value={activeShape.label}>
          {SHAPES.map((s) => (
            <OptionTile
              key={s.id}
              value={s.id}
              label={s.label}
              photo={shapePhoto(s.id)}
              active={s.id === config.shape}
              title={
                supported.has(s.id)
                  ? s.label
                  : `A ${s.label.toLowerCase()} needs a setting built for it — we'll move you to one`
              }
              onSelect={() => chooseShape(s.id)}
            />
          ))}
        </OptionRow>

        {/* Carat is a continuum, so it stays a slider rather than being forced
            into the rail pattern for the sake of consistency. */}
        <section className="py-10 max-md:py-8">
          <div className={GUTTER}>
            <div className="flex items-baseline justify-between gap-6">
              <p className="text-[10px] tracking-[0.22em] uppercase text-dim">
                Carat weight
              </p>
              <p className="font-serif text-[20px] text-blush">
                {config.carat.toFixed(2)}ct
              </p>
            </div>
            <input
              type="range"
              min={CARAT_MIN}
              max={CARAT_MAX}
              step={CARAT_STEP}
              value={config.carat}
              onChange={(e) => set({ ct: e.target.value })}
              aria-label="Carat weight"
              className="mt-5 w-full accent-[var(--color-accent)]"
            />
            <p className="mt-3 max-w-[58ch] text-[13px] leading-relaxed text-dim">
              A guide only — slide roughly to where you&rsquo;d like to be and we&rsquo;ll
              show you comparable stones either side of it.
            </p>
            {hint && (
              <p className="mt-2 max-w-[58ch] text-[13px] leading-relaxed text-champagne">
                Worth knowing — a {hint.toFixed(2)}ct stone looks all but identical to a{" "}
                {(hint + 0.1).toFixed(2)}ct and usually costs around 10% less.
              </p>
            )}
          </div>
        </section>

        <OptionRow
          label="Origin"
          value={activeOrigin.label}
          hint={
            <p className="max-w-[58ch] text-[13px] leading-relaxed text-dim">
              {activeOrigin.note}{" "}
              <a
                href="/guides/natural-vs-lab-grown-diamonds"
                className="text-accent underline underline-offset-4"
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
              <p className="max-w-[58ch] text-[13px] leading-relaxed text-dim">
                {activeQuality.note}
              </p>
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

        <OptionRow
          label="Precious metal"
          value={activeMetal.label}
          hint={
            activeMetal.note ? (
              <p className="max-w-[58ch] text-[13px] leading-relaxed text-dim">
                {activeMetal.note}
              </p>
            ) : undefined
          }
        >
          {METALS.map((m) => (
            <button
              key={m.id}
              type="button"
              data-haptic
              onClick={() => setMetal(m.id)}
              aria-pressed={m.id === config.bandMetal}
              title={m.label}
              className={`flex w-[104px] shrink-0 snap-start flex-col items-center gap-3 border px-2 py-4 transition-[border-color,transform,background-color] duration-200 ${
                m.id === config.bandMetal
                  ? "border-accent bg-accent/[0.07]"
                  : "border-fg/[0.12] hover:border-fg/45 active:scale-[0.97]"
              }`}
            >
              <span
                className="block h-10 w-10 rounded-full border border-fg/15"
                style={{ background: m.hex }}
              />
              <span className="text-center text-[9px] leading-tight tracking-[0.1em] uppercase text-fg/70">
                {m.label}
              </span>
            </button>
          ))}
        </OptionRow>

        {/* ---- finishing ---------------------------------------------------- */}
        <section className="py-12 max-md:py-8">
          <div
            className={`${GUTTER} grid grid-cols-2 gap-10 max-md:grid-cols-1 max-md:gap-8`}
          >
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-dim">
                UK ring size
              </p>
              <select
                value={config.size}
                onChange={(e) => set({ size: e.target.value })}
                aria-label="UK ring size"
                className="mt-4 w-full border border-fg/20 bg-transparent px-4 py-3 text-[14px] text-fg outline-none transition focus:border-accent"
              >
                <option value={SIZE_UNKNOWN} className="bg-bg">
                  I&rsquo;m not sure — measure me in store
                </option>
                <optgroup label="Most common" className="bg-bg">
                  {commonSizes().map((s) => (
                    <option key={s.id} value={s.id} className="bg-bg">
                      UK {s.label} — {s.diameterMm.toFixed(2)}mm
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Full range" className="bg-bg">
                  {RING_SIZES.map((s) => (
                    <option key={`all-${s.id}`} value={s.id} className="bg-bg">
                      UK {s.label} — {s.diameterMm.toFixed(2)}mm
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="mt-3 text-[13px] leading-relaxed text-dim">
                No problem at all — we&rsquo;ll size you free of charge at Hatton Garden,
                or post you a free ring sizer if it&rsquo;s a surprise.
              </p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-dim">
                Engraving — optional
              </p>
              <input
                type="text"
                maxLength={30}
                value={config.engraving}
                onChange={(e) => set({ engraving: e.target.value })}
                placeholder="e.g. Forever, 12.09.26"
                aria-label="Engraving"
                className="mt-4 w-full border border-fg/20 bg-transparent px-4 py-3 text-[14px] text-fg outline-none transition placeholder:text-dim/60 focus:border-accent"
              />
              <p className="mt-3 flex justify-between text-[13px] text-dim">
                <span>Set inside the shank, where the hallmark goes.</span>
                <span>{config.engraving.length}/30</span>
              </p>
            </div>
          </div>
        </section>

        {/* ---- specification ------------------------------------------------ */}
        <section className="py-12 max-md:py-10">
          <div className={GUTTER}>
            <p className="text-[10px] tracking-[0.22em] uppercase text-dim">
              Your specification
            </p>

            <dl className="mt-6 flex max-w-2xl flex-col divide-y divide-fg/[0.07]">
              {specLines.map((line) => (
                <div key={line.label} className="flex gap-6 py-2.5 text-[13px]">
                  <dt className="w-24 shrink-0 tracking-[0.06em] text-dim">
                    {line.label}
                  </dt>
                  <dd className="text-fg/90">{line.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={buildRingSpecUrl(ringSpecText(config, shareUrl))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-accent px-10 py-4 font-serif text-[16px] font-semibold tracking-[0.08em] uppercase text-bg transition hover:bg-accent-deep"
              >
                Send to our workshop
              </a>
              <a
                href="/book-appointment"
                className="inline-flex items-center justify-center gap-3 border border-fg/25 px-10 py-4 font-serif text-[16px] font-semibold tracking-[0.08em] uppercase text-fg transition hover:border-fg/50"
              >
                Book an appointment
              </a>
            </div>

            <p className="mt-5 max-w-[60ch] text-[12px] leading-relaxed text-dim">
              Consultations at our Hatton Garden showroom. Every dimension above is real,
              but the preview is an illustration — your ring is agreed with the bench
              before anything is cut, hand-set in London, and hallmarked at the London
              Assay Office.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * A text-only rail card, for the options that have no useful picture. Origin
 * and quality are words rather than objects — rendering a ring for them would
 * say nothing, and four identical rings would say less than nothing.
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
      className={`flex w-[190px] shrink-0 snap-start flex-col justify-center gap-2 border px-5 py-5 text-left transition-[border-color,transform,background-color] duration-200 max-sm:w-[160px] ${
        active
          ? "border-accent bg-accent/[0.07]"
          : "border-fg/[0.12] hover:border-fg/45 active:scale-[0.98]"
      }`}
    >
      <span className="text-[11px] tracking-[0.14em] uppercase text-fg/90">{label}</span>
      {sub && <span className="text-[11px] leading-snug text-dim">{sub}</span>}
    </button>
  );
}
