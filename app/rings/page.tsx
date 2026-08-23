import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ScrollReveal from "../components/ScrollReveal";
import { CardRail, RAIL_ITEM, ReadyToShipCard } from "./RingCards";
import { collectionPieces } from "@/lib/rings/collection";
import { rendersOrigin } from "@/lib/ring/renders";
import FAQ from "../components/FAQ";
import { pageMetadata, ldJsonGraph, faqLd } from "@/lib/seo";
import { RING_FAQS } from "@/lib/faqs";
import { SHAPE_GUIDES } from "@/lib/rings/shapeGuides";

const PATH = "/rings";

/**
 * The rings hub.
 *
 * A grid of category cards, and deliberately nothing else. This page used to
 * carry all three collections in full, with the menu pointing at fragments of
 * it. That was the wrong shape: engagement rings, wedding bands and stock
 * pieces are three different searches by three different people, and a fragment
 * cannot carry its own title, description or position in a results page.
 *
 * Now each is a page. What matters here is that the hub does not repeat them:
 * if it showed the fifteen styles again it would compete with its own child for
 * "engagement rings", and Google would pick one of them for us. A hub that
 * routes and does not duplicate leaves each child to rank for its own query.
 *
 * Built as the jewellery and watches hubs are built — off-black ground,
 * BrandHero, breadcrumbs, then bordered cards on the twelve-column grid. It sat
 * on the light sheet with a film across the top for a while, which made the one
 * page of the three that read as a different site. The sheet stays where it
 * belongs: the builder and the pages under this one, which are documents rather
 * than hubs.
 */
export const metadata: Metadata = pageMetadata({
  title: "Rings — Engagement, Wedding & Ready to Ship",
  description:
    "Engagement rings made to order, wedding rings and bands, bespoke commissions and finished rings ready to be sized and sent. Hand made in Hatton Garden by Alpoe London.",
  path: PATH,
  image: "/og/engagement-rings.jpg",
});

/** The five ways somebody arrives asking for a ring, each pointed at the page that serves it. */
const CATEGORIES: { title: string; copy: string; href: string }[] = [
  {
    title: "Engagement Rings",
    copy: "Fifteen band styles made to order — any diamond shape, any setting, in platinum or 18ct gold. Natural or laboratory-grown, and we do not steer you toward either.",
    href: "/rings/engagement-and-wedding-rings",
  },
  {
    title: "Wedding Rings & Bands",
    copy: "Plain or diamond-set, in a profile chosen against the ring it will sit beside — and shaped to fit where an engagement ring will not take a straight band.",
    href: "/rings/engagement-and-wedding-rings",
  },
  {
    title: "Customise Your Own Ring",
    copy: "Build it on screen. Choose the style, the stone and its shape, the setting, the metal and the UK size, and see the ring change as you go.",
    href: "/ring-builder",
  },
  {
    title: "Bespoke Rings",
    copy: "From a sketch, a photograph or a stone you already own. Modelled in CAD and sent to you with the price before anything is cast.",
    href: "/bespoke",
  },
  {
    title: "Ready to Ship Rings",
    copy: "Finished pieces we hold rather than make to order, sized and sent far sooner than a commission.",
    href: "/rings/ready-to-ship",
  },
];

/**
 * The rings that are not one of the five above and still get searched for.
 * Eternity, signet and dress rings had no mention anywhere on the site before
 * this, and all three are real UK queries.
 */
const OTHER_TYPES: { title: string; copy: string; href: string }[] = [
  {
    title: "Eternity rings",
    copy: "Full, half and three-quarter. A full band cannot be resized — the stones run the whole way round and the spacing cannot be altered.",
    href: "/ring-size-guide",
  },
  {
    title: "Signet rings",
    copy: "One of the few pieces still bought to be engraved, whether with a crest, a monogram or initials.",
    href: "/bespoke",
  },
  {
    title: "Dress and statement rings",
    copy: "Cocktail rings, pavé bands and cluster pieces — the ones bought for no occasion at all.",
    href: "/jewellery/rings",
  },
  {
    title: "Remodelled and inherited rings",
    copy: "An inherited stone reset into something you will actually wear. Bring it in and we will tell you honestly whether it is worth resetting.",
    href: "/bespoke",
  },
];

/** The bordered card, identical to the one the jewellery and watches hubs use. */
const CARD =
  "flex flex-col justify-between gap-3 w-full border border-fg/[0.14] hover:border-accent/60 hover:bg-fg/[0.04] transition p-5";

