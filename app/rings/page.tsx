import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import LockupMark from "../components/LockupMark";
import { Sparkle } from "./RingCards";
import { ringStyles, styleImage } from "@/lib/rings/styles";
import { collectionPieces } from "@/lib/rings/collection";
import { getJewelleryByCategory } from "@/lib/products";
import { rendersOrigin } from "@/lib/ring/renders";
import { pageMetadata, ldJsonGraph, breadcrumbLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

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
  title: "Rings: Engagement, Wedding and Ready to Ship",
  description:
    "Engagement rings made to order, wedding rings and bands, and finished rings ready to be sized and sent. Hand made in Hatton Garden by Alpoe London.",
  path: PATH,
});

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
        <section className="clears-nav px-[52px] pb-10 max-md:px-6 max-md:pb-8">
          {/* The mark rather than the words. "Alpoe London" set as a text
              eyebrow above "Rings" was the brand name doing a label's job; the
              lockup says the same thing and says it as the house. Ink here, not
              the footer's rose, because the studio pages are black on white and
              a gold mark on that ground reads as an ornament rather than a
              signature.

              The h1 still says Rings, in text, because that is what the page is
              about and an image cannot be a heading. */}
          <LockupMark
            width="min(128px, 40vw)"
            fill="var(--color-sheet-ink)"
            className="mb-6"
          />
          <h1 className="t-page">Rings</h1>
          <p className="mt-5 max-w-[58ch] t-copy">
            Everything we make and hold for the finger. Engagement rings are built to
            your own specification with wedding bands sized to match, and our ready to
            ship pieces are finished and waiting. If you are not sure of the size, start
            with the{" "}
            <Link
              href="/ring-size-guide"
              className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep"
            >
              ring size guide
            </Link>
            .
          </p>
        </section>

        <ScrollReveal>
          <section className="px-[52px] pb-16 max-md:px-6 max-md:pb-12">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-10 max-lg:grid-cols-1 max-lg:gap-y-8">
              {cards.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} data-haptic className="group block">
                    <span className="relative block aspect-[4/3] w-full overflow-hidden bg-white max-lg:aspect-[16/9]">
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
