import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ScrollReveal from "../components/ScrollReveal";
import { pageMetadata, ldJsonGraph, breadcrumbLd } from "@/lib/seo";
import { SITE, siteUrl } from "@/lib/site";
import { ROUTES } from "@/lib/routes";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title: "Merchandise — The Alpoe London Cap",
  description:
    "The Alpoe London trucker cap: black suede-finish front, breathable mesh back and the AP lockup embroidered in raised white thread. In store now in Hatton Garden.",
  path: ROUTES.merchandise,
  image: "/merchandise/alpoe-london-suede-trucker-cap-front.webp",
});

/**
 * Shot on the counter and in hand at the shop. The first is the lead image;
 * the rest run as a grid beneath it. Two were cropped to the cap at export so
 * no customer in the background ends up on the page.
 */
const PHOTOS = [
  {
    src: "/merchandise/alpoe-london-suede-trucker-cap-front.webp",
    alt: "Black Alpoe London trucker cap, front on, with the AP monogram and Alpoe London lockup embroidered in white",
  },
  {
    src: "/merchandise/alpoe-london-suede-trucker-cap-embroidery.webp",
    alt: "The Alpoe London cap held in hand, showing the raised white embroidery on the suede-finish front",
  },
  {
    src: "/merchandise/alpoe-london-suede-trucker-cap-side.webp",
    alt: "Side view of the Alpoe London cap showing the black mesh back panels",
  },
  {
    src: "/merchandise/alpoe-london-suede-trucker-cap-profile.webp",
    alt: "The Alpoe London cap in profile on a display counter",
  },
  {
    src: "/merchandise/alpoe-london-suede-trucker-cap-back.webp",
    alt: "Back of the Alpoe London cap, with the mesh crown and adjustable snapback strap",
  },
] as const;

const DETAILS = [
  "Black suede-finish front panels",
  "AP monogram and Alpoe London lockup in raised white embroidery",
  "Breathable black mesh back",
  "Adjustable snapback strap — one size",
] as const;

export default function MerchandisePage() {
  const [lead, ...rest] = PHOTOS;
  const enquire = buildGeneralWhatsAppUrl(
    "Hi Alpoe, I'd like to ask about the Alpoe London cap.",
  );

  const ld = ldJsonGraph([
    {
      "@type": "WebPage",
      "@id": siteUrl(ROUTES.merchandise) + "#merchandise",
      url: siteUrl(ROUTES.merchandise),
      name: `Merchandise — ${SITE.name}`,
      description: "The Alpoe London embroidered trucker cap, available in store.",
    },
    breadcrumbLd([
      { name: "Home", url: siteUrl("/") },
      { name: "Merchandise", url: siteUrl(ROUTES.merchandise) },
    ]),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Merchandise"
          title="The Alpoe London Cap"
          copy="Our first piece of merchandise: a black trucker cap carrying the AP lockup in raised white embroidery. In store now."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Merchandise", href: ROUTES.merchandise, current: true },
            ]}
          />
        </section>

        <section
          aria-label="The Alpoe London cap"
          className="px-[52px] pb-12 max-md:px-6 grid grid-cols-2 gap-10 items-center max-md:grid-cols-1 max-md:gap-8"
        >
          <ScrollReveal>
            <div className="relative aspect-square overflow-hidden rounded-sm border border-fg/[0.08] bg-panel-soft">
              <Image
                src={lead.src}
                alt={lead.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h2 className="t-section">Suede trucker cap</h2>
            <ul className="mt-6 space-y-3 t-copy">
              {DETAILS.map((d) => (
                <li key={d} className="flex gap-3">
                  <span aria-hidden="true" className="text-accent">—</span>
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[56ch] t-copy">
              Pick one up at the counter in Hatton Garden, or message us and
              we&apos;ll put one aside for you.
            </p>
            <a
              href={enquire}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block border border-accent/60 px-6 py-3 text-[12px] uppercase tracking-[0.18em] text-accent transition hover:bg-accent/10"
            >
              Ask about the cap
            </a>
          </ScrollReveal>
        </section>

        <section
          aria-label="More views of the Alpoe London cap"
          className="px-[52px] pb-16 max-md:px-6 max-md:pb-10"
        >
          <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2 max-md:gap-3">
            {rest.map((p, i) => (
              <ScrollReveal key={p.src} delay={i * 0.06}>
                <div className="relative aspect-square overflow-hidden rounded-sm border border-fg/[0.08] bg-panel-soft">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
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
