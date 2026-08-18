import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ScrollReveal from "../components/ScrollReveal";
import EnquiryForm, { type EnquiryField } from "../components/EnquiryForm";
import CTAStrip from "../components/CTAStrip";
import FAQ from "../components/FAQ";
import FindUs from "../components/FindUs";
import { CONTACT_FAQS } from "@/lib/faqs";
import { pageMetadata, ldJsonGraph, faqLd, breadcrumbLd, localBusinessLd } from "@/lib/seo";
import { SITE, siteUrl } from "@/lib/site";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title: "Contact Alpoe London — Hatton Garden Showroom",
  description:
    "Talk to Alpoe London about a bespoke commission, a watch you're hunting, or a piece you'd like to sell. WhatsApp for an instant reply, or visit our Hatton Garden showroom.",
  path: "/contact",
});

const FIELDS: EnquiryField[] = [
  { name: "name", label: "Name", required: true, half: true, placeholder: "Your name" },
  { name: "contact", label: "Phone or Email", required: true, half: true, placeholder: "How we reach you" },
  {
    name: "topic",
    label: "What's it about?",
    type: "select",
    required: true,
    half: true,
    options: [
      "Bespoke jewellery",
      "Buying a watch",
      "Selling or part-exchange",
      "Repair or servicing",
      "Something else",
    ],
  },
  { name: "budget", label: "Budget (optional)", half: true, placeholder: "e.g. £5,000–£10,000" },
  {
    name: "details",
    label: "Details",
    type: "textarea",
    required: true,
    placeholder: "Tell us what you're looking for.",
  },
];

export default function ContactPage() {
  const ld = ldJsonGraph([
    localBusinessLd(),
    {
      "@type": "ContactPage",
      "@id": siteUrl("/contact") + "#contact",
      url: siteUrl("/contact"),
      name: `Contact ${SITE.name}`,
    },
    breadcrumbLd([
      { name: "Home", url: siteUrl("/") },
      { name: "Contact", url: siteUrl("/contact") },
    ]),
    faqLd(CONTACT_FAQS),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Contact"
          title="Talk To A Specialist"
          copy="WhatsApp is the fastest way to reach us — most enquiries get a reply the same day. Prefer to come in? Our Hatton Garden showroom is open to walk-ins."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Contact", href: "/contact", current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-20 max-md:px-6">
          <div className="grid grid-cols-2 gap-14 max-md:grid-cols-1 max-md:gap-10">
            <ScrollReveal>
              <h2 className="t-section">
                Send us the details
              </h2>
              <p className="mt-3 mb-8 t-copy">
                Fill this in and it opens WhatsApp with your enquiry already written out —
                just press send.
              </p>
              <EnquiryForm
                fields={FIELDS}
                intro="Hi Alpoe, I'd like to make an enquiry."
                submitLabel="Send Enquiry"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-dim">Showroom</p>
                  <p className="mt-2 font-serif text-[22px] leading-tight">
                    The Garden, {SITE.address.streetAddress}
                  </p>
                  <p className="text-[13px] tracking-[0.14em] uppercase text-dim">
                    {SITE.address.addressLocality} {SITE.address.postalCode}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-dim">WhatsApp</p>
                  <a
                    href={buildGeneralWhatsAppUrl("Hi Alpoe, I'd like to make an enquiry.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block font-serif text-[22px] leading-tight text-accent hover:brightness-110"
                  >
                    {SITE.phone}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-dim">Email</p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="mt-2 block font-serif text-[22px] leading-tight text-accent hover:brightness-110"
                  >
                    {SITE.email}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-dim">Opening hours</p>
                  <p className="mt-2 t-copy">
                    Monday–Saturday, by appointment or walk-in.
                    <br />
                    Sunday closed.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <FindUs />
        <FAQ items={CONTACT_FAQS} />
        <CTAStrip
          eyebrow="Prefer to just message?"
          title="We reply on WhatsApp, usually same day"
          copy="No forms, no waiting on hold — send a photo or a reference number and we'll take it from there."
          whatsappMessage="Hi Alpoe, I'd like to make an enquiry."
          secondary={{ label: "Read Our Story", href: "/about" }}
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
