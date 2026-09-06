import Link from "next/link";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import Breadcrumbs from "./Breadcrumbs";
import ScrollReveal from "./ScrollReveal";
import SheetFaq from "./SheetFaq";
import { SERVICE_GUIDES, type ServiceGuide } from "@/lib/services/serviceGuides";
import { ldJsonGraph, faqLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

/**
 * The renderer behind the three service pages.
 *
 * Emits a Service node rather than an Article: this is work somebody can
 * commission, not something to read, and `provider` points at the
 * LocalBusiness the root layout already declares so the service resolves to
 * the Hatton Garden shop rather than floating free.
 */
export default function ServiceGuideView({ guide: g }: { guide: ServiceGuide }) {
  const others = SERVICE_GUIDES.filter((s) => s.slug !== g.slug);

  const ld = ldJsonGraph([
    {
      "@type": "Service",
      "@id": siteUrl(g.path) + "#service",
      name: g.h1,
      serviceType: g.name,
      description: g.description,
      provider: { "@id": siteUrl("/") + "#localbusiness" },
      areaServed: [
        { "@type": "Place", name: "Hatton Garden, London EC1N" },
        { "@type": "Place", name: "Greater London" },
        { "@type": "Country", name: "United Kingdom" },
      ],
      url: siteUrl(g.path),
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
            <Link href={ROUTES.services} className="underline underline-offset-4">
              Services
            </Link>
          </p>
          <h1 className="t-page mt-3">{g.h1}</h1>
          <p className="mt-5 max-w-[64ch] t-copy">{g.intro}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={ROUTES.bookAppointment}
              className="inline-flex min-w-[236px] items-center justify-center bg-accent px-6 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-white transition hover:bg-accent-deep"
            >
              Bring the piece in
            </Link>
            <Link
              href={ROUTES.contact}
              className="inline-flex min-w-[236px] items-center justify-center border border-sheet-ink/25 px-6 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-sheet-ink transition hover:border-sheet-ink/50"
            >
              Ask a question first
            </Link>
          </div>
        </section>

        <section className="px-[52px] pb-10 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Services", href: ROUTES.services },
              { name: g.name, href: g.path, current: true },
            ]}
          />
        </section>

        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-12 max-md:px-6 max-md:py-9">
            <h2 className="t-sub">What the work involves</h2>
            <dl className="mt-6 max-w-3xl divide-y divide-sheet-line border-t border-sheet-line">
              {g.steps.map((st) => (
                <div key={st.heading} className="py-5">
                  <dt className="text-[13px] uppercase tracking-[0.1em] text-sheet-dim">
                    {st.heading}
                  </dt>
                  <dd className="mt-2 t-copy">{st.copy}</dd>
                </div>
              ))}
            </dl>
          </section>
        </ScrollReveal>

        {/* The limits get their own section rather than a footnote. A page
            that only says yes is a sales page; the part a customer cannot get
            anywhere else is what a bench will not do and why. */}
        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-12 max-md:px-6 max-md:py-9">
            <h2 className="t-sub">What to know before you commit</h2>
            <dl className="mt-6 max-w-3xl divide-y divide-sheet-line border-t border-sheet-line">
              {g.limits.map((l) => (
                <div key={l.heading} className="py-5">
                  <dt className="text-[13px] uppercase tracking-[0.1em] text-sheet-dim">
                    {l.heading}
                  </dt>
                  <dd className="mt-2 t-copy">{l.copy}</dd>
                </div>
              ))}
            </dl>
          </section>
        </ScrollReveal>

        <SheetFaq items={g.faqs} />

        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-12 max-md:px-6 max-md:py-9">
            <h2 className="t-sub">Other work we do</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {others.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={s.path}
                    className="t-copy underline underline-offset-4 hover:text-accent"
                  >
                    {s.h1}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={ROUTES.hallmarking}
                  className="t-copy underline underline-offset-4 hover:text-accent"
                >
                  What a British hallmark certifies
                </Link>
              </li>
            </ul>
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
