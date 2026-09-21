import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import BrandHero from "../../components/BrandHero";
import ScrollReveal from "../../components/ScrollReveal";
import FAQ from "../../components/FAQ";
import CTAStrip from "../../components/CTAStrip";
import { BIRMINGHAM } from "@/lib/locations/copy";
import { pageMetadata, ldJsonGraph, breadcrumbLd, faqLd, truncateForSerp } from "@/lib/seo";
import { siteUrl, locationBySlug } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

/**
 * "engagement rings birmingham", and the jewellery half of the Birmingham
 * spine.
 *
 * This is the stronger half. The Birmingham watch pages are capped by stock —
 * there is one Hublot on the whole site, so /birmingham/watches/hublot chases
 * a 49-impression query with a single product to show — whereas a commission
 * needs no inventory at all. Every Birmingham customer who wants a ring made
 * can be served completely, today, which makes this the one Birmingham page
 * whose ranking is not gated on a buying decision.
 */

const PATH = ROUTES.birminghamEngagementRings;
const LOCATION = locationBySlug("birmingham")!;

export const metadata: Metadata = pageMetadata({
  title: "Bespoke Engagement Rings Birmingham",
  description: truncateForSerp(
    "Commission a bespoke engagement ring in Birmingham. Your design, your stone, hand-set by our own benches. Natural or laboratory-grown diamonds, GIA certified, collected in Birmingham.",
  ),
  path: PATH,
  image: "/og/ring-size-guide.jpg",
});

export default function BirminghamEngagementRingsPage() {
  const { rings } = BIRMINGHAM;

  const ld = ldJsonGraph([
    breadcrumbLd([
      { name: "Home", url: "/" },
      { name: "Birmingham", url: ROUTES.birmingham },
      { name: "Engagement Rings", url: PATH },
    ]),
    {
      "@type": "Service",
      "@id": siteUrl(PATH) + "#service",
      name: "Bespoke engagement rings in Birmingham",
      serviceType:
        "Bespoke engagement ring design, diamond sourcing and stone setting",
      areaServed: LOCATION.areaServed.map((name) => ({
        "@type": "Place",
        name,
      })),
      provider: { "@id": `${siteUrl()}/#localbusiness-birmingham` },
    },
    faqLd(rings.faqs),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Birmingham"
          title="Bespoke Engagement Rings in Birmingham"
          copy={rings.intro}
        />

        <section className="px-[52px] py-4 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Birmingham", href: ROUTES.birmingham },
              { name: "Engagement Rings", href: PATH, current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-14 max-md:px-6">
          <ScrollReveal>
            <p className="max-w-[68ch] t-copy">{rings.context}</p>
          </ScrollReveal>
        </section>

        <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">How a commission works</h2>
          </ScrollReveal>
          <ol className="mt-8 grid grid-cols-2 gap-x-10 gap-y-9 max-md:grid-cols-1">
            {rings.steps.map((st, i) => (
              <ScrollReveal key={st.heading} delay={i * 0.06}>
                <li className="border-t border-accent/40 pt-4">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-serif text-[19px] leading-tight text-blush">
                    {st.heading}
                  </h3>
                  <p className="mt-3 t-copy">{st.copy}</p>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </section>

        <section className="border-t border-fg/10 bg-panel-soft px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">Start from a shape, or from scratch</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              Most commissions begin with a diamond shape and a rough budget.
              If you would rather see it before you talk to anyone, the ring
              builder prices a setting and a stone live.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
              <li>
                <Link
                  href={ROUTES.ringBuilder}
                  className="text-fg/60 transition-colors hover:text-accent"
                >
                  Build a ring
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.engagementAndWeddingRings}
                  className="text-fg/60 transition-colors hover:text-accent"
                >
                  Engagement &amp; wedding rings
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.readyToShipRings}
                  className="text-fg/60 transition-colors hover:text-accent"
                >
                  Ready to ship
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.ringSizeGuide}
                  className="text-fg/60 transition-colors hover:text-accent"
                >
                  Ring size guide
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.guideLabGrownDiamonds}
                  className="text-fg/60 transition-colors hover:text-accent"
                >
                  Natural vs lab-grown
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.bespoke}
                  className="text-fg/60 transition-colors hover:text-accent"
                >
                  All bespoke work
                </Link>
              </li>
            </ul>
          </ScrollReveal>
        </section>

        <FAQ items={rings.faqs} />

        <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">Also at the Birmingham counter</h2>
            <p className="mt-4 max-w-[68ch] t-copy">
              We buy and part-exchange luxury watches in Birmingham as well —{" "}
              <Link
                href={ROUTES.birmingham}
                className="text-accent underline underline-offset-4"
              >
                everything at the Birmingham counter
              </Link>{" "}
              covers both sides.
            </p>
          </ScrollReveal>
        </section>

        <CTAStrip
          eyebrow="Birmingham"
          title="Tell us the brief"
          copy="The occasion, the stone you have in mind and the budget you are working to. A design comes back before anything is cut, and nothing is committed until you are happy with it."
          whatsappMessage="Hi Alpoe — I'd like to commission an engagement ring, starting at your Birmingham counter."
          secondary={{ label: "Book a time", href: ROUTES.bookAppointment }}
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
