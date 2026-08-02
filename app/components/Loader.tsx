"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { LOGO_PATHS } from "./logoPaths";

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
  const enterRef = useRef<HTMLDivElement>(null);
  const revealed = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Magnetic pull: the enter pill leans toward the cursor within range.
  useEffect(() => {
    if (!ready) return;
    const el = enterRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      const range = 160;
      if (dist < range) {
        const pull = (1 - dist / range) * 0.35;
        gsap.to(el, { x: dx * pull, y: dy * pull, duration: 0.4, ease: "power3.out" });
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [ready]);

  const updateProgress = (value: number) => {
    const rounded = Math.floor(value);
    setProgress(rounded);
    if (waveRef.current) {
      // Wave surface (local y=10) should travel from y=172 (below the mark's
      // bottom at y=162) at 0% to y=37 (above its top at y=47) at 100%.
      const translateY = 162 - (rounded / 100) * 135;
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
    //    The flag lets a Hero that mounts later (client-side nav back to the
    //    homepage) know the splash is already gone, since the event has fired.
    document.body.style.overflow = "";
    window.__alpoeEntered = true;
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
        ctx.fillStyle = `rgba(61,1,0,${alpha})`;
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
            ctx.strokeStyle = `rgba(61,1,0,${0.9 * k})`;
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
        ctx.fillStyle = `rgba(61,1,0,0.6)`;
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
    <div
      id="loader"
      ref={loaderRef}
      onClick={ready ? dismiss : undefined}
      className={ready ? "cursor-pointer" : undefined}
    >
      <canvas
        ref={starsRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <div className="relative w-[225px] h-[225px] max-md:w-[160px] max-md:h-[160px]">
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
              <path key={i} d={d} fill="#171212" />
            ))}
          </g>

          {/* Liquid fill clipped to logo shape */}
          <g clipPath="url(#logo-clip)">
            <g ref={waveRef} style={{ transform: "translateY(162px)" }}>
              {/* Wave surface */}
              <path
                className="animate-wave"
                d="M0 10 Q30 0 60 10 T120 10 T180 10 T240 10 V100 H0 Z"
                fill="#3d0100"
              />
              <path
                className="animate-wave-reverse"
                d="M0 12 Q30 20 60 12 T120 12 T180 12 T240 12 V100 H0 Z"
                fill="rgba(61,1,0,0.45)"
              />
              {/* Solid fill below the waves */}
              <rect x="0" y="14" width="240" height="200" fill="#3d0100" />
            </g>
          </g>
        </svg>
      </div>

      {ready && (
        <div ref={enterRef} className="-mt-2">
          <button
            onClick={dismiss}
            aria-label="Enter Alpoe London"
            className="rounded-full border border-accent px-10 py-3.5 text-[11px] tracking-[0.24em] uppercase text-accent cursor-pointer cursor-big animate-pulse-enter hover:animate-none hover:bg-accent hover:text-bg transition-colors duration-300"
          >
            Enter Alpoe London
          </button>
        </div>
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
