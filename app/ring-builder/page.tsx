import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import StudioClient from "./StudioClient";
import Link from "next/link";
import SheetFaq from "../components/SheetFaq";
import { renderUrl, rendersOrigin } from "@/lib/ring/renders";
import { SHAPES } from "@/lib/ring/shapes";
import { HEADS } from "@/lib/ring/heads";
import { BANDS } from "@/lib/ring/bands";
import { METALS } from "@/lib/ring/metals";
import { DEFAULT_CONFIG } from "@/lib/ring/config";
import { pageMetadata, ldJsonGraph, breadcrumbLd, faqLd } from "@/lib/seo";
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
  title: "Design Your Own Engagement Ring",
  description:
    "Design your own engagement ring in 3D — choose the setting, diamond shape, carat, metal and UK ring size, then send the spec to our Hatton Garden workshop.",
  path: PATH,
  image: "/og/ring-builder.jpg",
});

/**
 * Everything the studio can build, written out on the server.
 *
 * The studio itself is a client component that reads the URL for its
 * configuration, which puts it behind a <Suspense> boundary on a statically
 * prerendered route — so what Next.js writes into the HTML is the fallback,
 * "Loading the studio…", and nothing else. The page therefore shipped with
 * about sixty crawlable words, no headings, and no link to the size guide or
 * the diamonds guide it points at once it hydrates. Its own copy was invisible
 * to the one audience that cannot press a button.
 *
 * So the options get stated as text as well as offered as controls. This is
 * not filler written for a crawler: it is the actual contents of the builder,
 * read from the same arrays the studio renders, which means it cannot drift
 * out of date and every term in it is one somebody types — "emerald cut",
 * "hidden halo", "cathedral pavé", "18ct rose gold".
 */
const OPTION_GROUPS = [
  {
    heading: "Diamond shapes",
    lead: "Ten cuts, natural or laboratory-grown, from 0.3ct upward.",
    items: SHAPES.map((s) => s.label),
  },
  {
    heading: "Settings",
    lead: "How the centre stone is held — claws, baskets, halos and rubover.",
    items: HEADS.map((h) => h.label),
  },
  {
    heading: "Bands",
    lead: "The shank the setting sits on, plain through to fully set.",
    items: BANDS.map((b) => b.label),
  },
  {
    heading: "Metals",
    lead: "Hallmarked at the London Assay Office before it reaches you.",
    items: METALS.map((m) => m.label),
  },
];

const BUILDER_FAQS = [
  {
    question: "How does the ring builder work?",
    answer:
      "Choose a diamond shape, a setting, a band and a metal, and the studio shows that exact combination as you go. Add your carat weight and UK ring size, then send the specification to us. We come back with a CAD design and a price, and nothing is cast until you have approved both.",
  },
  {
    question: "Can I use a lab-grown diamond?",
    answer:
      "Yes. Every setting in the builder can be made with either a natural or a laboratory-grown stone, and both are certified. A lab-grown diamond is chemically and optically identical to a mined one and typically costs a good deal less for the same size and grade, which is why many people put the difference into a larger stone.",
  },
  {
    question: "How long does a made-to-order ring take?",
    answer:
      "Allow around four to six weeks from approved CAD to finished ring — casting, setting, finishing and hallmarking at the London Assay Office all happen in that window. If you are working to a date, tell us at the start and we will say honestly whether it is possible.",
  },
  {
    question: "What if I do not know the ring size?",
    answer:
      "Build the ring anyway and leave the size until last. Our ring size guide covers how to measure at home and how to find someone's size without asking them, and most rings can be adjusted by a size or two afterwards. Full eternity bands are the exception and cannot be resized.",
  },
  {
    question: "Do I have to come to Hatton Garden?",
    answer:
      "No. The whole commission can be handled remotely, by email and WhatsApp, and we ship insured. You are very welcome to come and see stones in person, and most people who can, do — but it is not a requirement.",
  },
];

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

        <section className="on-sheet border-t border-sheet-line bg-white px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-sub">Design your own engagement ring</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              Every ring here is made to order in Hatton Garden, cast and hand-set once
              you have approved a CAD design. We handle your booking privately, as a
              one-to-one service. If you would rather start from a sketch, an heirloom
              stone or simply a conversation, that is our{" "}
              <Link href="/bespoke" className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep">
                bespoke service
              </Link>
              .
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-12 grid grid-cols-4 gap-x-8 gap-y-10 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {OPTION_GROUPS.map((group) => (
                <div key={group.heading}>
                  <h3 className="text-[13px] uppercase tracking-[0.14em] text-sheet-ink">
                    {group.heading}
                  </h3>
                  <p className="mt-2 text-sm font-light text-sheet-dim">{group.lead}</p>
                  <ul className="mt-4 flex flex-col gap-1.5 text-sm font-light text-sheet-dim">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <SheetFaq items={BUILDER_FAQS} heading="Before you start" />

          <ScrollReveal>
            <section className="border-t border-sheet-line pt-8 mt-10">
              <h2 className="t-sub">Next steps</h2>
              <ul className="mt-4 flex flex-col gap-2 text-sm">
                <li>
                  <Link href="/ring-size-guide" className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep">
                    Ring size guide
                  </Link>
                  <span className="text-sheet-dim"> — the UK chart, and how to measure at home.</span>
                </li>
                <li>
                  <Link href="/guides/natural-vs-lab-grown-diamonds" className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep">
                    Natural vs lab-grown diamonds
                  </Link>
                  <span className="text-sheet-dim"> — what actually differs, and what each costs.</span>
                </li>
                <li>
                  <Link href="/rings/engagement-and-wedding-rings" className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep">
                    Engagement &amp; wedding rings
                  </Link>
                  <span className="text-sheet-dim"> — fifteen finished styles to start from.</span>
                </li>
                <li>
                  <Link href="/hallmarking" className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep">
                    Hallmarking
                  </Link>
                  <span className="text-sheet-dim"> — what the marks struck into your ring certify.</span>
                </li>
                <li>
                  <Link href="/book-appointment" className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep">
                    Book an appointment
                  </Link>
                  <span className="text-sheet-dim"> — see stones in person in Hatton Garden.</span>
                </li>
              </ul>
            </section>
          </ScrollReveal>
        </section>
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
              // Every one of these is rendered above by <SheetFaq>. Marking up
              // an answer that is not on the page is a policy breach, not a
              // shortcut — see components/SheetFaq.tsx.
              faqLd(BUILDER_FAQS),
              {
                "@type": "WebApplication",
                "@id": siteUrl(PATH) + "#app",
                name: "Alpoe London Ring Builder",
                url: siteUrl(PATH),
                applicationCategory: "DesignApplication",
                browserRequirements: "Requires JavaScript",
                operatingSystem: "Any",
                description:
                  "Design a bespoke engagement ring online — choose the diamond shape, setting, band, metal and UK ring size and send the specification to the Alpoe London workshop in Hatton Garden.",
                provider: { "@id": siteUrl("/") + "#localbusiness" },
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "GBP",
                  seller: { "@id": siteUrl("/") + "#organization" },
                },
              },
            ]),
          ),
        }}
      />
    </>
  );
}
