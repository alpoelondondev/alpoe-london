import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../../components/SiteHeader";
import Footer from "../../../components/Footer";
import WhatsAppButton from "../../../components/WhatsAppButton";
import Breadcrumbs from "../../../components/Breadcrumbs";
import BrandHero from "../../../components/BrandHero";
import ScrollReveal from "../../../components/ScrollReveal";
import FAQ from "../../../components/FAQ";
import CTAStrip from "../../../components/CTAStrip";
import { sellBrandBySlug } from "@/lib/sell/brands";
import { BIRMINGHAM, birminghamSellBrands } from "@/lib/locations/copy";
import { pageMetadata, ldJsonGraph, faqLd, truncateForSerp } from "@/lib/seo";
import { siteUrl, locationBySlug } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

/**
 * "Sell my rolex birmingham" and its siblings.
 *
 * ── How this differs from /sell/[brand], and why that matters ──
 *
 * The valuation facts are shared, deliberately. `valueDrivers`, `models` and
 * `papers` are read straight out of lib/sell/brands.ts, because what moves a
 * Royal Oak's price does not change between Birmingham and London, and writing
 * a second copy would guarantee the two pages eventually contradict each other
 * on something a seller is relying on.
 *
 * What is written fresh is the part that is genuinely local: the opening
 * paragraph, which is about that brand's specific problem in the West Midlands
 * market — who is quoting these sellers today and on what basis. See
 * BIRMINGHAM.sellIntros. Those paragraphs would not read correctly with the
 * city swapped out, which is the line between a location page and a doorway
 * page.
 *
 * This is a real duplication risk and it is worth watching in Search Console.
 * If these pages end up reported as "Duplicate, Google chose a different
 * canonical", the answer is to give them more genuinely local substance or to
 * cut them back to the /birmingham hub alone — not to canonicalise them at
 * /sell/[brand], which would make them pointless.
 */

type RouteParams = { brand: string };

export async function generateStaticParams() {
  return birminghamSellBrands().map((b) => ({ brand: b.slug }));
}

export async function generateMetadata(
  props: { params: Promise<RouteParams> },
): Promise<Metadata> {
  const { brand } = await props.params;
  const b = sellBrandBySlug(brand);
  if (!b || !(b.slug in BIRMINGHAM.sellIntros)) return {};
  return pageMetadata({
    // The query, near enough verbatim: "sell my rolex birmingham".
    title: `Sell Your ${b.title} in Birmingham`,
    description: truncateForSerp(
      `Sell or part-exchange your ${b.name} at Alpoe's Birmingham counter. Priced by reference, not by brand. Free no-obligation valuation, paid the same day by bank transfer.`,
    ),
    path: ROUTES.birminghamSellBrand(b.slug),
    image: "/og/sell.jpg",
  });
}

export default async function BirminghamSellBrandPage(
  props: { params: Promise<RouteParams> },
) {
  const { brand } = await props.params;
  const b = sellBrandBySlug(brand);
  if (!b) notFound();

  const localIntro = BIRMINGHAM.sellIntros[b.slug];
  // A sell brand with no Birmingham paragraph written for it does not get a
  // Birmingham page. Falling back to the London copy would be exactly the
  // doorway page this spine is designed not to be.
  if (!localIntro) notFound();

  const PATH = ROUTES.birminghamSellBrand(b.slug);
  const LOCATION = locationBySlug("birmingham")!;
  const others = birminghamSellBrands().filter((o) => o.slug !== b.slug);

  const ld = ldJsonGraph([
    {
      "@type": "Service",
      "@id": siteUrl(PATH) + "#service",
      name: `Sell your ${b.name} in Birmingham`,
      serviceType: `${b.name} watch buying, part-exchange and valuation`,
      areaServed: LOCATION.areaServed.map((name) => ({
        "@type": "Place",
        name,
      })),
      provider: { "@id": `${siteUrl()}/#localbusiness-birmingham` },
    },
    faqLd(b.faqs),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Sell & Trade · Birmingham"
          title={`Sell Your ${b.title} in Birmingham`}
          copy={localIntro}
        />

        <section className="px-[52px] py-4 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Birmingham", href: ROUTES.birmingham },
              { name: `Sell your ${b.name}`, href: PATH, current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-14 max-md:px-6">
          <ScrollReveal>
            <p className="max-w-[68ch] t-copy">{b.intro}</p>
          </ScrollReveal>
        </section>

        <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">What moves the number on a {b.name}</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              The same desk prices both counters, so this is what is being
              looked at whether you come to Birmingham or to Hatton Garden.
            </p>
          </ScrollReveal>
          <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-9 max-md:grid-cols-1">
            {b.valueDrivers.map((d, i) => (
              <ScrollReveal key={d.heading} delay={i * 0.06}>
                <div className="border-t border-accent/40 pt-4">
                  <h3 className="font-serif text-[19px] leading-tight text-blush">
                    {d.heading}
                  </h3>
                  <p className="mt-3 t-copy">{d.copy}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="border-t border-fg/10 bg-panel-soft px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">{b.name} references we buy</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              Not a complete list — we buy the whole catalogue. These are the
              ones the desk is asked about most.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-10 gap-y-6 max-md:grid-cols-1">
              {b.models.map((m) => (
                <div key={m.name} className="border-t border-fg/[0.10] pt-4">
                  <dt className="text-[13px] uppercase tracking-[0.1em] text-blush">
                    {m.name}
                  </dt>
                  <dd className="mt-2 t-copy">{m.note}</dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </section>

        <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">Box, papers and provenance</h2>
            <p className="mt-4 max-w-[68ch] t-copy">{b.papers}</p>
          </ScrollReveal>
        </section>

        <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">Birmingham or London</h2>
            <p className="mt-4 max-w-[68ch] t-copy">
              Both counters buy on identical terms — one desk, one set of
              figures, so there is nothing to be gained by trying the two
              against each other. Use whichever is the shorter journey, or send
              the watch by insured tracked courier and skip the journey
              altogether. If London is easier,{" "}
              <Link
                href={ROUTES.sellBrand(b.slug)}
                className="text-accent underline underline-offset-4"
              >
                sell your {b.name} in Hatton Garden
              </Link>{" "}
              covers the same ground for the London counter.
            </p>
          </ScrollReveal>
        </section>

        <FAQ items={b.faqs} />

        <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">Selling something else in Birmingham?</h2>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={ROUTES.birminghamSellBrand(o.slug)}
                    className="text-fg/60 transition-colors hover:text-accent"
                  >
                    Sell your {o.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={ROUTES.birmingham}
                  className="text-fg/60 transition-colors hover:text-accent"
                >
                  The Birmingham counter
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.birminghamWatchBrand(b.slug)}
                  className="text-fg/60 transition-colors hover:text-accent"
                >
                  Buy a {b.name} instead
                </Link>
              </li>
            </ul>
          </ScrollReveal>
        </section>

        <CTAStrip
          eyebrow={`Sell your ${b.name}`}
          title="Send the reference, get a figure today"
          copy={`Reference number, year and a few photographs. You will have a no-obligation figure on your ${b.name} the same day, at either counter.`}
          whatsappMessage={`Hi Alpoe — I'd like a valuation on my ${b.name} at your Birmingham counter.`}
          secondary={{ label: "All of Birmingham", href: ROUTES.birmingham }}
        />
      </main>
      <Footer />
      <WhatsAppButton />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
