"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const PROFILE_URL = "https://www.instagram.com/alpoelondon/";

const films: { title: string; image: string; video: string }[] = [
  {
    title: "In the Showroom",
    image: "/alpoe-bespoke-jewellery-service-hatton-garden.jpg",
    video: "/alpoe-bespoke-jewellery-service-hatton-garden.mp4",
  },
  {
    title: "Fitted by Hand",
    image: "/alpoe-cuban-chains-hatton-garden.jpg",
    video: "/alpoe-cuban-chains-hatton-garden.mp4",
  },
];

export default function Social() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [playing, setPlaying] = useState<Record<number, boolean>>({});
  // Muted by default; the viewer opts into sound per film.
  const [muted, setMuted] = useState<Record<number, boolean>>({});

  const isMuted = (i: number) => muted[i] ?? true;

  const toggleMute = (i: number) => {
    const video = videoRefs.current[i];
    const next = !isMuted(i);
    if (video) video.muted = next;
    setMuted((m) => ({ ...m, [i]: next }));
  };

  // Prerender/lazyload: buffer the films in the background once the splash
  // has dismissed, so tapping a thumbnail plays instantly.
  useEffect(() => {
    const preload = () => {
      videoRefs.current.forEach((video, i) => {
        if (!video || video.readyState >= 2) return;
        setTimeout(() => {
          if (video.preload === "none") {
            video.preload = "auto";
            video.load();
          }
        }, i * 800);
      });
    };
    window.addEventListener("page-loaded", preload, { once: true });
    const fallback = setTimeout(preload, 3000);
    return () => {
      window.removeEventListener("page-loaded", preload);
      clearTimeout(fallback);
    };
  }, []);

  const togglePlay = (i: number) => {
    const video = videoRefs.current[i];
    if (!video) return;
    if (video.paused) {
      video.muted = isMuted(i);
      if (video.preload === "none") {
        video.preload = "auto";
        video.load();
      }
      video.play().catch(() => {});
      setPlaying((p) => ({ ...p, [i]: true }));
    } else {
      video.pause();
      setPlaying((p) => ({ ...p, [i]: false }));
    }
  };

  return (
    <section
      id="social"
      className="px-[52px] py-24 border-t border-black/[0.07] max-md:px-6 max-md:py-16"
    >
      <ScrollReveal>
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-6">
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="group flex flex-col items-center gap-3"
          >
            <svg
              className="w-12 h-12 text-black/50 transition hover:scale-110 hover:text-black/80 max-md:w-10 max-md:h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span className="text-black/50 text-xs tracking-wide transition group-hover:text-black/80">
              @alpoelondon
            </span>
          </a>
          <a
            href="https://www.tiktok.com/@alpoelondon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="group flex flex-col items-center gap-3"
          >
            <svg
              className="w-12 h-12 text-black/50 transition hover:scale-110 hover:text-black/80 max-md:w-10 max-md:h-10"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
            </svg>
            <span className="text-black/50 text-xs tracking-wide transition group-hover:text-black/80">
              @alpoelondon
            </span>
          </a>
        </div>

        {/* Films from the feed — videos preloaded in the background */}
        <div className="max-w-3xl mx-auto mt-16 grid grid-cols-2 gap-4 max-md:mt-10 max-md:grid-cols-1">
          {films.map((film, i) => (
            <div
              key={film.video}
              role="button"
              tabIndex={0}
              onClick={() => togglePlay(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") togglePlay(i);
              }}
              aria-label={`${playing[i] ? "Pause" : "Play"} ${film.title} film`}
              className="group relative block aspect-[3/4] overflow-hidden border border-black/[0.08] cursor-pointer"
            >
              <Image
                src={film.image}
                alt={`${film.title} — Alpoe London`}
                fill
                sizes="(max-width: 768px) 85vw, 33vw"
                className="object-cover"
              />
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                muted
                loop
                playsInline
                preload="none"
                poster={film.image}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  playing[i] ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <source src={film.video} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,6,8,0.85)] via-[rgba(6,6,8,0.15)] to-transparent pointer-events-none" />
              <span className="absolute top-[18px] left-5 text-[11px] tracking-[0.12em] uppercase text-[rgba(240,236,228,0.75)]">
                @alpoelondon
              </span>
              <span className="absolute top-[16px] right-5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute(i);
                  }}
                  aria-label={isMuted(i) ? "Unmute film" : "Mute film"}
                  className="text-[#f0ece4] border border-white/40 rounded-full p-1.5 backdrop-blur-sm bg-black/10 cursor-pointer hover:bg-black/25 transition-colors"
                >
                  {isMuted(i) ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  )}
                </button>
                <span className="text-[10px] tracking-[0.16em] uppercase text-[#f0ece4] border border-white/40 rounded-full px-3 py-1.5 backdrop-blur-sm bg-black/10">
                  {playing[i] ? "Pause" : "▶ Play"}
                </span>
              </span>
              <div className="absolute bottom-5 left-5 right-5">
                <h3 className="font-serif text-[clamp(22px,2.2vw,32px)] tracking-[0.02em] leading-none mb-2 text-[#f0ece4]">
                  {film.title}
                </h3>
                <a
                  href={PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase text-[#cbb98f] opacity-90 hover:opacity-100"
                >
                  View Instagram →
                </a>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
