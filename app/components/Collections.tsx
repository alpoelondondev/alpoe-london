"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "./ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

const items: {
  title: string;
  tag: string;
  href: string;
  image?: string;
  video?: string;
  poster?: string;
  objectPosition?: string;
  num: string;
  colSpan: string;
}[] = [
  {
    title: "Bespoke Ice Pendants",
    tag: "Pendants",
    href: "/jewellery/necklaces-pendants",
    video: "/alpoe-ice-pendant.mp4",
    poster: "/poster-ice-pendant.jpg",
    num: "01",
    colSpan: "col-span-7 max-md:col-span-12",
  },
  {
    title: "Cuban Chains",
    tag: "Chains",
    href: "/jewellery/mens-jewellery",
    video: "/chains-video.mp4",
    num: "02",
    colSpan: "col-span-5 max-md:col-span-12",
  },
  {
    title: "Statement Rings",
    tag: "Rings",
    href: "/jewellery/rings",
    video: "/alpoe-rings-vid.mp4",
    poster: "/poster-rings.jpg",
    num: "03",
    colSpan: "col-span-5 max-md:col-span-12",
  },
  {
    title: "Luxury Watches",
    tag: "Watches",
    href: "/watches",
    video: "/alpoe-luxury-watch-vid.mp4",
    poster: "/poster-luxury-watch.jpg",
    num: "04",
    colSpan: "col-span-7 max-md:col-span-12",
  },
];

export default function Collections() {
  const thumbRefs = useRef<(HTMLImageElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.scrollWidth / items.length;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, items.length - 1));
  }, []);

  const scrollByCard = (dir: 1 | -1) => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / items.length;
    el.scrollBy({ left: cardWidth * dir, behavior: "smooth" });
  };

  useEffect(() => {
    thumbRefs.current.forEach((img) => {
      if (!img) return;
      gsap.fromTo(
        img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    });

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const observers: IntersectionObserver[] = [];

    // Background-preload all card videos after the page is interactive
    // so they're already buffered when the user swipes
    const preloadAllVideos = () => {
      videoRefs.current.forEach((video, i) => {
        if (!video || video.readyState >= 2) return;
        // Stagger loading to avoid bandwidth contention
        setTimeout(() => {
          if (video.preload === "none") {
            video.preload = "auto";
            video.load();
          }
        }, i * 800);
      });
    };

    // Start preloading once the page loader dismisses
    window.addEventListener("page-loaded", preloadAllVideos, { once: true });
    // Fallback: if page-loaded already fired, start after a short delay
    const preloadFallback = setTimeout(preloadAllVideos, 3000);

    const playVideo = (video: HTMLVideoElement) => {
      const tryPlay = () => video.play().catch(() => {});

      if (video.readyState >= 2) {
        tryPlay();
      } else {
        // If not yet loaded, force load then play
        if (video.preload === "none") {
          video.preload = "auto";
          video.load();
        }
        video.addEventListener("canplay", tryPlay, { once: true });
      }
    };

    const pauseVideo = (video: HTMLVideoElement) => {
      video.pause();
      video.currentTime = 0;
    };

    videoRefs.current.forEach((video) => {
      if (!video) return;

      if (isMobile) {
        // On mobile: play when card is >50% visible, pause all others
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              videoRefs.current.forEach((v) => {
                if (v && v !== video) pauseVideo(v);
              });
              playVideo(video);
            } else {
              pauseVideo(video);
            }
          },
          { threshold: 0.5 }
        );
        observer.observe(video);
        observers.push(observer);
      } else {
        // On desktop: viewport-based play/pause
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              playVideo(video);
            } else {
              pauseVideo(video);
            }
          },
          { threshold: 0.3 }
        );
        observer.observe(video);
        observers.push(observer);
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      observers.forEach((o) => o.disconnect());
      clearTimeout(preloadFallback);
      window.removeEventListener("page-loaded", preloadAllVideos);
    };
  }, []);

  return (
    <section
      id="collections"
      className="px-[52px] pt-14 pb-14 max-md:px-6 max-md:pt-10 max-md:pb-10"
    >
      <ScrollReveal>
        <p className="section-label text-[11px] tracking-[0.2em] uppercase text-accent mb-[72px] flex items-center gap-[18px]">
          Collections
        </p>
      </ScrollReveal>
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="grid grid-cols-12 gap-5 max-md:flex max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:gap-4 max-md:-mx-6 max-md:px-6 max-md:scrollbar-none"
      >
        {items.map((item, i) => (
          <ScrollReveal
            key={item.num}
            className={`${item.colSpan} max-md:!col-auto max-md:flex-none max-md:w-[85vw] max-md:snap-center`}
            delay={i * 0.1}
          >
            <Link
              href={item.href}
              className="work-item relative overflow-hidden group cursor-pointer block"
              aria-label={`Explore ${item.title}`}
            >
            {item.video ? (
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                muted
                loop
                playsInline
                preload="none"
                poster={item.poster}
                className="work-thumb w-full aspect-[4/3] object-cover block"
              >
                <source src={item.video} type="video/mp4" />
              </video>
            ) : (
              <Image
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                className="work-thumb w-full aspect-[4/3] object-cover block"
                style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
                src={item.image!}
                alt={item.title}
                width={900}
                height={675}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,6,8,0.85)] to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-40" />
            <span className="absolute top-[18px] right-[18px] text-[11px] tracking-[0.1em] text-dim">
              {item.num}
            </span>
            <div className="absolute bottom-[22px] left-6 right-6">
              <h3 className="font-serif text-[clamp(24px,3vw,42px)] tracking-[0.02em] leading-none mb-1.5">
                {item.title}
              </h3>
              <p className="text-[11px] tracking-[0.12em] uppercase text-dim">
                {item.tag}
              </p>
            </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>

      {/* Mobile scroll arrows + indicator */}
      <div className="hidden max-md:flex justify-center items-center gap-6 mt-6">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollByCard(-1)}
          disabled={activeIndex === 0}
          className="text-[20px] text-dim disabled:opacity-30 px-2 cursor-pointer"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          {items.map((item, i) => (
            <span
              key={item.num}
              className={`block h-[2px] rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 bg-accent" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollByCard(1)}
          disabled={activeIndex === items.length - 1}
          className="text-[20px] text-dim disabled:opacity-30 px-2 cursor-pointer"
        >
          →
        </button>
      </div>
    </section>
  );
}
