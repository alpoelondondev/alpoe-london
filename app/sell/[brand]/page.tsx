import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import BrandHero from "../../components/BrandHero";
import ScrollReveal from "../../components/ScrollReveal";
import FAQ from "../../components/FAQ";
import CTAStrip from "../../components/CTAStrip";
import { SELL_BRANDS, sellBrandBySlug } from "@/lib/sell/brands";
import { pageMetadata, ldJsonGraph, faqLd, truncateForSerp } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

/**
 * "Sell my rolex london", "where can i sell my patek philippe watch", "sell my
 * cartier watch london", "part exchange my rolex", "sell my rolex no box or
 * papers" — a whole cluster of transactional queries with low competition and
 * about as much buying intent as a query can carry, and until now the site met
 * every one of them with a single generic /sell page.
 *
 * The two Hatton Garden businesses that do rank for these built exactly this:
 * a hub with a page per brand. This is that, for the five makers where the
 * demand is real and where there is genuinely different advice to give. See
 * lib/sell/brands.ts for why five and not eleven.
 */

type RouteParams = { brand: string };

export async function generateStaticParams() {
  return SELL_BRANDS.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata(
  props: { params: Promise<RouteParams> },
): Promise<Metadata> {
  const { brand } = await props.params;
  const b = sellBrandBySlug(brand);
  if (!b) return {};
  return pageMetadata({
    // "Sell Your Rolex in London" is the query, near enough verbatim.
    title: `Sell Your ${b.title} in London`,
    description: truncateForSerp(
      `Sell or part-exchange your ${b.name} with Alpoe London. Free no-obligation valuation, authenticated at our Hatton Garden counter, paid the same day by bank transfer.`,
    ),
    path: `/sell/${b.slug}`,
    image: "/og/sell.jpg",
  });
}

export default async function SellBrandPage(props: { params: Promise<RouteParams> }) {
  const { brand } = await props.params;
  const b = sellBrandBySlug(brand);
  if (!b) notFound();

  const PATH = `/sell/${b.slug}`;

  const ld = ldJsonGraph([
    {
      "@type": "Service",
      "@id": siteUrl(PATH) + "#service",
      name: `Sell your ${b.name}`,
      serviceType: `${b.name} watch buying, part-exchange and valuation`,
      // The desk is in Hatton Garden and the post is insured, so both are true
      // and both are searched.
      areaServed: [
        { "@type": "Place", name: "Hatton Garden, London EC1N" },
        { "@type": "Place", name: "Greater London" },
        { "@type": "Country", name: "United Kingdom" },
      ],
      provider: { "@id": siteUrl("/") + "#localbusiness" },
      description: `Free, no-obligation valuations on pre-owned ${b.name} watches. Authenticated in person at Alpoe London in Hatton Garden, with same-day payment by bank transfer or part-exchange against anything we can source.`,
      url: siteUrl(PATH),
      // No price and no rating. A valuation service has neither, and asserting
      // one to satisfy a validator is a claim we would then have to honour.
      isRelatedTo: { "@id": siteUrl("/sell") + "#service" },
    },
    faqLd(b.faqs),
  ]);

  const others = SELL_BRANDS.filter((o) => o.slug !== b.slug);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Sell With Us"
          title={`Sell Your ${b.title} in London`}
          copy={b.intro}
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Sell & Trade", href: "/sell" },
              { name: b.name, href: PATH, current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-14 max-md:px-6">
          <ScrollReveal>
            <p className="max-w-[68ch] t-copy">{b.context}</p>
          </ScrollReveal>
        </section>

        <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">What moves the number on a {b.name}</h2>
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
              Not a complete list — we buy the whole catalogue. These are the ones
              the desk is asked about most.
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
            <p className="mt-4 max-w-[68ch] t-copy">
              None of it is a condition of sale. We buy watch-only every week, and
              we would rather tell you what the paperwork is worth than have you
              assume it is worth nothing —{" "}
              <Link
                href="/sell#sell-form"
                className="text-accent underline underline-offset-4"
              >
                send the details
              </Link>{" "}
              and you will have both figures.
            </p>
          </ScrollReveal>
        </section>

        <FAQ items={b.faqs} />

        <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">Selling something else?</h2>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/sell/${o.slug}`}
                    className="text-fg/60 transition-colors hover:text-accent"
                  >
                    Sell your {o.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sell" className="text-fg/60 transition-colors hover:text-accent">
                  Every other brand
                </Link>
              </li>
              <li>
                <Link
                  href="/metal-prices"
                  className="text-fg/60 transition-colors hover:text-accent"
                >
                  Live metal prices
                </Link>
              </li>
              <li>
                <Link href="/watches" className="text-fg/60 transition-colors hover:text-accent">
                  Buy a watch instead
                </Link>
              </li>
            </ul>
          </ScrollReveal>
        </section>

        <CTAStrip
          eyebrow="No obligation"
          title={`Get a figure for your ${b.name}`}
          copy="Send the reference, the year and a couple of photographs. No obligation, and no pressure if the number is not what you hoped."
          whatsappMessage={`Hi Alpoe, I'd like a valuation on a ${b.name} I'm looking to sell.`}
          primaryLabel="Get a valuation"
          secondary={{ label: "Book an appointment", href: "/book-appointment" }}
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
