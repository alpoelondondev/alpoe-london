"use client";

import { SITE } from "@/lib/site";

/**
 * The last line of defence, and the reason this file exists at all.
 *
 * With no boundary anywhere in the app, a single throw from a client effect —
 * ours came from `new THREE.WebGLRenderer()` on machines without a GPU — took
 * the root layout down with it and Next.js served a bare `<html
 * id="__next_error__">` with no lang, no <title>, no meta description and no
 * copy. Crawlers and Lighthouse render exactly that way, so the version of the
 * site search engines evaluated was an empty error document while `curl`
 * showed perfect HTML. The bug is fixed at source; this makes sure the next
 * one of its kind costs us a component, not the whole page.
 *
 * global-error replaces the root layout entirely, so the html/body/title here
 * are not optional — they are the only ones the document will have.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-GB">
      <head>
        <title>{`Something went wrong — ${SITE.name}`}</title>
        <meta name="robots" content="noindex, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#131010",
          color: "#f4ece6",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <main>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 500, margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ opacity: 0.75, maxWidth: "34rem", lineHeight: 1.6 }}>
            Sorry — this page failed to load. Try again, or reach {SITE.name} in
            Hatton Garden on{" "}
            <a href={`tel:${SITE.phone}`} style={{ color: "#c48a6f" }}>
              {SITE.phone}
            </a>
            .
          </p>
          <p>
            <button
              onClick={reset}
              style={{
                cursor: "pointer",
                border: "1px solid #c48a6f",
                background: "transparent",
                color: "#c48a6f",
                padding: "0.7rem 1.6rem",
                borderRadius: 999,
                font: "inherit",
              }}
            >
              Try again
            </button>{" "}
            <a href="/" style={{ color: "#c48a6f", marginLeft: "1rem" }}>
              Back to home
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
