import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ScrollReveal from "../components/ScrollReveal";
import EnquiryForm, { type EnquiryField } from "../components/EnquiryForm";
import MentorshipLockup from "../components/MentorshipLockup";
import MentorshipRails from "./MentorshipRails";
import CTAStrip from "../components/CTAStrip";
import FAQ from "../components/FAQ";
import { MENTORSHIP_FAQS } from "@/lib/faqs";
import { pageMetadata, ldJsonGraph, faqLd, breadcrumbLd } from "@/lib/seo";
import { SITE, siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Alpoe Mentorship — Learn The Watch & Jewellery Trade From Hatton Garden",
  description:
    "A private mentorship group run by Alpoe London for people entering the watch and jewellery trade. Sourcing, valuation, margin, marketing and reputation, taught from the floor of Hatton Garden.",
  path: "/mentorship",
});

const FIELDS: EnquiryField[] = [
  { name: "name", label: "Name", required: true, half: true, placeholder: "Your name" },
  {
    name: "contact",
    label: "Phone or Email",
    required: true,
    half: true,
    placeholder: "How we reach you",
  },
  {
    name: "stage",
    label: "Where are you up to?",
    type: "select",
    required: true,
    half: true,
    options: [
      "Starting from scratch",
      "Bought and sold a few pieces",
      "Reselling regularly",
      "Building a jewellery brand",
      "Already trading full time",
    ],
  },
  {
    name: "focus",
    label: "What interests you most?",
    type: "select",
    required: true,
    half: true,
    options: [
      "Watches",
      "Diamonds and jewellery",
      "Both",
      "Not decided yet",
    ],
  },
  {
    name: "goal",
    label: "What do you want out of it?",
    type: "select",
    half: true,
    options: [
      "A second income",
      "To go full time in the trade",
      "To launch my own brand",
      "To buy better for myself",
    ],
  },
  {
    name: "location",
    label: "Where are you based?",
    half: true,
    placeholder: "City or country",
  },
  {
    name: "details",
    label: "Anything else",
    type: "textarea",
    placeholder: "What you have tried so far, where you keep getting stuck, questions you want answered…",
  },
];

const INTRO = "Hi Alpoe, I'd like to find out about the mentorship.";

export default function MentorshipPage() {
  const ld = ldJsonGraph([
    {
      "@type": "Course",
      "@id": siteUrl("/mentorship") + "#course",
      name: "Alpoe Mentorship",
      url: siteUrl("/mentorship"),
      description:
        "A private mentorship group run by Alpoe London teaching the business of the watch and jewellery trade — sourcing, valuation, margin, negotiation, marketing and reputation.",
      provider: { "@id": siteUrl("/") + "#organization" },
      inLanguage: "en-GB",
      teaches: [
        "Sourcing luxury watches and diamonds",
        "Valuing and authenticating pre-owned pieces",
        "Pricing, margin and cash flow in the trade",
        "Negotiating between dealers",
        "Marketing and brand building for jewellers",
      ],
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT2H",
        location: {
          "@type": "VirtualLocation",
          name: "Private Telegram group",
        },
      },
    },
    breadcrumbLd([
      { name: "Home", url: siteUrl("/") },
      { name: "Mentorship", url: siteUrl("/mentorship") },
    ]),
    faqLd(MENTORSHIP_FAQS),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero title="Learn The Trade From The People Doing It" />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Mentorship", href: "/mentorship", current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-16 max-md:px-6">
          <div className="grid grid-cols-2 gap-10 items-start max-md:grid-cols-1">
            <ScrollReveal>
              <MentorshipLockup className="w-full" />
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <div className="max-w-xl">
                <p className="text-[16px] leading-[1.9] text-fg/80">
                  Most people who try to get into this trade lose money on their first few
                  pieces. Not because they have no eye, but because nobody told them what a
                  piece is really worth, who to buy it from, or how thin the margin gets once
                  you have paid for it twice.
                </p>
                <p className="mt-5 text-[16px] leading-[1.9] text-fg/80">
                  We have spent years on Hatton Garden doing exactly that — sourcing stock,
                  valuing what comes across the counter, and selling to collectors who know the
                  market as well as we do. The mentorship is that experience written down and
                  kept current, in a room where you can ask about your own deals.
                </p>
                <p className="mt-5 text-[16px] leading-[1.9] text-fg/80">
                  It runs entirely through a private Telegram group, so it moves at the speed
                  the market does.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <MentorshipRails />

        <section
          id="mentorship-form"
          className="px-[52px] py-20 max-md:px-6 max-md:py-14"
        >
          <ScrollReveal>
            <h2 className="font-serif text-[clamp(28px,4vw,48px)] leading-tight text-center">
              Apply To Join
            </h2>
            <p className="mx-auto mt-3 mb-10 max-w-xl text-center text-[14px] leading-relaxed text-dim">
              Tell us where you are up to and it opens WhatsApp with your details written out.
              We come back with the terms and, if it is a fit, the invite to the group.
            </p>
            <div className="mx-auto max-w-3xl">
              <EnquiryForm
                fields={FIELDS}
                intro={INTRO}
                submitLabel="Send My Application"
                note="No obligation — we go through everything with you before you commit."
              />
            </div>
          </ScrollReveal>
        </section>

        <FAQ items={MENTORSHIP_FAQS} />
        <CTAStrip
          eyebrow="How to get involved"
          title="Ask us about the mentorship"
          copy={`Message the ${SITE.name} team direct and we will talk you through what the group covers, how it runs and how to join. Nobody in there started out knowing this trade — the questions you would rather not ask out loud are the ones it exists for.`}
          whatsappMessage={INTRO}
          primaryLabel="Ask About Joining"
          secondary={{ label: "About Alpoe", href: "/about" }}
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
