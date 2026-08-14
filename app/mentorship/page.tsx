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
import { MENTORSHIP_FAQS } from "@/lib/faqs";
import { pageMetadata, ldJsonGraph, faqLd, breadcrumbLd } from "@/lib/seo";
import { SITE, siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Alpoe Mentorship — Learn The Watch & Jewellery Trade From Hatton Garden",
  description:
    "A private mentorship group run by Alpoe London for people entering the watch and jewellery trade. Sourcing, valuation, margin, marketing and reputation, taught from the floor of Hatton Garden.",
  path: "/mentorship",
});

const MODULES = [
  {
    title: "Where Stock Actually Comes From",
    copy: "The route a piece takes before it reaches a window — dealers, wholesalers, private sellers, auction. Who to approach, what to say, and which doors stay shut until you have a track record.",
  },
  {
    title: "Valuing A Piece Properly",
    copy: "Reading a reference, condition and paperwork, then checking it against live market data instead of a hopeful asking price. The tells that separate a clean deal from an expensive lesson.",
  },
  {
    title: "Margin And Cash Flow",
    copy: "What to pay, what to hold out for, and how long your money can sit in stock before a good buy turns into a bad month. Pricing without gutting the number you walk away with.",
  },
  {
    title: "Negotiating In The Trade",
    copy: "How offers are made and answered between dealers, when to walk, and how to hold a position without burning a contact you will need again next quarter.",
  },
  {
    title: "Building A Name Buyers Trust",
    copy: "Positioning, photography, how you write about a piece, and the difference between content that moves stock and content that just gets views.",
  },
  {
    title: "Staying On The Right Side",
    copy: "Authentication, provenance, paperwork and the checks that protect you — the admin nobody enjoys and everybody regrets skipping.",
  },
];

const FOR_WHOM = [
  {
    title: "Starting With No Contacts",
    copy: "You want into the trade but have no supplier, no stock and nobody to ask. We start at the beginning and give you the questions to walk in with.",
  },
  {
    title: "Already Flipping Pieces",
    copy: "You have done a few deals off your own back and want to run it as a business — consistent sourcing, real margin, and buyers who come back.",
  },
  {
    title: "Building A Brand",
    copy: "You have the audience and the eye, but sourcing and pricing keep pinching. We fill in the trade side so the brand can carry weight.",
  },
];

const HOW_IT_RUNS = [
  {
    n: "01",
    title: "Tell us where you're up to",
    copy: "A short message about what you have done so far and what you want out of it. No test, no pitch — we just need to know the room is right for you.",
  },
  {
    n: "02",
    title: "You get the invite",
    copy: "Access to the private Telegram group, plus the groundwork breakdowns to work through in your own time.",
  },
  {
    n: "03",
    title: "Learn as the market moves",
    copy: "Notes go out as prices shift and pieces cross our desk, so what you are reading is this week's market rather than last year's theory.",
  },
  {
    n: "04",
    title: "Bring us your deals",
    copy: "Put a specific piece, price or supplier in front of the group before you commit. That is the part you cannot get from a course.",
  },
];

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
        <BrandHero
          eyebrow="Alpoe Mentorship"
          title="Learn The Trade From The People Doing It"
          copy="A private group run by our Hatton Garden team for anyone serious about buying and selling watches and jewellery. Not theory — the sourcing, pricing and negotiating we do every week, opened up."
        />

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
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-fg/[0.10]">
                <Image
                  src="/alpoe-diamond-link-chains-hatton-garden.jpg"
                  alt="Diamond-set chains laid out on the counter at Alpoe London in Hatton Garden"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
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

        <section className="bg-panel-soft px-[52px] py-20 max-md:px-6 max-md:py-14">
          <ScrollReveal>
            <p className="text-[11px] tracking-[0.2em] uppercase text-champagne">
              What we cover
            </p>
            <h2 className="mt-4 max-w-3xl font-serif text-[clamp(28px,4vw,48px)] leading-tight">
              The Parts Nobody Explains Until You Have Already Paid For Them
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
            {MODULES.map((m, i) => (
              <ScrollReveal key={m.title} delay={(i % 3) * 0.08}>
                <div className="h-full border border-fg/[0.10] bg-fg/[0.04] p-6">
                  <h3 className="font-serif text-[20px] leading-snug tracking-[0.02em]">
                    {m.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-dim">{m.copy}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="px-[52px] py-20 max-md:px-6 max-md:py-14">
          <ScrollReveal>
            <p className="text-[11px] tracking-[0.2em] uppercase text-champagne">
              How it runs
            </p>
            <h2 className="mt-4 max-w-3xl font-serif text-[clamp(28px,4vw,48px)] leading-tight">
              A Private Room, Not A Video Library
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-2 gap-x-10 gap-y-8 max-md:grid-cols-1">
            {HOW_IT_RUNS.map((s, i) => (
              <ScrollReveal key={s.n} delay={(i % 2) * 0.08}>
                <div className="flex gap-5">
                  <span className="font-serif text-[20px] leading-none text-accent shrink-0 pt-1">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-serif text-[20px] leading-none tracking-[0.02em]">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-dim">{s.copy}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="bg-panel-soft px-[52px] py-20 max-md:px-6 max-md:py-14">
          <ScrollReveal>
            <p className="text-[11px] tracking-[0.2em] uppercase text-champagne">
              Who it&apos;s for
            </p>
            <h2 className="mt-4 max-w-3xl font-serif text-[clamp(28px,4vw,48px)] leading-tight">
              Three People Usually Walk In
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-3 gap-4 max-md:grid-cols-1">
            {FOR_WHOM.map((w, i) => (
              <ScrollReveal key={w.title} delay={i * 0.08}>
                <div className="h-full border border-fg/[0.10] bg-fg/[0.04] p-6">
                  <h3 className="font-serif text-[22px] leading-snug tracking-[0.02em]">
                    {w.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-dim">{w.copy}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={0.24}>
            <p className="mx-auto mt-10 max-w-2xl text-center text-[14px] leading-relaxed text-dim">
              It is the business of the trade, not bench work — we do not teach setting or
              goldsmithing here. If that is what you are after, ask us and we will point you
              somewhere good.
            </p>
          </ScrollReveal>
        </section>

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
          eyebrow="Still deciding?"
          title="Ask us anything about the trade first"
          copy={`Message the ${SITE.name} team direct. We would rather answer your questions now than have you join and find it was not what you needed.`}
          whatsappMessage={INTRO}
          primaryLabel="Ask About The Mentorship"
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
