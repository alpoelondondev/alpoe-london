"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* "ALPOE LONDON" wordmark — Bebas Neue outlines, matches alpoe-london-logo-transparent.svg */
const LOGO_PATHS = [
  "M60.12 107.80L66.28 70L74.32 70L80.48 107.80L74.54 107.80L73.46 100.29L73.46 100.40L66.71 100.40L65.63 107.80L60.12 107.80M67.41 95.27L72.76 95.27L70.11 76.59L70 76.59L67.41 95.27M84.42 107.80L84.42 70L90.36 70L90.36 102.40L100.13 102.40L100.13 107.80L84.42 107.80M104.08 107.80L104.08 70L112.82 70Q117.25 70 119.47 72.38Q121.68 74.75 121.68 79.34L121.68 83.07Q121.68 87.66 119.47 90.03Q117.25 92.41 112.82 92.41L110.02 92.41L110.02 107.80L104.08 107.80M110.02 87.01L112.82 87.01Q114.28 87.01 115.01 86.20Q115.74 85.39 115.74 83.45L115.74 78.96Q115.74 77.02 115.01 76.21Q114.28 75.40 112.82 75.40L110.02 75.40L110.02 87.01M134.59 108.34Q130.21 108.34 127.89 105.86Q125.57 103.37 125.57 98.84L125.57 78.96Q125.57 74.43 127.89 71.94Q130.21 69.46 134.59 69.46Q138.96 69.46 141.28 71.94Q143.60 74.43 143.60 78.96L143.60 98.84Q143.60 103.37 141.28 105.86Q138.96 108.34 134.59 108.34M134.59 102.94Q137.66 102.94 137.66 99.21L137.66 78.59Q137.66 74.86 134.59 74.86Q131.51 74.86 131.51 78.59L131.51 99.21Q131.51 102.94 134.59 102.94M148.68 107.80L148.68 70L164.88 70L164.88 75.40L154.62 75.40L154.62 85.39L162.77 85.39L162.77 90.79L154.62 90.79L154.62 102.40L164.88 102.40L164.88 107.80",
  "M61.02 133L61.02 117.60L63.44 117.60L63.44 130.80L67.42 130.80L67.42 133L61.02 133M82.39 133.22Q80.61 133.22 79.66 132.21Q78.72 131.20 78.72 129.35L78.72 121.25Q78.72 119.40 79.66 118.39Q80.61 117.38 82.39 117.38Q84.17 117.38 85.12 118.39Q86.07 119.40 86.07 121.25L86.07 129.35Q86.07 131.20 85.12 132.21Q84.17 133.22 82.39 133.22M82.39 131.02Q83.65 131.02 83.65 129.50L83.65 121.10Q83.65 119.58 82.39 119.58Q81.14 119.58 81.14 121.10L81.14 129.50Q81.14 131.02 82.39 131.02M98.09 133L98.09 117.60L101.12 117.60L103.48 126.82L103.52 126.82L103.52 117.60L105.68 117.60L105.68 133L103.19 133L100.29 121.76L100.24 121.76L100.24 133L98.09 133M117.87 133L117.87 117.60L121.57 117.60Q123.37 117.60 124.27 118.57Q125.18 119.54 125.18 121.41L125.18 129.19Q125.18 131.06 124.27 132.03Q123.37 133 121.57 133L117.87 133M120.29 130.80L121.52 130.80Q122.12 130.80 122.44 130.45Q122.76 130.10 122.76 129.30L122.76 121.30Q122.76 120.50 122.44 120.15Q122.12 119.80 121.52 119.80L120.29 119.80L120.29 130.80M140.69 133.22Q138.91 133.22 137.97 132.21Q137.02 131.20 137.02 129.35L137.02 121.25Q137.02 119.40 137.97 118.39Q138.91 117.38 140.69 117.38Q142.48 117.38 143.42 118.39Q144.37 119.40 144.37 121.25L144.37 129.35Q144.37 131.20 143.42 132.21Q142.48 133.22 140.69 133.22M140.69 131.02Q141.95 131.02 141.95 129.50L141.95 121.10Q141.95 119.58 140.69 119.58Q139.44 119.58 139.44 121.10L139.44 129.50Q139.44 131.02 140.69 131.02M156.39 133L156.39 117.60L159.42 117.60L161.78 126.82L161.82 126.82L161.82 117.60L163.98 117.60L163.98 133L161.49 133L158.59 121.76L158.54 121.76L158.54 133",
];

