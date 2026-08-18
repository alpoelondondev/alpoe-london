import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ScrollReveal from "../components/ScrollReveal";
import CTAStrip from "../components/CTAStrip";
import FAQ from "../components/FAQ";
import FindUs from "../components/FindUs";
import { ABOUT_FAQS } from "@/lib/faqs";
import { pageMetadata, ldJsonGraph, faqLd, breadcrumbLd } from "@/lib/seo";
import { SITE, siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About Alpoe London — Hatton Garden Jewellers & Watch Specialists",
  description:
    "Alpoe London is a Hatton Garden house dealing in bespoke diamond jewellery and authenticated luxury watches. Private consultations, personal sourcing and white-glove delivery, London based and worldwide shipped.",
  path: "/about",
});

const PILLARS = [
  {
    title: "Bespoke, Not Off The Shelf",
    copy: "Every commission is drawn, cast and hand-set around the wearer in our Hatton Garden workshop. You approve the CAD design before a single stone is cut.",
  },
  {
    title: "Sourced Worldwide",
    copy: "A global dealer network lets us track down virtually any reference — Daytona, Nautilus, Royal Oak, Richard Mille — frequently below retail.",
  },
  {
    title: "GIA Certified",
    copy: "We work exclusively with GIA-certified diamonds. Full certification paperwork accompanies every stone we set or sell.",
  },
  {
    title: "VIP As Standard",
    copy: "First-time buyers and long-standing collectors get the same service: private consultation, personal sourcing, insured white-glove delivery.",
  },
];

export default function AboutPage() {
  const ld = ldJsonGraph([
    {
      "@type": "AboutPage",
      "@id": siteUrl("/about") + "#about",
      url: siteUrl("/about"),
      name: `About ${SITE.name}`,
      description:
        "Hatton Garden specialists in bespoke diamond jewellery and authenticated luxury watches.",
    },
    breadcrumbLd([
      { name: "Home", url: siteUrl("/") },
      { name: "About", url: siteUrl("/about") },
    ]),
    faqLd(ABOUT_FAQS),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="About"
          title="A Hatton Garden House, Built On Trust"
          copy="Alpoe London delivers a true end-to-end luxury experience — from bespoke diamond pieces hand-set to your exact specification, to the world's most sought-after timepieces sourced directly for our clients."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "About", href: "/about", current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-20 max-md:px-6">
          <ScrollReveal>
            <div className="max-w-3xl">
              <p className="t-copy">
                We serve clients of every calibre, from first-time buyers to a discreet roster
                of high-profile and high-net-worth collectors. Every relationship is handled
                with the same VIP service: private consultations, personal sourcing, and
                white-glove delivery.
              </p>
              <p className="mt-6 t-copy">
                Hatton Garden has been London&apos;s jewellery quarter for over a century, and
                it is where we design, set and authenticate everything we sell. Walk in and you
                deal with the people who actually make and source the pieces — not a counter.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-2 gap-4 max-md:grid-cols-1">
            {PILLARS.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 0.08}>
                <div className="h-full border border-fg/[0.10] bg-fg/[0.04] p-6">
                  <h2 className="t-sub">
                    {p.title}
                  </h2>
                  <p className="mt-3 t-copy">{p.copy}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <FAQ items={ABOUT_FAQS} />
        <FindUs />
        <CTAStrip
          eyebrow="Come and see us"
          title="Book a private consultation"
          copy="Walk-ins are welcome at our Hatton Garden showroom, or message us and we'll set aside a quiet hour."
          whatsappMessage="Hi Alpoe, I'd like to book a consultation at the showroom."
          secondary={{ label: "Browse Watches", href: "/watches" }}
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
