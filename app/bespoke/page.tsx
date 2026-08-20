import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ScrollReveal from "../components/ScrollReveal";
import EnquiryForm, { type EnquiryField } from "../components/EnquiryForm";
import CTAStrip from "../components/CTAStrip";
import FAQ from "../components/FAQ";
import { BESPOKE_FAQS } from "@/lib/faqs";
import { pageMetadata, ldJsonGraph, faqLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Bespoke Jewellery Made in Hatton Garden",
  description:
    "Commission a one-off diamond piece in Hatton Garden. Engagement rings, pendants and chains designed around you and hand-set in London. Natural or laboratory-grown.",
  path: "/bespoke",
  image: "/og/bespoke.jpg",
});

const STEPS = [
  {
    n: "01",
    title: "Tell us the brief",
    copy: "The occasion, who it's for, the stone you have in mind and the budget you're working to.",
  },
  {
    n: "02",
    title: "We design it",
    copy: "A CAD design comes back for your approval. Adjust the setting, the shoulders, the carat — nothing is cut until you're happy.",
  },
  {
    n: "03",
    title: "Hand-set in Hatton Garden",
    copy: "Our benches cast the metal and set every stone by hand, with GIA certification for the diamonds.",
  },
  {
    n: "04",
    title: "Delivered or collected",
    copy: "Collect from the showroom or take insured, tracked white-glove delivery anywhere in the world.",
  },
];

const FIELDS: EnquiryField[] = [
  { name: "name", label: "Name", required: true, half: true, placeholder: "Your name" },
  { name: "contact", label: "Phone or Email", required: true, half: true, placeholder: "How we reach you" },
  {
    name: "piece",
    label: "What are we making?",
    type: "select",
    required: true,
    half: true,
    options: [
      "Engagement ring",
      "Wedding ring or band",
      "Cuban or rope chain",
      "Pendant",
      "Bracelet",
      "Earrings",
      "Statement / cocktail ring",
      "Not sure yet",
    ],
  },
  {
    name: "occasion",
    label: "Occasion",
    type: "select",
    required: true,
    half: true,
    options: [
      "Engagement / proposal",
      "Wedding",
      "Anniversary",
      "Birthday",
      "Christmas",
      "Gift to myself",
      "No particular occasion",
    ],
  },
  {
    name: "wearer",
    label: "Who is it for?",
    type: "select",
    required: true,
    half: true,
    options: ["For a woman", "For a man", "Unisex", "Not sure yet"],
  },
  {
    name: "stone",
    label: "Diamond preference",
    type: "select",
    required: true,
    half: true,
    options: [
      "Laboratory-grown diamonds",
      "Natural diamonds",
      "Not sure — talk me through it",
      "Other gemstone",
    ],
  },
  {
    name: "metal",
    label: "Metal",
    type: "select",
    half: true,
    options: ["Platinum", "White gold", "Yellow gold", "Rose gold", "Not sure yet"],
  },
  { name: "budget", label: "Budget", half: true, placeholder: "e.g. £3,000–£6,000" },
  { name: "deadline", label: "Needed by (optional)", half: true, placeholder: "e.g. 14 Feb" },
  {
    name: "details",
    label: "Anything else",
    type: "textarea",
    placeholder: "Ring size, carat, a piece you've seen and liked, inspiration links…",
  },
];

export default function BespokePage() {
  const ld = ldJsonGraph([
    {
      "@type": "Service",
      "@id": siteUrl("/bespoke") + "#service",
      name: "Bespoke Jewellery Design",
      serviceType: "Bespoke diamond jewellery",
      areaServed: "Worldwide",
      provider: { "@id": siteUrl("/") + "#organization" },
      description:
        "Custom diamond jewellery designed and hand-set in Hatton Garden, London. Laboratory-grown or natural, GIA certified.",
      url: siteUrl("/bespoke"),
    },
    // Breadcrumbs are emitted by the <Breadcrumbs> component this page
    // renders, which is the single source of truth for the trail. Building
    // a second BreadcrumbList here published two competing trails per
    // document — Google picks one arbitrarily, or neither.
    faqLd(BESPOKE_FAQS),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Bespoke Jewellery"
          title="Designed Around You, Set By Hand"
          copy="One-off diamond pieces drawn, cast and hand-set in our Hatton Garden workshop. Laboratory-grown or natural, GIA certified, and yours alone."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Bespoke", href: "/bespoke", current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-16 max-md:px-6">
          <div className="grid grid-cols-2 gap-10 items-start max-md:grid-cols-1">
            <ScrollReveal>
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-fg/[0.10]">
                <Image
                  src="/alpoe-bespoke-jewellery-stone-setting-hatton-garden.jpg"
                  alt="A jeweller setting a diamond by hand at the bench in Hatton Garden"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <ol className="flex flex-col gap-6">
                {STEPS.map((s) => (
                  <li key={s.n} className="flex gap-5">
                    <span className="font-serif text-[20px] leading-none text-accent shrink-0 pt-1">
                      {s.n}
                    </span>
                    <div>
                      <h2 className="t-sub">
                        {s.title}
                      </h2>
                      <p className="mt-2 t-copy">{s.copy}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </ScrollReveal>
          </div>
        </section>

        <section id="bespoke-form" className="bg-panel-soft px-[52px] py-20 max-md:px-6 max-md:py-14">
          <ScrollReveal>
            <h2 className="t-section text-center">
              Start Your Commission
            </h2>
            <p className="mx-auto mt-3 mb-10 max-w-xl text-center t-copy">
              Answer a few questions and it opens WhatsApp with your brief written out. A
              specialist comes back to you, usually the same day.
            </p>
            <div className="mx-auto max-w-3xl">
              <EnquiryForm
                fields={FIELDS}
                intro="Hi Alpoe, I'd like to enquire about a bespoke piece."
                submitLabel="Send My Brief"
                note="No obligation — we'll talk it through before anything is made."
              />
            </div>
          </ScrollReveal>
        </section>

        <FAQ items={BESPOKE_FAQS} />
        <CTAStrip
          eyebrow="Not sure where to start?"
          title="Send us a photo of what you like"
          copy="A screenshot, a sketch or a piece you've seen elsewhere is enough for us to work from."
          whatsappMessage="Hi Alpoe, I'd like to enquire about a bespoke piece."
          secondary={{ label: "Browse Jewellery", href: "/jewellery" }}
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
