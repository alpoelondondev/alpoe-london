import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import StudioClient from "./StudioClient";
import { renderUrl, rendersOrigin } from "@/lib/ring/renders";
import { DEFAULT_CONFIG } from "@/lib/ring/config";
import { pageMetadata, ldJsonGraph, breadcrumbLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

const PATH = "/ring-builder";

/**
 * The title targets the query, the page calls itself the Custom Studio.
 *
 * "Custom studio" has no search intent in jewellery — nobody types it — while
 * "design your own engagement ring" and "engagement ring builder" are what
 * people actually search and what competitors rank on. So the two names do
 * different jobs: the metadata goes after the search, and the brand name lives
 * on the page where it can mean something.
 */
export const metadata: Metadata = pageMetadata({
  title: "Design Your Own Engagement Ring — Ring Builder",
  description:
    "Build a bespoke engagement ring in 3D: choose the setting, diamond shape, carat, metal and UK ring size, then send your specification straight to our Hatton Garden workshop. Natural or laboratory-grown, hand-set in London.",
  path: PATH,
});

/**
 * The first frame, resolved at build time.
 *
 * This is the single largest thing that can be done for this page's LCP. The
 * studio is a client component behind Suspense — it has to be, it reads
 * `useSearchParams` — so without a preload the browser does not discover the
 * ring's URL until React has downloaded, parsed, hydrated and rendered. That is
 * the entire JavaScript pipeline standing between the customer and the one
 * image they came for. Emitting the tag from the server puts the request in
 * flight while the HTML is still being parsed, before any of that begins.
 *
 * ── Why the default configuration and not the visitor's ──
 *
 * Reading `searchParams` to preload the exact ring somebody linked to is
 * possible, and it costs the whole page its static render: Next drops it from
 * ○ (prerendered, served from the edge) to ƒ (rendered on demand). That trades
 * a guaranteed TTFB for every visitor against a better LCP for the minority who
 * arrive on a shared link — a bad trade, because TTFB is upstream of LCP and
 * the page cannot start painting until it lands.
 *
 * So the page stays static and preloads the default, which is what everybody
 * arriving from search, the menu or the footer sees. Visitors on a shared link
 * are covered by the client instead: the viewport requests its lead frame at
 * high priority the moment it mounts, which is the same request this tag would
 * have made, just later.
 *
 * Only the first frame — the front view. The other two are lazy inside the
 * carousel, and preloading three would triple the bytes on the critical path
 * to save a swipe most visitors never make.
 */
const PRELOAD = renderUrl(DEFAULT_CONFIG);

export default function RingBuilderPage() {
  const renders = rendersOrigin();

  return (
    <>
      {/*
        The renders live on object storage, on a different host to the document,
        and the first one is this page's LCP element. Without this the browser
        pays DNS + TCP + TLS — three round trips, easily 200–300ms on mobile —
        and only starts paying once it has parsed far enough to discover the
        image URL, which is after the studio has hydrated. Preconnecting opens
        that connection while the HTML is still arriving, so the socket is warm
        before anything asks for a picture.

        React 19 hoists a bare <link> into the head from wherever it is
        rendered, so this does not need to be in `metadata`. It is omitted
        entirely when no bucket is configured — a preconnect to nothing is a
        wasted connection, which is the exact thing Lighthouse flags.
      */}
      {renders && (
        <>
          <link rel="preconnect" href={renders} crossOrigin="" />
          <link rel="dns-prefetch" href={renders} />
        </>
      )}
      {PRELOAD && (
        <link rel="preload" as="image" href={PRELOAD} fetchPriority="high" />
      )}

      <SiteHeader />

      <main>
        {/*
          The studio fills the viewport and carries no headline of its own, so
          the page shipped without an <h1> — a document-level defect, not a
          styling one: assistive tech gets no page title to land on and search
          engines get no statement of what the page is for. Visually hidden
          rather than drawn, because there is nowhere to put a headline above a
          full-bleed tool without pushing the tool off the fold.
        */}
        <h1 className="sr-only">
          Ring builder — design your own engagement ring in Hatton Garden
        </h1>

        <section>
          <Suspense
            fallback={
              <p className="clears-nav bg-white pb-32 text-center text-[11px] tracking-[0.2em] uppercase text-sheet-dim">
                Loading the studio…
              </p>
            }
          >
            <StudioClient />
          </Suspense>
        </section>

        <ScrollReveal>
          <section className="on-sheet border-t border-sheet-line bg-white px-[52px] py-14 max-md:px-6 max-md:py-10">
            <p className="max-w-[64ch] t-copy">
              Every ring here is made to order in Hatton Garden, cast and hand-set once
              you have approved a CAD design. We handle your booking privately, as a
              one-to-one service. If you would rather start from a sketch, an heirloom
              stone or simply a conversation, that is our{" "}
              <a href="/bespoke" className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep">
                bespoke service
              </a>
              .
            </p>
          </section>
        </ScrollReveal>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            ldJsonGraph([
              breadcrumbLd([
                { name: "Home", url: siteUrl("/") },
                { name: "Bespoke", url: siteUrl("/bespoke") },
                { name: "Ring Builder", url: siteUrl(PATH) },
              ]),
            ]),
          ),
        }}
      />
    </>
  );
}
