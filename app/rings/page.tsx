import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import { collectionPieces, collectionStones } from "@/lib/rings/collection";
import { pageMetadata, ldJsonGraph, breadcrumbLd, collectionLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

const PATH = "/rings";

/**
 * The Ring Collection.
 *
 * These photographs were the ring builder's option tiles until it became clear
 * they were answering a different question. The builder asks "what will MY ring
 * look like", and every one of these is shot with the same round stone in the
 * same platinum — so it could only ever answer "like this one, regardless of
 * what you chose". Here the constant is the whole value: seventeen settings
 * under identical light, with nothing changing frame to frame but the setting,
 * which is exactly the comparison somebody choosing one wants to make.
 *
 * Dark rather than on the market sheet, unlike /ring-builder. The artwork is
 * transparent cut-outs, so it takes whatever ground it is put on, and on the
 * house off-black the metal reads as metal instead of as a white box on a white
 * page. The builder needed the sheet for a different reason — a rendered
 * diamond refracts what is behind it and goes grey over dark — which does not
 * apply to a photograph that has already been lit.
 */
export const metadata: Metadata = pageMetadata({
  title: "Ring Collection — Engagement Ring Settings",
  description:
    "The settings we make in Hatton Garden — solitaire, halo, trilogy, rubover, vintage and more — photographed under one light. Choose a style, then build it to your own stone, metal and size.",
  path: PATH,
});

export default function RingsPage() {
  const pieces = collectionPieces();
  const stones = collectionStones();

  return (
    <>
      <SiteHeader />

      <main>
        <section className="px-[52px] pt-16 pb-10 max-md:px-6 max-md:pt-12 max-md:pb-8">
          <p className="t-eyebrow">Alpoe London</p>
          <h1 className="t-page mt-3">Ring Collection</h1>
          <p className="mt-6 max-w-[62ch] t-copy">
            Every setting we make in Hatton Garden, photographed under one light so the
            only thing changing between them is the ring itself. Each is
            shown with a one-carat round brilliant in platinum — the constant is
            deliberate, so you are comparing settings rather than stones.
          </p>
          <p className="mt-3 max-w-[62ch] t-copy">
            Found one you like? Take it into the{" "}
            <Link href="/ring-builder" className="text-accent underline underline-offset-4">
              ring builder
            </Link>{" "}
            and specify your own stone, metal and size, or{" "}
            <Link href="/bespoke" className="text-accent underline underline-offset-4">
              start from a sketch
            </Link>
            .
          </p>
        </section>

        {/* A grid rather than the builder's rails. A rail is right when the
            options are a control you are picking from; this is a catalogue you
            are browsing, and a catalogue that hides fourteen of its seventeen
            pieces off the right-hand edge is hiding the collection. */}
        <ScrollReveal>
          <section className="px-[52px] pb-16 max-md:px-6 max-md:pb-12">
            <ul className="grid grid-cols-4 gap-x-6 gap-y-10 max-lg:grid-cols-3 max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-8">
              {pieces.map((piece) => (
                <li key={piece.id}>
                  <Link
                    href={piece.builderHref}
                    data-haptic
                    className="group block"
                    title={piece.description}
                  >
                    {/* White behind the cut-out, not the page ground: these are
                        lit as product shots on a white sweep, and dropping one
                        onto off-black keeps the highlights but loses the
                        shadow they were lit against. */}
                    <span className="relative block aspect-square w-full overflow-hidden bg-white">
                      <Image
                        src={piece.image}
                        alt={`${piece.label} engagement ring setting`}
                        fill
                        sizes="(max-width: 767px) 46vw, (max-width: 1023px) 30vw, 22vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </span>
                    <h2 className="t-card mt-4">{piece.label}</h2>
                    <p className="mt-1.5 t-copy">{piece.description}</p>
                    <p className="mt-3 text-[10px] tracking-[0.2em] uppercase text-accent transition group-hover:text-accent-deep">
                      Build this ring
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>

        {/* The stones came across with the rings — same shoot, same set — and
            they belong under them rather than beside them: a cut is chosen
            after a setting, not instead of one. */}
        {stones.length > 0 && (
          <ScrollReveal>
            <section className="border-t border-fg/[0.10] px-[52px] py-16 max-md:px-6 max-md:py-12">
              <h2 className="t-sub">Diamond shapes</h2>
              <p className="mt-4 max-w-[62ch] t-copy">
                The cuts we set, in order of what Britain actually buys. Round and oval
                together are close to seven in ten British engagement rings; the rest are
                the ones worth knowing about before you decide.
              </p>
              <ul className="mt-10 grid grid-cols-8 gap-4 max-lg:grid-cols-4 max-sm:grid-cols-4">
                {stones.map((stone) => (
                  <li key={stone.id}>
                    <span className="relative block aspect-square w-full overflow-hidden bg-white">
                      <Image
                        src={stone.image}
                        alt={`${stone.label} cut diamond`}
                        fill
                        sizes="(max-width: 1023px) 22vw, 11vw"
                        className="object-cover"
                      />
                    </span>
                    <p className="mt-3 text-center text-[10px] leading-tight tracking-[0.12em] uppercase text-fg/65">
                      {stone.label}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <section className="border-t border-fg/[0.10] px-[52px] py-16 max-md:px-6 max-md:py-12">
            <p className="max-w-[64ch] t-copy">
              Every ring is made to order, cast and hand-set once you have approved a CAD
              design. Prices depend on the stone, so they are quoted rather than listed,
              and we handle your booking privately as a one-to-one service —{" "}
              <Link
                href="/book-appointment"
                className="text-accent underline underline-offset-4"
              >
                book an appointment
              </Link>{" "}
              and we will show you comparable diamonds either side of your budget.
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
                { name: "Ring Collection", url: siteUrl(PATH) },
              ]),
              ...collectionLd({
                name: "Ring Collection",
                description:
                  "Engagement ring settings hand-made by Alpoe London in Hatton Garden.",
                path: PATH,
                products: pieces.map((p) => ({
                  title: `${p.label} Engagement Ring`,
                  url: p.builderHref,
                })),
              }),
            ]),
          ),
        }}
      />
    </>
  );
}