export default function RingsHubPage() {
  const pieces = collectionPieces();
  const renders = rendersOrigin();

  return (
    <>
      {renders && (
        <>
          <link rel="preconnect" href={renders} crossOrigin="" />
          <link rel="dns-prefetch" href={renders} />
        </>
      )}

      <SiteHeader />

      <main>
        {/*
          "Rings" on its own is a word, not a query. The <title> already targets
          the things this page holds; the headline says the same, and says where
          they are made — this page competes with every national retailer for
          the same term and the location is the one thing they cannot claim.
        */}
        <BrandHero
          eyebrow="Rings"
          title="Rings Made in Hatton Garden"
          copy="Everything we make and hold for the finger. Engagement rings are built to your own specification with wedding bands sized to match, bespoke commissions start from a sketch or a stone you already own, and our ready to ship pieces are finished and waiting."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Rings", href: PATH, current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-14 max-md:px-6">
          <ul className="grid grid-cols-12 gap-4 max-md:gap-3 auto-rows-fr">
            {CATEGORIES.map((c) => (
              <li key={c.title} className="col-span-4 max-md:col-span-6 flex">
                <Link href={c.href} data-haptic className={`${CARD} min-h-[180px]`}>
                  <p className="font-serif text-[22px] tracking-[0.02em] leading-none">
                    {c.title}
                  </p>
                  <p className="text-[12px] text-fg/60 font-light leading-relaxed">{c.copy}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[13px] text-fg/60 font-light">
            Not sure of the size?{" "}
            <Link
              href="/ring-size-guide"
              className="text-fg underline underline-offset-4 transition hover:text-accent"
            >
              Start with the ring size guide
            </Link>
            .
          </p>
        </section>

        {/* ---- by shape -----------------------------------------------------
            Ten pages, one per diamond shape, each targeting a phrase people
            actually type. This block is their only route in besides the
            sitemap, so it is not decoration — and it is cards rather than a
            column of underlined links, because a hub whose whole job is to
            route should route the same way twice. */}
        <ScrollReveal>
          <section className="border-t border-fg/[0.14] px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-sub">By diamond shape</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              What the shape changes about the stone — how it sparkles, what it
              hides, the ratio to ask for and how it has to be set. Written from
              the bench, and sourced.
            </p>
            <ul className="mt-8 grid grid-cols-12 gap-4 max-md:gap-3 auto-rows-fr">
              {SHAPE_GUIDES.map((g) => (
                <li key={g.slug} className="col-span-3 max-md:col-span-6 flex">
                  <Link
                    href={`/rings/${g.slug}`}
                    data-haptic
                    className={`${CARD} min-h-[110px]`}
                  >
                    <p className="font-serif text-[22px] tracking-[0.02em] leading-none">
                      {g.name}
                    </p>
                    <p className="text-[10px] tracking-[0.18em] uppercase text-dim">
                      Engagement rings
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>

        {/* ---- the rest ----------------------------------------------------
            Sorted by what the ring is for rather than by style, which is how
            somebody arrives. Engagement and wedding rings are not repeated
            here — they have their own cards above — so this is only the ones
            that would otherwise go unmentioned anywhere on the site. */}
        <ScrollReveal>
          <section className="border-t border-fg/[0.14] px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-sub">Other rings we make</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              All of it made to order in Hatton Garden, cast and set by hand, and
              hallmarked at the London Assay Office before it reaches you.
            </p>
            <ul className="mt-8 grid grid-cols-12 gap-4 max-md:gap-3 auto-rows-fr">
              {OTHER_TYPES.map((t) => (
                <li key={t.title} className="col-span-3 max-md:col-span-6 flex">
                  <Link href={t.href} data-haptic className={`${CARD} min-h-[160px]`}>
                    <p className="font-serif text-[22px] tracking-[0.02em] leading-none">
                      {t.title}
                    </p>
                    <p className="text-[12px] text-fg/60 font-light leading-relaxed">{t.copy}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>

        {/* ---- ready to ship ------------------------------------------------
            The hub's only photography, and the one thing on it that can be
            illustrated honestly: these pieces exist and are shot. On the panel
            band, which is where every other hub puts its featured strip. */}
        {pieces.length > 0 && (
          <section className="bg-panel py-16 mb-20 max-md:py-12 max-md:mb-14">
            <div className="flex items-baseline justify-between gap-6 px-[52px] max-md:px-6">
              <div>
                <h2 className="t-sub">Ready to Ship Rings</h2>
                <p className="mt-2 max-w-[58ch] t-copy">
                  Finished pieces we hold rather than make to order, so they can be sized
                  and sent far sooner than a commission.
                </p>
              </div>
              <Link
                href="/rings/ready-to-ship"
                className="t-eyebrow shrink-0 font-semibold whitespace-nowrap underline underline-offset-4 transition hover:text-accent"
              >
                See all
              </Link>
            </div>

            <CardRail label="Ready to ship rings">
              {pieces.map((piece) => (
                <div key={piece.id} className={RAIL_ITEM}>
                  <ReadyToShipCard piece={piece} />
                </div>
              ))}
            </CardRail>
          </section>
        )}
        {/* The questions that decide whether somebody can go any further —
            what size, which stone, which band — each answered here and each
            pointing at the guide that answers it at length. */}
        <FAQ items={RING_FAQS} />
      </main>

      <Footer />
      <WhatsAppButton />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ldJsonGraph([faqLd(RING_FAQS)])),
        }}
      />
    </>
  );
}