const SHUFFLE_PHRASES = ["Luxury Timepieces", "Jewelry", "Bullions", "VIP Service"];
const SHUFFLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function ShuffleText() {
  const [text, setText] = useState(SHUFFLE_PHRASES[0]);
  useEffect(() => {
    let phraseIndex = 0;
    let raf = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const scrambleTo = (target: string, done: () => void) => {
      const start = performance.now();
      const duration = 600;
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const revealed = Math.floor(p * target.length);
        let out = target.slice(0, revealed);
        for (let i = revealed; i < target.length; i++) {
          out += target[i] === " " ? " " : SHUFFLE_CHARS[Math.floor(Math.random() * SHUFFLE_CHARS.length)];
        }
        setText(out);
        if (p < 1) raf = requestAnimationFrame(tick);
        else done();
      };
      raf = requestAnimationFrame(tick);
    };

    const cycle = () => {
      phraseIndex = (phraseIndex + 1) % SHUFFLE_PHRASES.length;
      scrambleTo(SHUFFLE_PHRASES[phraseIndex], () => {
        timeout = setTimeout(cycle, 1600);
      });
    };
    timeout = setTimeout(cycle, 1600);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, []);
  return <span className="tabular-nums">{text}</span>;
}

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<SVGGElement>(null);
  const starsRef = useRef<HTMLCanvasElement>(null);
  const revealed = useRef(false);
  const rafRef = useRef<number | null>(null);

  const updateProgress = (value: number) => {
    const rounded = Math.floor(value);
    setProgress(rounded);
    if (waveRef.current) {
      // Wave surface (local y=10) should travel from y=150 (below logo) at 0%
      // to y=60 (just above logo top at y=70) at 100%, so they finish together.
      const translateY = 140 - (rounded / 100) * 90;
      waveRef.current.style.transform = `translateY(${translateY}px)`;
    }
  };

  const dismiss = () => {
    if (revealed.current) return;
    revealed.current = true;

    // 1. Synchronously start the hero video INSIDE the click stack so iOS
    //    Safari accepts the user gesture.
    const video = document.querySelector(
      "video[data-hero]"
    ) as HTMLVideoElement | null;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }

    // 2. Stop the starfield RAF immediately so the slide-up has zero
    //    competition for the main thread.
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // 3. Restore scroll, fire page-loaded for Hero text reveal, slide loader.
    document.body.style.overflow = "";
    window.dispatchEvent(new Event("page-loaded"));

    if (loaderRef.current) {
      gsap.to(loaderRef.current, {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
      });
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Animation cue: fill the wave 0 → 100 over ~500ms then enable the button.
    const tween = gsap.to(
      { value: 0 },
      {
        value: 100,
        duration: 1.4,
        ease: "none",
        onUpdate: function () {
          updateProgress((this.targets()[0] as { value: number }).value);
        },
        onComplete: () => setReady(true),
      }
    );

    // ---- Starfield ----
    const canvas = starsRef.current;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Star = {
      x: number;
      y: number;
      r: number;
      speed: number;
      phase: number;
      sparkleAt: number;
      sparkleStart: number;
    };
    const stars: Star[] = [];
    let cssW = 0;
    let cssH = 0;

    const setupCanvas = () => {
      if (!canvas) return null;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = canvas.clientWidth;
      cssH = canvas.clientHeight;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return ctx;
    };

    const seedStars = () => {
      stars.length = 0;
      const count = 90;
      const now = performance.now() / 1000;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * cssW,
          y: Math.random() * cssH,
          r: 0.3 + Math.random() * 1.1,
          speed: 0.6 + Math.random() * 1.2,
          phase: Math.random() * Math.PI * 2,
          sparkleAt: now + 1 + Math.random() * 5,
          sparkleStart: -1,
        });
      }
    };

    let ctx: CanvasRenderingContext2D | null = null;
    if (canvas) {
      ctx = setupCanvas();
      seedStars();
    }

    const draw = (tMs: number) => {
      if (!ctx || !canvas) return;
      const t = tMs / 1000;
      ctx.clearRect(0, 0, cssW, cssH);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const tw = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
        const alpha = 0.25 + 0.55 * tw;
        ctx.fillStyle = `rgba(240,236,228,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle pop
        if (s.sparkleStart < 0 && t >= s.sparkleAt) {
          s.sparkleStart = t;
        }
        if (s.sparkleStart >= 0) {
          const age = t - s.sparkleStart;
          const dur = 0.35;
          if (age >= dur) {
            s.sparkleStart = -1;
            s.sparkleAt = t + 2 + Math.random() * 5;
          } else {
            const k = 1 - age / dur;
            const len = s.r * 8 * k;
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            ctx.strokeStyle = `rgba(240,236,228,${0.9 * k})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(s.x - len, s.y);
            ctx.lineTo(s.x + len, s.y);
            ctx.moveTo(s.x, s.y - len);
            ctx.lineTo(s.x, s.y + len);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    if (ctx && !reduceMotion) {
      rafRef.current = requestAnimationFrame(draw);
    } else if (ctx) {
      // Static render for reduced motion
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        ctx.fillStyle = `rgba(240,236,228,0.6)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const onResize = () => {
      ctx = setupCanvas();
      seedStars();
    };
    window.addEventListener("resize", onResize);

    return () => {
      tween.kill();
      window.removeEventListener("resize", onResize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return (
    <div id="loader" ref={loaderRef}>
      <canvas
        ref={starsRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <div
        onClick={ready ? dismiss : undefined}
        className={`relative w-[225px] h-[225px] max-md:w-[160px] max-md:h-[160px] ${ready ? "cursor-pointer cursor-big" : ""}`}
      >
        <svg
          viewBox="0 0 225 225"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Clip path from the logo shape */}
            <clipPath id="logo-clip">
              {LOGO_PATHS.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </clipPath>
          </defs>

          {/* Ghost outline of the logo */}
          <g opacity="0.15">
            {LOGO_PATHS.map((d, i) => (
              <path key={i} d={d} fill="#f0ece4" />
            ))}
          </g>

          {/* Liquid fill clipped to logo shape */}
          <g clipPath="url(#logo-clip)">
            <g ref={waveRef} style={{ transform: "translateY(80px)" }}>
              {/* Wave surface */}
              <path
                className="animate-wave"
                d="M0 10 Q30 0 60 10 T120 10 T180 10 T240 10 V100 H0 Z"
                fill="#f0ece4"
              />
              <path
                className="animate-wave-reverse"
                d="M0 12 Q30 20 60 12 T120 12 T180 12 T240 12 V100 H0 Z"
                fill="rgba(184,160,112,0.5)"
              />
              {/* Solid fill below the waves */}
              <rect x="0" y="14" width="240" height="200" fill="#f0ece4" />
            </g>
          </g>
        </svg>
      </div>

      {ready && (
        <button
          onClick={dismiss}
          className="-mt-6 text-[11px] tracking-[0.2em] uppercase text-[#f0ece4] border-b border-[#f0ece4] pb-[3px] cursor-pointer animate-pulse-enter"
        >
          Click to Enter
        </button>
      )}

      <div className="text-[11px] tracking-[0.2em] uppercase text-dim mt-6">
        {progress}%
      </div>
      <div className="text-[11px] tracking-[0.2em] uppercase text-dim mt-2">
        <ShuffleText />
      </div>
      <div className="text-[11px] tracking-[0.2em] uppercase text-dim mt-1">
        Hatton Garden · London · Worldwide
      </div>
    </div>
  );
}
