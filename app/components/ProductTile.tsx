"use client";

/*
 * Client not for interactivity — it has none — but because a
 * server-rendered tile is serialised twice — HTML, then again inside the RSC
 * payload — and ninety-odd of them on a brand hub is a couple of hundred
 * kilobytes of repeated Tailwind. As a client component the payload carries
 * the props (a URL, a title, a line of meta) and the HTML is unchanged.
 * The `badge` node is rendered on the server and arrives as a prop.
 */
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

// The single card used by every listing grid — brand pages, jewellery and search.
// Photo on top, type below, CTA pinned to the bottom so tiles in a row line up
// even when titles wrap to different heights. A piece we have no photograph of
// yet keeps the same frame with a quiet note in it, so the grid stays one grid.
//
// The homepage carousel deliberately keeps its own overlay treatment (see
// ProductCard) — it sits on a dark editorial band rather than in a grid.
export default function ProductTile({
  href,
  external,
  image,
  alt,
  title,
  meta,
  cta,
  badge,
  priority,
  ariaLabel,
}: {
  href: string;
  /** WhatsApp and other off-site targets open in a new tab. */
  external?: boolean;
  image?: string;
  alt: string;
  title: string;
  meta?: string;
  cta: string;
  badge?: ReactNode;
  priority?: boolean;
  ariaLabel?: string;
}) {
  const className =
    "group flex flex-col relative overflow-hidden border border-fg/[0.10] bg-fg/[0.04] transition hover:border-fg/25";

  const inner = (
    <>
      <div className="w-full relative aspect-[4/5] bg-fg/[0.04]">
        {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          draggable={false}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          // Pack shots are transparent cut-outs of differing heights (Rolex 800x1190,
          // Patek 800x1121). object-cover would crop the bracelet off the taller
          // ones; contain sits the whole watch on the tile's own background. The
          // padding is what keeps brands looking alike: Rolex's renders carry
          // their own margin, Richard Mille's run to the very edge of the file.
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
          priority={priority}
        />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-[10px] tracking-[0.18em] uppercase text-dim">
            Photography on request
          </div>
        )}
        {badge ? <div className="absolute top-3 left-3">{badge}</div> : null}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="t-card">{title}</h3>
        {meta ? (
          <p className="text-[10px] tracking-[0.14em] uppercase text-dim">{meta}</p>
        ) : null}
        <span className="mt-auto pt-3 block w-full bg-accent px-3 py-2 text-center text-[10px] font-medium tracking-[0.16em] uppercase text-bg transition group-hover:brightness-110">
          {cta}
        </span>
      </div>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        className={className}
        aria-label={ariaLabel}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} draggable={false} className={className} aria-label={ariaLabel}>
      {inner}
    </Link>
  );
}

// Shared by every listing grid so column counts and gaps stay identical:
// three across on desktop, two on everything narrower — phones included.
export const TILE_GRID_CLASS =
  "grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:gap-3";
