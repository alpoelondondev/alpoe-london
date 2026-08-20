import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import PageCover from "../components/PageCover";
import { Sparkle } from "./RingCards";
import { ringStyles, styleImage } from "@/lib/rings/styles";
import { collectionPieces } from "@/lib/rings/collection";
import { getJewelleryByCategory } from "@/lib/products";
import { rendersOrigin } from "@/lib/ring/renders";
import { pageMetadata, ldJsonGraph, breadcrumbLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { SHAPE_GUIDES } from "@/lib/rings/shapeGuides";

const PATH = "/rings";

/**
 * The rings hub.
 *
 * Three cards, and deliberately nothing else. This page used to carry all three
 * collections in full, with the menu pointing at fragments of it. That was the
 * wrong shape: engagement rings, wedding bands and stock pieces are three
 * different searches by three different people, and a fragment cannot carry its
 * own title, description or position in a results page.
 *
 * Now each is a page. What matters here is that the hub does not repeat them:
 * if it showed the fifteen styles again it would compete with its own child for
 * "engagement rings", and Google would pick one of them for us. A hub that
 * routes and does not duplicate leaves each child to rank for its own query.
 */
export const metadata: Metadata = pageMetadata({
  title: "Rings — Engagement, Wedding & Ready to Ship",
  description:
    "Engagement rings made to order, wedding rings and bands, and finished rings ready to be sized and sent. Hand made in Hatton Garden by Alpoe London.",
  path: PATH,
});

/**
 * The ring types people arrive asking for, each pointed at the page that can
 * actually serve them. Eternity, signet and dress rings had no mention
 * anywhere on the site before this, and all three are real UK queries.
 */
const RING_TYPES: { title: string; copy: string; href: string }[] = [
  {
    title: "Engagement rings",
    copy: "Fifteen band styles, any diamond shape, any setting, in platinum or 18ct gold. Natural or laboratory-grown, and we do not steer you toward either.",
    href: "/rings/engagement-and-wedding-rings",
  },
  {
    title: "Wedding rings and bands",
    copy: "Plain or set, in a profile chosen against the ring it will sit beside — and shaped to fit where an engagement ring will not take a straight band.",
    href: "/rings/engagement-and-wedding-rings",
  },
  {
    title: "Eternity rings",
    copy: "Full, half and three-quarter. Worth knowing before you choose: a full eternity band cannot be resized, because the stones run the whole way round and the spacing cannot be altered.",
    href: "/ring-size-guide",
  },
  {
    title: "Signet rings",
    copy: "A signet is one of the few pieces still bought to be engraved, whether with a crest, a monogram or initials. Talk to us about the face and the metal.",
    href: "/bespoke",
  },
  {
    title: "Dress and statement rings",
    copy: "Cocktail rings, pav\u00e9 bands and cluster pieces \u2014 the ones bought for no occasion at all, which are often the most interesting to make.",
    href: "/jewellery/rings",
  },
  {
    title: "Remodelled and inherited rings",
    copy: "An inherited stone reset into something you will actually wear. Bring it in and we will tell you honestly whether it is worth resetting first.",
    href: "/bespoke",
  },
];

export default function RingsHubPage() {
  const styles = ringStyles();
  const pieces = collectionPieces();
  const bands = getJewelleryByCategory("wedding-rings");
  const renders = rendersOrigin();

  /**
   * One picture each, taken from the collection it represents rather than shot
   * for the hub. The engagement card uses the solitaire because it is the
   * default and the most asked for; the others use whatever is first, which is
   * the photographed one since both lists sort that way.
   */
  const cards = [
    {
      href: "/rings/engagement-and-wedding-rings",
      title: "Engagement & Wedding Rings",
      copy: "Fifteen styles made to order, and the bands to match. Choose the stone, the setting, the metal and the size.",
      count: `${styles.length} styles · ${bands.length} bands`,
      image: styleImage(styles[0]),
      fill: true,
      action: "Customise",
    },
    {
      href: "/rings/ready-to-ship",
      title: "Ready to Ship Rings",
      copy: "Finished pieces we hold, sized and sent far sooner than a commission.",
      count: `${pieces.length} pieces`,
      image: pieces[0]?.image,
      fill: false,
      action: "See what we hold",
    },
  ];

  return (
    <>
      {renders && (
        <>
          <link rel="preconnect" href={renders} crossOrigin="" />
          <link rel="dns-prefetch" href={renders} />
        </>
      )}

      <SiteHeader />

      <main className="on-sheet bg-white">
        <section className="clears-nav px-[52px] pb-8 max-md:px-6 max-md:pb-6">
          <p className="t-eyebrow font-semibold">Alpoe London</p>
          {/*
            "Rings" on its own is a word, not a query. The <title> on this page
            already targets the three things it holds; the headline should say
            the same thing, and say where they are made — this page competes
            with every national retailer for the same term and the location is
            the one thing they cannot claim.
          */}
          <h1 className="t-page mt-3">
            Rings Made in Hatton Garden
          </h1>
          <p className="mt-5 max-w-[58ch] t-copy">
            Everything we make and hold for the finger. Engagement rings are built to
            your own specification with wedding bands sized to match, and our ready to
            ship pieces are finished and waiting. Not sure of the size? Start with the{" "}
            <Link
              href="/ring-size-guide"
              className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep"
            >
              ring size guide
            </Link>
            .
          </p>
        </section>

        {/* The film as a band between the header and the cards rather than as
            the header itself. It is the same footage the home page's Engagement
            & Wedding Rings card shows, so arriving from that card lands on the
            shot it just showed. Carrying no heading, it stays out of the
            document outline entirely. */}
        <PageCover
          strip
          video="/alpoe-oval-three-stone-diamond-ring-hatton-garden.mp4"
          poster="/alpoe-oval-three-stone-diamond-ring-hatton-garden.jpg"
        />

        <ScrollReveal>
          <section className="px-[52px] pb-16 max-md:px-6 max-md:pb-12">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-10 max-lg:grid-cols-1 max-lg:gap-y-8">
              {cards.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} data-haptic className="group block">
                    <span className="relative block aspect-[4/3] w-full overflow-hidden bg-render-ground max-lg:aspect-[16/9]">
                      {c.image ? (
                        // eslint-disable-next-line @next/next/no-img-element -- see lib/ring/renders.ts
                        <img
                          src={c.image}
                          alt={c.title}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          className={
                            c.fill
                              ? "absolute left-1/2 top-1/2 h-[168%] w-auto max-w-none -translate-x-1/2 -translate-y-[54%] object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                              : "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          }
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <span className="block h-[30%] w-[30%] rounded-full border border-sheet-line" />
                        </span>
                      )}
                    </span>

                    <h2 className="t-sub mt-4 leading-snug">{c.title}</h2>
                    <p className="mt-2 max-w-[38ch] t-copy">{c.copy}</p>
                    <p className="t-eyebrow mt-3 flex items-center gap-1.5 font-semibold !text-sheet-ink">
                      <Sparkle />
                      {c.action}
                      <span className="text-sheet-dim">· {c.count}</span>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>

        {/* ---- by shape -----------------------------------------------------
            Ten pages, one per diamond shape, each targeting a phrase people
            actually type. This block is their only route in besides the
            sitemap, so it is not decoration. */}
        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-sub">By diamond shape</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              What the shape changes about the stone — how it sparkles, what it
              hides, the ratio to ask for and how it has to be set. Written
              from the bench, and sourced.
            </p>
            <ul className="mt-8 grid grid-cols-3 gap-x-8 gap-y-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {SHAPE_GUIDES.map((g) => (
                <li key={g.slug} className="border-t border-sheet-line pt-3">
                  <Link
                    href={`/rings/${g.slug}`}
                    className="text-[15px] font-medium text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep"
                  >
                    {g.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>

        {/* ---- by type, not by style ----------------------------------------
            This hub had two cards and about a hundred words, which made it a
            weaker copy of the page directly beneath it — the audit flagged the
            two as competing for the same query. They should not compete: the
            child page sorts rings by *style*, and this one sorts them by
            *what the ring is for*, which is how somebody arrives. It also lets
            eternity, signet and dress rings say they exist, none of which had
            a mention anywhere on the site despite all three being searched. */}
        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-sub">Every kind of ring we make</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              All of it made to order in Hatton Garden, cast and set by hand, and
              hallmarked at the London Assay Office before it reaches you.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-10 gap-y-8 max-md:grid-cols-1">
              {RING_TYPES.map((t) => (
                <div key={t.title} className="border-t border-sheet-line pt-4">
                  <dt className="text-[15px] font-medium text-sheet-ink">
                    <Link
                      href={t.href}
                      className="underline underline-offset-4 transition hover:text-accent-deep"
                    >
                      {t.title}
                    </Link>
                  </dt>
                  <dd className="mt-2 max-w-[52ch] t-copy">{t.copy}</dd>
                </div>
              ))}
            </dl>
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
                { name: "Rings", url: siteUrl(PATH) },
              ]),
            ]),
          ),
        }}
      />
    </>
  );
}
