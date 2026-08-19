import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import DragCarousel from "../components/DragCarousel";
import { ringStyles, styleHref, styleImage, styleSubtitle, styleTitle } from "@/lib/rings/styles";
import { collectionPieces } from "@/lib/rings/collection";
import { getJewelleryByCategory, hasPhotography, photosFirst, productUrl } from "@/lib/products";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { rendersOrigin } from "@/lib/ring/renders";
import { pageMetadata, ldJsonGraph, breadcrumbLd, collectionLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

const PATH = "/rings";

/**
 * Ring styles — fifteen bands, each as a finished ring, each a way into the
 * builder.
 *
 * The page this replaces showed seventeen borrowed photographs of settings we
 * do not make, all shot with the same round platinum stone. This shows fifteen
 * rings we do make, every one a real render of a real configuration, and every
 * one differing in head, stone and metal as well as band — because the thing a
 * customer needs to learn here is that all four are theirs to choose. A grid of
 * identical solitaires teaches the opposite.
 *
 * Every card lands in the builder on exactly the ring in its picture. That is
 * the whole purpose of the page: it is a way in, not a catalogue, and nothing
 * on it has a price because nothing on it is a product — it is a starting
 * point that happens to be photographed.
 */
export const metadata: Metadata = pageMetadata({
  title: "Engagement Ring Styles — Design Your Own",
  description:
    "Fifteen engagement ring styles made in Hatton Garden — solitaire, knife edge, cathedral pavé, three stone, twist and more. Pick a style and customise the diamond shape, setting, metal and size to your own.",
  path: PATH,
});

/** The mark on the Customise control, in both its forms. */
function Sparkle() {
  return (
    <svg viewBox="0 0 12 12" width="8" height="8" aria-hidden>
      <path
        d="M6 0l1.6 4.4L12 6l-4.4 1.6L6 12l-1.6-4.4L0 6l4.4-1.6z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function RingStylesPage() {
  const styles = ringStyles();
  const readyToShip = collectionPieces();
  // Photographed pieces first: a rail leads with what it can actually show.
  const weddingBands = getJewelleryByCategory("wedding-rings").sort(photosFirst);
  const renders = rendersOrigin();

  return (
    <>
      {/* The cards are the page's LCP and they live on another host. */}
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
          <h1 className="t-page mt-3">Ring Styles</h1>
          <p className="mt-5 max-w-[58ch] t-copy">
            Fifteen bands, each shown here as a finished ring. Every one is made to order
            in Hatton Garden, and every part of it is yours to choose — the stone, the
            setting that holds it, the metal and the size. Pick the shape you like and
            change the rest.
          </p>
        </section>

        {/* Two columns, and no more. These are photographs of one object each,
            and at four across a ring is smaller than the thumbnail that got you
            here — you would be choosing between silhouettes you cannot actually
            see. Two across is close to a shop's window: fewer at once, each
            large enough to read the band. */}
        <ScrollReveal>
          <section className="px-[52px] pb-16 max-md:px-6 max-md:pb-12">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-12 max-md:gap-x-4 max-md:gap-y-8">
              {styles.map((style) => {
                const image = styleImage(style);
                return (
                  <li key={style.id}>
                    <Link
                      href={styleHref(style)}
                      data-haptic
                      className="group block"
                      title={style.description}
                    >
                      <span className="relative block aspect-square w-full overflow-hidden bg-white">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element -- see lib/ring/renders.ts
                          <img
                            src={image}
                            width={900}
                            height={900}
                            alt={`${styleTitle(style)} with a ${style.showcase.shape} diamond`}
                            loading="lazy"
                            decoding="async"
                            // The same 1.26 fill the builder's viewer uses, and
                            // for the same reason: a fifth of every render is
                            // white sweep. Done by layout rather than transform
                            // so the browser resamples once — see ZoomView.
                            className="absolute left-[-14.3%] top-[-10.5%] h-[126%] w-[126%] max-w-none object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <span
                            aria-hidden
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <span className="block h-[38%] w-[38%] rounded-full border border-sheet-line" />
                          </span>
                        )}

                        {/* The pill sits on the picture rather than under it.
                            On a page whose every card is a doorway, the label
                            has to be part of the thing you are looking at — put
                            below, it reads as a caption and gets skipped. */}
                        {/* Desktop only. The grid is two across on a phone, so
                            a card is about 170px wide and a pill over the
                            picture covers a third of the ring it is inviting
                            you to look at. Below md the same words appear under
                            the title instead — see the card's text block. */}
                        <span className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-sheet-ink px-5 py-2.5 text-[11px] font-semibold tracking-[0.16em] whitespace-nowrap text-white uppercase shadow-[0_2px_10px_rgba(23,19,18,0.18)] transition group-hover:bg-sheet-ink/85 max-md:hidden">
                          <Sparkle />
                          Customise
                        </span>
                      </span>

                      <h2 className="t-card mt-4 leading-snug max-md:mt-3">
                        {styleTitle(style)}
                      </h2>
                      <p className="t-eyebrow mt-1.5 !tracking-[0.12em] text-sheet-dim">
                        {styleSubtitle(style)}
                      </p>

                      {/* The phone's version of the pill. Under the title, in
                          the card's own ink, so the picture stays clean at a
                          size where anything laid over it is in the way. */}
                      <p className="t-eyebrow mt-2 hidden items-center gap-1.5 font-semibold !text-sheet-ink max-md:flex">
                        <Sparkle />
                        Customise
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </ScrollReveal>

        {/* ---- ready to ship ------------------------------------------------
            A rail rather than a grid, and the difference is the proposition.
            The styles above are made to order and the whole page invites you to
            change them; these are finished rings that exist and can go out. A
            rail says "a handful we happen to have" where a second grid would
            read as more of the same and compete with the thing above it for the
            same decision. */}
        {readyToShip.length > 0 && (
          <ScrollReveal>
            <section className="border-t border-sheet-line py-12 max-md:py-9">
              <div className="px-[52px] max-md:px-6">
                <h2 className="t-sub">Ready to Ship Rings</h2>
                <p className="mt-2 max-w-[58ch] t-copy">
                  Finished pieces we hold, rather than made to order — so they can be
                  sized and sent far sooner than a commission. Ask about any of them.
                </p>
              </div>

              <DragCarousel
                ariaLabel="Ready to ship rings"
                className="mt-6 gap-5 px-[52px] py-1 max-md:gap-4 max-md:px-6"
              >
                {readyToShip.map((piece) => (
                  <a
                    key={piece.id}
                    href={buildGeneralWhatsAppUrl(
                      `Hello — I am interested in the ${piece.label} ring from your ready to ship pieces.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-haptic
                    className="group w-[232px] shrink-0 snap-start max-md:w-[176px]"
                    title={piece.description}
                  >
                    <span className="relative block aspect-square w-full overflow-hidden bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element -- local, already sized */}
                      <img
                        src={piece.image}
                        alt={`${piece.label} engagement ring`}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </span>
                    <h3 className="t-card mt-3 leading-snug">{piece.label}</h3>
                    <p className="t-eyebrow mt-1 !tracking-[0.12em] text-sheet-dim">
                      Enquire
                    </p>
                  </a>
                ))}
              </DragCarousel>
            </section>
          </ScrollReveal>
        )}

      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            ldJsonGraph([
              breadcrumbLd([
                { name: "Home", url: siteUrl("/") },
                { name: "Ring Styles", url: siteUrl(PATH) },
              ]),
              ...collectionLd({
                name: "Engagement Ring Styles",
                description:
                  "Engagement ring styles made to order by Alpoe London in Hatton Garden.",
                path: PATH,
                products: styles.map((s) => ({
                  title: styleTitle(s),
                  url: styleHref(s),
                })),
              }),
            ]),
          ),
        }}
      />
    </>
  );
}
