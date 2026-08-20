"use client";

import Link from "next/link";

/**
 * Segment-level boundary. Where global-error.tsx is the airbag, this is the
 * seatbelt: a throw from anything inside a page is contained here, the root
 * layout survives, and with it the entire <head> — title, canonical, meta
 * description, JSON-LD. A crawler that hits a client-side crash still sees a
 * described, linked, indexable-looking document rather than `__next_error__`.
 *
 * Deliberately dependency-free and free of any effect that could itself throw.
 */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-[70vh] grid place-items-center px-6 py-40 text-center">
      <div>
        <p className="text-[11px] uppercase tracking-[0.14em] text-accent">
          Alpoe London
        </p>
        <h1 className="t-page mt-4">This page didn&apos;t load</h1>
        <p className="mt-6 mx-auto max-w-xl t-copy font-light text-dim">
          Something went wrong on our side. Try again, or carry on to the pieces
          — the rest of the site is fine.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-[0.14em]">
          <button
            onClick={reset}
            className="border border-accent px-6 py-3 text-accent hover:bg-accent hover:text-bg transition-colors"
          >
            Try again
          </button>
          <Link href="/" className="opacity-70 hover:opacity-100 transition-opacity">
            Home
          </Link>
          <Link
            href="/rings/engagement-and-wedding-rings"
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            Engagement rings
          </Link>
          <Link href="/bespoke" className="opacity-70 hover:opacity-100 transition-opacity">
            Bespoke
          </Link>
          <Link href="/contact" className="opacity-70 hover:opacity-100 transition-opacity">
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
