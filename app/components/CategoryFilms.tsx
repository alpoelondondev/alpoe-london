"use client";

import Image from "next/image";
import { type Film, filmImage, filmVideo } from "@/lib/films";
import { buildFilmEnquiryUrl } from "@/lib/whatsapp";
import { useViewportVideos } from "./useViewportVideos";
import { TILE_GRID_CLASS } from "./ProductTile";

/**
 * The film listing that replaces the product grid wherever we have footage.
 *
 * Each tile is the piece itself, playing, and the whole tile is the enquiry —
 * there is no detail page in between, so the WhatsApp message has to name the
 * piece and its spec (see buildFilmEnquiryUrl).
 */
export default function CategoryFilms({ films }: { films: Film[] }) {
  const { registerVideo } = useViewportVideos();

  if (!films.length) return null;

  return (
    <ul className={TILE_GRID_CLASS}>
      {films.map((film, i) => (
        <li key={film.slug} className="contents">
          <a
            href={buildFilmEnquiryUrl(film)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Enquire about the ${film.title} on WhatsApp`}
            className="group flex flex-col overflow-hidden border border-fg/[0.10] bg-fg/[0.04] transition hover:border-fg/25"
          >
            {/* Portrait, because the footage is — a landscape frame would crop
                the length off a necklace or a tennis bracelet. */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-fg/[0.04]">
              <Image
                src={filmImage(film)}
                alt={`${film.title} — ${film.spec}`}
                fill
                draggable={false}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={registerVideo(i)}
                data-decorative
                muted
                loop
                playsInline
                controls={false}
                disablePictureInPicture
                controlsList="nodownload noplaybackrate noremoteplayback"
                // Raised to "auto" by useViewportVideos once the page settles.
                preload="none"
                poster={filmImage(film)}
                onVolumeChange={(e) => {
                  const video = e.currentTarget;
                  if (!video.muted) video.muted = true;
                }}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-[1.04]"
              >
                <source src={filmVideo(film)} type="video/mp4" />
              </video>
            </div>

            <div className="flex flex-1 flex-col gap-1 p-3">
              <h3 className="font-serif text-[15px] leading-tight tracking-[0.01em]">
                {film.title}
              </h3>
              <p className="text-[11px] leading-snug font-light text-fg/60">{film.spec}</p>
              <span className="mt-auto pt-3 block w-full bg-accent px-3 py-2 text-center text-[10px] font-medium tracking-[0.16em] uppercase text-bg transition group-hover:brightness-110">
                Enquire Now
              </span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
