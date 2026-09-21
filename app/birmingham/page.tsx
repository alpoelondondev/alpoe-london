import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ScrollReveal from "../components/ScrollReveal";
import FAQ from "../components/FAQ";
import CTAStrip from "../components/CTAStrip";
import { WATCH_BRANDS } from "@/lib/taxonomy";
import { BIRMINGHAM, birminghamSellBrands } from "@/lib/locations/copy";
import { pageMetadata, ldJsonGraph, breadcrumbLd, faqLd, truncateForSerp } from "@/lib/seo";
import { locationBySlug } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

/**
 * The Birmingham hub.
 *
 * ── Why this page exists ──
 *
 * The shop has been there the whole time and the site never said so. In the
 * three months to 2026-09-19, "hublot birmingham" drew 49 impressions — the
 * largest non-brand query this site has, larger than any London term — at an
 * average position of 61, against pages that do not contain the word
 * Birmingham. Meanwhile /guides/selling-a-luxury-watch-in-london was actively
 * telling Birmingham sellers to travel to Hatton Garden.
 *
 * So this is the page that term should have been resolving to, and it is the
 * root the rest of the Birmingham spine hangs from: /birmingham/sell/[brand]
 * and /birmingham/watches/[brand] both link back here, and this links down to
 * both.
 *
 * ── What it deliberately does not claim ──
 *
 * No street address, no postcode, no coordinates, no map. Those are not known
 * at the time of writing and an invented one is a wrong NAP, which actively
 * breaks the match between this site and the Google Business Profile it is
 * meant to reinforce. The FAQ says to call for the address, which is true and
 * useful, rather than printing something plausible and wrong. Fill them into
 * LOCATIONS in lib/site.ts and this page, the schema and the map all improve
 * at once.
 */

const PATH = ROUTES.birmingham;
const LOCATION = locationBySlug("birmingham")!;

export const metadata: Metadata = pageMetadata({
  // "Luxury Watches Birmingham" and "sell my watch Birmingham" are the terms.
  // The city leads, because the city is the part that is new information.
  title: "Alpoe Birmingham — Luxury Watches, Bought and Sold",
  description: truncateForSerp(
    "Alpoe's Birmingham counter buys and part-exchanges luxury watches — Rolex, Audemars Piguet, Patek Philippe, Hublot, Cartier and Omega — priced by reference rather than by brand. Free valuation, no obligation, paid by bank transfer.",
  ),
  path: PATH,
  image: "/og/sell.jpg",
});

export default function BirminghamPage() {
  const sellBrands = birminghamSellBrands();

  const ld = ldJsonGraph([
    breadcrumbLd([
      { name: "Home", url: "/" },
      { name: "Birmingham", url: PATH },
    ]),
    faqLd(BIRMINGHAM.faqs),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Our shops"
          title="Alpoe Birmingham"
          copy={BIRMINGHAM.intro}
        />

        <section className="px-[52px] py-4 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Birmingham", href: PATH, current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-14 max-md:px-6">
          <ScrollReveal>
            <p className="max-w-[68ch] t-copy">{BIRMINGHAM.context}</p>
          </ScrollReveal>
        </section>

        <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">Why bring a watch here</h2>
          </ScrollReveal>
          <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-9 max-md:grid-cols-1">
            {BIRMINGHAM.advantages.map((a, i) => (
              <ScrollReveal key={a.heading} delay={i * 0.06}>
                <div className="border-t border-accent/40 pt-4">
                  <h3 className="font-serif text-[19px] leading-tight text-blush">
                    {a.heading}
                  </h3>
                  <p className="mt-3 t-copy">{a.copy}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">Bespoke engagement rings in Birmingham</h2>
            <p className="mt-4 max-w-[68ch] t-copy">
              Talk the brief through at the counter, approve the design, and
              collect the finished ring in Birmingham.{" "}
              <Link
                href={ROUTES.birminghamEngagementRings}
                className="text-accent underline underline-offset-4"
              >
                Commission an engagement ring in Birmingham
              </Link>{" "}
              sets out how it works.
            </p>
          </ScrollReveal>
        </section>

        <section className="border-t border-fg/10 bg-panel-soft px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">Sell your watch in Birmingham</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              A page per maker, because what moves the number is different for
              each of them. Each one sets out what the desk looks at, which
              references it is asked after most, and what the paperwork is
              actually worth.
            </p>
            <ul className="mt-8 grid grid-cols-3 gap-x-8 gap-y-4 max-md:grid-cols-1">
              {sellBrands.map((b) => (
                <li key={b.slug} className="border-t border-fg/[0.10] pt-4">
                  <Link
                    href={ROUTES.birminghamSellBrand(b.slug)}
                    className="font-serif text-[19px] leading-tight text-blush transition-colors hover:text-accent"
                  >
                    Sell your {b.name} in Birmingham
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </section>

        <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">Watches to view in Birmingham</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              The whole of our stock can be seen at either counter. Tell us
              which piece and which shop and we will have it there.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
              {WATCH_BRANDS.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={ROUTES.birminghamWatchBrand(b.slug)}
                    className="text-fg/60 transition-colors hover:text-accent"
                  >
                    {b.name} in Birmingham
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </section>

        <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">Where we are</h2>
            <p className="mt-4 max-w-[68ch] t-copy">
              Two counters. {LOCATION.city}, {LOCATION.addressRegion}, and{" "}
              <Link
                href={ROUTES.contact}
                className="text-accent underline underline-offset-4"
              >
                Hatton Garden in London
              </Link>
              . Both work from the same stock and the same valuation desk, so
              the only thing that changes between them is your journey.
            </p>
            <p className="mt-4 max-w-[68ch] t-copy">
              Call or message before travelling and we will confirm the address
              and that a watch specialist is on the counter —{" "}
              <Link
                href={ROUTES.bookAppointment}
                className="text-accent underline underline-offset-4"
              >
                book a time
              </Link>{" "}
              if you would rather have it fixed.
            </p>
          </ScrollReveal>
        </section>

        <FAQ items={BIRMINGHAM.faqs} />

        <CTAStrip
          eyebrow="Birmingham"
          title="Send the reference, get a figure today"
          copy="Reference number, year and a few photographs is all it takes. No obligation, and we will tell you what the paperwork is worth before you decide anything."
          whatsappMessage="Hi Alpoe — I'd like a valuation at your Birmingham counter."
          secondary={{ label: "Sell & Trade", href: ROUTES.sell }}
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
