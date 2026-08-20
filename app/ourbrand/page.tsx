import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import ScrollReveal from "../components/ScrollReveal";
import MerchandiseStrip from "../components/MerchandiseStrip";
import BrandModelViewer from "./BrandModelViewer";
import { pageMetadata, ldJsonGraph, breadcrumbLd } from "@/lib/seo";
import { SITE, siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Our Brand — The Alpoe London Mark",
  description:
    "The Alpoe London lockup, modelled and rendered in rose gold. Rotate the mark in your browser, and see the orthographic views the artwork is drawn from.",
  path: "/ourbrand",
});

/**
 * Orthographic stills rendered out of the same Blender scene as the GLB, so
 * the flat views and the live model can never drift apart.
 */
const VIEWS = [
  {
    src: "/brand-views/alpoe-lockup-view-left-v3.webp",
    caption: "Left elevation",
    note: "The 5 mm extrusion, read edge-on.",
  },
  {
    src: "/brand-views/alpoe-lockup-view-right-v3.webp",
    caption: "Right elevation",
    note: "Bevel catching the key light along the return.",
  },
  {
    src: "/brand-views/alpoe-lockup-view-top-v3.webp",
    caption: "Plan, from above",
    note: "Every element sits on one plane — no stepping.",
  },
  {
    src: "/brand-views/alpoe-lockup-view-bottom-v3.webp",
    caption: "Plan, from below",
    note: "The underside carries the same bevel as the face.",
  },
] as const;

export default function OurBrandPage() {
  const ld = ldJsonGraph([
    {
      "@type": "WebPage",
      "@id": siteUrl("/ourbrand") + "#ourbrand",
      url: siteUrl("/ourbrand"),
      name: `Our Brand — ${SITE.name}`,
      description:
        "The Alpoe London mark modelled in three dimensions, viewable and rotatable in the browser.",
    },
    breadcrumbLd([
      { name: "Home", url: siteUrl("/") },
      { name: "Our Brand", url: siteUrl("/ourbrand") },
    ]),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        {/* Same reasoning as the ring builder: the model is the page, so the
            heading is announced rather than drawn. Without it this route had
            no <h1> at all. */}
        <h1 className="sr-only">
          The Alpoe London mark — our brand identity in three dimensions
        </h1>

        {/* ---------------------------------------------------------------
            THE LIVE MODEL. Height is capped in vh so the section can never
            grow taller than the viewport, and floored in px so it stays
            usable on a short landscape phone. The top margin clears the fixed
            header, which the page's hero copy used to do.
            --------------------------------------------------------------- */}
        <section
          aria-label="Interactive 3D model of the Alpoe London lockup"
          className="relative mx-[52px] mt-36 h-[62vh] min-h-[380px] max-h-[720px] overflow-hidden rounded-sm border border-fg/[0.10] bg-panel-soft max-md:mx-6 max-md:mt-28 max-md:h-[52vh]"
        >
          <BrandModelViewer />
        </section>

        {/*
          Some words.

          This page carried about ten of them — a 3D canvas, four images and
          nothing a reader or a crawler could get hold of. A page nothing can
          read is a page nothing can rank, and it had just been linked from the
          footer, so it needed to be worth arriving at. Everything here is
          true and specific: the mark really is modelled rather than drawn, and
          the elevations below really are rendered from that model.
        */}
        <section className="px-[52px] pt-12 max-md:px-6 max-md:pt-9">
          <ScrollReveal>
            <h2 className="t-section">A mark built rather than drawn</h2>
            <p className="mt-4 max-w-[64ch] t-copy">
              The Alpoe London lockup — the AP monogram, the wordmark and the
              frame rules around them — exists first as geometry. It was modelled
              in three dimensions, given a 5&nbsp;mm extrusion and a bevelled
              edge, and finished in the same rose gold the house works in, so
              the mark catches light the way a piece of jewellery does rather
              than the way a logo does.
            </p>
            <p className="mt-4 max-w-[64ch] t-copy">
              Everything else follows from that single model. The viewer above
              loads the mesh itself. The flat artwork used across the site is
              traced from the same geometry rather than redrawn, and the four
              elevations below are orthographic renders of it — which is why
              the bevel reads identically at every size, on every page, and why
              the version in the header cannot drift away from the version on
              a business card.
            </p>
            <p className="mt-4 max-w-[64ch] t-copy">
              It is a deliberate piece of an otherwise quiet identity. A house
              that makes things by hand in{" "}
              <Link href="/about" className="text-accent underline underline-offset-4">
                Hatton Garden
              </Link>{" "}
              should have a mark that was made rather than picked, and the
              rose gold is the same metal that turns up in half of what leaves
              the{" "}
              <Link href="/bespoke" className="text-accent underline underline-offset-4">
                workshop
              </Link>
              .
            </p>
          </ScrollReveal>
        </section>

        {/* ---------------------------------------------------------------
            THE FOUR VIEWS — two columns of squares. aspect-square on the
            cell rather than the image keeps all four aligned on a strict
            grid no matter how the subject sits inside its frame. Captions
            are carried in alt text only; the page shows no copy.
            --------------------------------------------------------------- */}
        <section
          aria-label="Orthographic elevations of the Alpoe London lockup"
          className="px-[52px] py-16 max-md:px-6 max-md:py-10"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-8 max-md:grid-cols-1">
            {VIEWS.map((view) => (
              <ScrollReveal key={view.src}>
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-sm border border-fg/[0.08] bg-panel-soft">
                  <Image
                    src={view.src}
                    alt={`Alpoe London lockup, ${view.caption.toLowerCase()}`}
                    width={1400}
                    height={1400}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-full w-full object-contain"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <MerchandiseStrip tall />
      </main>
      <Footer />
      <WhatsAppButton />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
