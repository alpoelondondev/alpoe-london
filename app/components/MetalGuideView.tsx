import Link from "next/link";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import Breadcrumbs from "./Breadcrumbs";
import ScrollReveal from "./ScrollReveal";
import SheetFaq from "./SheetFaq";
import { METAL_GUIDES, type MetalGuide } from "@/lib/rings/metalGuides";
import { ldJsonGraph, faqLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

/**
 * The renderer behind the four metal pages.
 *
 * They are static routes rather than a second dynamic segment because
 * /rings already has one — `[shape]` — and Next.js allows only a single
 * dynamic segment per level. Static children take precedence over it, which
 * is the same mechanism that lets /rings/engagement-and-wedding-rings and
 * /rings/ready-to-ship coexist with the shape guides. Four thin page files
 * sharing this component keeps the URLs exactly where the search phrases
 * want them without touching a route that already works.
 */
export default function MetalGuideView({ guide: g }: { guide: MetalGuide }) {
  const PATH = g.path;
  const others = METAL_GUIDES.filter((m) => m.slug !== g.slug);

  const ld = ldJsonGraph([
    {
      "@type": "Article",
      "@id": siteUrl(PATH) + "#article",
      headline: g.h1,
      description: g.description,
      about: [
        { "@type": "Thing", name: `${g.name} jewellery` },
        { "@type": "Thing", name: "Engagement rings" },
      ],
      author: { "@id": siteUrl("/") + "#organization" },
      publisher: { "@id": siteUrl("/") + "#organization" },
      inLanguage: "en-GB",
      isPartOf: { "@id": siteUrl("/") + "#website" },
      mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(PATH) },
      url: siteUrl(PATH),
    },
    {
      "@type": "Service",
      "@id": siteUrl(PATH) + "#service",
      name: `${g.h1}, made to order`,
      serviceType: "Bespoke engagement ring commission",
      description: `${g.h1} designed with you and made to order at Alpoe London's bench in Hatton Garden, hallmarked at the London Assay Office.`,
      provider: { "@id": siteUrl("/") + "#localbusiness" },
      areaServed: [
        { "@type": "Place", name: "Hatton Garden, London EC1N" },
        { "@type": "Place", name: "Greater London" },
        { "@type": "Country", name: "United Kingdom" },
      ],
      url: siteUrl(PATH),
    },
    // Every question below is rendered on the page by <SheetFaq>.
    faqLd(g.faqs),
  ]);

  return (
    <>
      <SiteHeader />

      <main className="on-sheet bg-white">
        <section className="clears-nav px-[52px] pb-8 max-md:px-6 max-md:pb-6">
          <p className="t-eyebrow font-semibold">
            <Link href={ROUTES.rings} className="underline underline-offset-4">
              Rings
            </Link>
          </p>
          <h1 className="t-page mt-3">{g.h1}</h1>
          <p className="mt-5 max-w-[64ch] t-copy">{g.intro}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={ROUTES.ringBuilder}
              className="inline-flex min-w-[236px] items-center justify-center bg-accent px-6 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-white transition hover:bg-accent-deep"
            >
              Build a {g.name} ring
            </Link>
            <Link
              href={ROUTES.bookAppointment}
              className="inline-flex min-w-[236px] items-center justify-center border border-sheet-ink/25 px-6 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-sheet-ink transition hover:border-sheet-ink/50"
            >
              See the metals in person
            </Link>
          </div>
        </section>

        <section className="px-[52px] pb-10 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Rings", href: ROUTES.rings },
              { name: g.h1, href: PATH, current: true },
            ]}
          />
        </section>

        {/* The one fact that most changes the decision, given its own block
            rather than buried in a list — on these four pages it is usually
            the thing the buyer has not been told. */}
        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-12 max-md:px-6 max-md:py-9">
            <h2 className="t-sub">{g.headline.label}</h2>
            <p className="mt-4 max-w-[68ch] t-copy">{g.headline.copy}</p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-12 max-md:px-6 max-md:py-9">
            <h2 className="t-sub">What to know about {g.name}</h2>
            <dl className="mt-6 max-w-3xl divide-y divide-sheet-line border-t border-sheet-line">
              {g.facts.map((f) => (
                <div key={f.heading} className="py-5">
                  <dt className="text-[13px] uppercase tracking-[0.1em] text-sheet-dim">
                    {f.heading}
                  </dt>
                  <dd className="mt-2 t-copy">{f.copy}</dd>
                </div>
              ))}
            </dl>
          </section>
        </ScrollReveal>

        <SheetFaq items={g.faqs} />

        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-12 max-md:px-6 max-md:py-9">
            <h2 className="t-sub">Compare the other metals</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {others.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={m.path}
                    className="t-copy underline underline-offset-4 hover:text-accent"
                  >
                    {m.h1}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[64ch] t-copy">
              Still deciding? Bring the question to the counter &mdash; the
              difference between platinum and white gold on a hand is obvious in
              a second and impossible in a photograph.{" "}
              <Link
                href={ROUTES.bookAppointment}
                className="text-accent underline underline-offset-4"
              >
                Book a time
              </Link>
              , or{" "}
              <Link
                href={ROUTES.ringBuilder}
                className="text-accent underline underline-offset-4"
              >
                specify a ring yourself
              </Link>{" "}
              and choose the metal as you go.
            </p>
          </section>
        </ScrollReveal>
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
