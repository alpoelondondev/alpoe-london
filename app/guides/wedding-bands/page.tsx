import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import BrandHero from "../../components/BrandHero";
import ScrollReveal from "../../components/ScrollReveal";
import FAQ from "../../components/FAQ";
import { SHAPE_GUIDES } from "@/lib/rings/shapeGuides";
import { pageMetadata, ldJsonGraph, faqLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

const PATH = "/guides/wedding-bands";

/**
 * What wedding ring goes beside the engagement ring.
 *
 * Keyword research put this as the single least contested cluster of the whole
 * study: "wedding band for oval engagement ring", "wedding band for emerald
 * cut with baguettes", "what wedding band goes with marquise", "wedding ring
 * to fit pear engagement ring", "eternity ring with oval engagement ring" —
 * dozens of harvested variants across all ten shapes, and exactly one
 * competitor (Taylor & Hart) building pages for any of them.
 *
 * One page rather than ten. Half the shapes have the same answer — a straight
 * band sits flush against an emerald cut, an Asscher, a princess and a round —
 * and ten pages saying so with the noun swapped is a doorway set, not content.
 * The shapes where the answer is genuinely different get a section each here,
 * and the individual shape pages under /rings each carry a paragraph pointing
 * back. If a specific shape earns its own page later, it splits out of a
 * section that already exists.
 *
 * Vocabulary note: the harvest showed UK users typing both "wedding band" and
 * the more British "wedding ring to fit", plus "eternity ring" where American
 * content says "anniversary band". The copy uses the British forms and names
 * the others, because somebody searching one should recognise the other.
 */

export const metadata: Metadata = pageMetadata({
  title: "What Wedding Band Goes With Your Ring",
  description:
    "Which wedding ring sits flush against an oval, pear, marquise or emerald cut engagement ring, when you need a shaped band, and what a fitted one costs.",
  path: PATH,
  image: "/og/wedding-rings.jpg",
});

/** Shapes whose pairing is genuinely different, in the order they cause trouble. */
const BY_SHAPE: {
  slug: string;
  name: string;
  verdict: string;
  copy: string;
}[] = [
  {
    slug: "marquise-engagement-rings",
    name: "Marquise",
    verdict: "Shaped band, almost always",
    copy: "The points of a marquise reach further past the setting than any other shape, so a straight band meets the ring at its widest part and leaves an obvious gap under each tip. A band cut to follow the outline closes it completely. The alternative — a plain band worn with a deliberate few millimetres of space — is a real look rather than a compromise, and it costs less.",
  },
  {
    slug: "pear-shaped-engagement-rings",
    name: "Pear",
    verdict: "Shaped band, or a deliberate gap",
    copy: "One point rather than two, so the problem is asymmetric: the band sits flush along the rounded end and lifts away under the tip. A fitted band solves it; so does wearing the wedding ring below the engagement ring rather than above it, which puts the straight edge against the round end of the stone. Which side you wear it on is worth deciding before the band is made.",
  },
  {
    slug: "heart-shaped-engagement-rings",
    name: "Heart",
    verdict: "Shaped band",
    copy: "The only shape that interrupts the band's line twice — the cleft between the lobes at one end, the point at the other. Whichever way round the ring is worn, one of the two is sitting over the band. A shaped band cut to the individual ring is the honest answer here.",
  },
  {
    slug: "oval-engagement-rings",
    name: "Oval",
    verdict: "Usually straight, sometimes shaped",
    copy: "Most ovals take a straight band without any trouble. The exception is a low-profile setting, where the curve of the stone passes over the band and leaves a hairline gap you notice once and then cannot stop noticing. It is a small shaped band that fixes it — a gentle scoop rather than a full contour.",
  },
  {
    slug: "cushion-cut-engagement-rings",
    name: "Cushion",
    verdict: "Usually straight",
    copy: "Rounded corners mean a cushion generally sits well against a straight band. An elongated cushion behaves much like an oval, so the same low-setting caveat applies. Worth checking against the finished ring rather than assuming.",
  },
  {
    slug: "emerald-cut-engagement-rings",
    name: "Emerald cut",
    verdict: "Straight — the easiest of all",
    copy: "Straight edges against a straight band with no gap anywhere. This is why emerald cuts pair so naturally with a plain flat band or a channel-set eternity ring: the geometry already agrees. If you want the pairing decision to be simple, this is the shape that makes it so.",
  },
  {
    slug: "asscher-cut-engagement-rings",
    name: "Asscher",
    verdict: "Straight",
    copy: "Square and straight-edged, like the emerald cut it descends from. Baguette and channel-set bands suit it particularly well, because the rectangular stones echo the step-cut geometry of the centre.",
  },
  {
    slug: "princess-cut-engagement-rings",
    name: "Princess cut",
    verdict: "Straight",
    copy: "Square corners sit flat against a straight band. Princess cuts also take a channel-set band unusually well — square stones beside a square stone — which is the pairing you will see most often on them.",
  },
  {
    slug: "radiant-cut-engagement-rings",
    name: "Radiant cut",
    verdict: "Straight",
    copy: "Cropped corners and straight edges, so a plain band sits flush. Nothing to design around.",
  },
  {
    slug: "round-brilliant-engagement-rings",
    name: "Round brilliant",
    verdict: "Straight — the benchmark",
    copy: "The shape every other pairing is compared against. A straight band meets a round setting cleanly at almost any height, which is part of why the round brilliant stays the default.",
  },
];

const PRINCIPLES = [
  {
    heading: "Profile before everything",
    copy: "Court is domed inside and out and the most comfortable to wear all day. Flat court is flat outside, domed inside — the modern default. D-shape is domed outside and flat within. Flat is flat both ways and reads sharpest against a plain band. Try all four before choosing a width, because profile changes how a ring feels far more than width does.",
  },
  {
    heading: "Width is a proportion, not a number",
    copy: "A 2mm band under a large stone disappears; a 4mm band under a small one swamps it. It also depends on the finger — the same 3mm reads quite differently on a size G and a size R. We size the band against the actual engagement ring on the actual hand rather than off a chart.",
  },
  {
    heading: "Shaped means cut to your ring, not to a shape",
    copy: "A fitted or shaped band is made to the individual engagement ring, not selected from a catalogue of curves. That means it needs the engagement ring present — or a precise model of it — and it means the pair only ever fits each other. It is worth knowing before you commission one that a shaped band is not transferable.",
  },
  {
    heading: "Match the metal, or decide not to",
    copy: "Platinum against platinum and 18ct against 18ct is the safe answer, and there is a practical reason beyond appearance: a harder metal worn against a softer one will wear the softer one away over years of contact. Mixing metals deliberately is a legitimate choice; mixing them accidentally is how a yellow gold band ends up thinning a platinum shank.",
  },
  {
    heading: "Eternity ring, or the third ring",
    copy: "An eternity ring is usually the later addition, worn above or below the pair. Full eternity bands cannot be resized — the stones run the whole way round and the spacing cannot be altered — so if there is any chance of the finger changing, a half or three-quarter eternity is the sensible one to commission.",
  },
  {
    heading: "Soldering the two together",
    copy: "Some people have the wedding ring and engagement ring soldered into one piece. It stops them spinning apart and wearing against each other, and it makes the pair sit perfectly. It also means they can never be worn separately, resized independently, or cleaned apart — so it is worth living with them for a year first.",
  },
];

const BAND_FAQS = [
  {
    question: "What wedding band goes with an oval engagement ring?",
    answer:
      "A straight band, in most cases. Ovals sit against a plain band more easily than people expect. The exception is a low-profile setting, where the curve of the stone passes over the band and leaves a small gap — and there a gently shaped band, scooped rather than fully contoured, closes it. Bring the engagement ring in and we will hold both against it.",
  },
  {
    question: "What wedding band goes with a marquise engagement ring?",
    answer:
      "Almost always a shaped one. The points of a marquise reach further past the setting than any other shape, so a straight band meets the ring at its widest part and leaves a visible gap under each tip. A band cut to follow the outline closes it. Some people prefer to wear a plain band with a deliberate gap instead, which is a perfectly good look and costs less.",
  },
  {
    question: "Do I need a shaped wedding band?",
    answer:
      "Only if the engagement ring leaves a gap. Emerald cuts, Asschers, princess cuts, radiants and round brilliants sit flush against a straight band and need nothing. Pears, marquises and hearts usually do need one. Ovals and cushions depend on how low the setting sits. The honest test is to put a straight band against the actual ring and look at it from the side.",
  },
  {
    question: "How much does a fitted wedding band cost?",
    answer:
      "More than a plain one, because it is made to your specific ring rather than to a size. The metal and any stones are the bulk of it and the shaping is the rest. We quote it against the actual engagement ring — there is no useful list price for a band whose whole purpose is that it fits one object in the world.",
  },
  {
    question: "Should the wedding ring go above or below the engagement ring?",
    answer:
      "Below, traditionally — closest to the hand, because it was there first. In practice it is whichever sits better, and on a pear it can genuinely change how the pair looks: worn below, the band meets the rounded end of the stone rather than the point. Decide before a shaped band is made, since it is cut for one position.",
  },
  {
    question: "Can I have a wedding ring made to match a ring I already own?",
    answer:
      "Yes, and it is a large part of what we do — including matching rings we did not make. We need the engagement ring at the bench to cut a band against it, or long enough to model it precisely. Send a photograph and the finger size and we will tell you what is possible before you come in.",
  },
  {
    question: "What is the difference between a wedding band and an eternity ring?",
    answer:
      "A wedding ring is the band exchanged at the wedding, usually plain or partly set. An eternity ring is a later gift, set with stones part way or the whole way round. The practical difference worth knowing: a full eternity ring cannot be resized, because the stones run the entire circumference. Half and three-quarter eternity rings can.",
  },
];

export default function WeddingBandsGuidePage() {
  const ld = ldJsonGraph([
    {
      "@type": "Article",
      "@id": siteUrl(PATH) + "#article",
      headline: "What Wedding Band Goes With Your Engagement Ring",
      description:
        "Which engagement ring shapes take a straight wedding band, which need a shaped one, and how to choose profile, width and metal.",
      about: [
        { "@type": "Thing", name: "Wedding rings" },
        { "@type": "Thing", name: "Engagement rings" },
        { "@type": "Thing", name: "Eternity rings" },
      ],
      author: { "@id": siteUrl("/") + "#organization" },
      publisher: { "@id": siteUrl("/") + "#organization" },
      inLanguage: "en-GB",
      isPartOf: { "@id": siteUrl("/") + "#website" },
      mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(PATH) },
      url: siteUrl(PATH),
    },
    faqLd(BAND_FAQS),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Guide"
          title="What Wedding Band Goes With Your Engagement Ring"
          copy="Which shapes take a straight band, which need one cut to fit, and how to choose the profile, the width and the metal. From the bench that makes them."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Guides", href: "/guides" },
              { name: "Wedding bands", href: PATH, current: true },
            ]}
          />
        </section>

        <ScrollReveal>
          <section className="px-[52px] pb-14 max-md:px-6">
            <p className="max-w-[64ch] text-[19px] leading-relaxed font-light text-blush">
              Most engagement rings take a plain straight band. Three shapes
              usually do not — the marquise, the pear and the heart — and two
              more depend on how low the setting sits.
            </p>
            <p className="mt-5 max-w-[68ch] t-copy">
              The test is simple and you can do it yourself: hold a straight band
              against the engagement ring and look at the pair from the side, not
              from above. If light shows between them, you want a shaped band. If
              they meet, you do not, and nobody should be selling you one.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">Shape by shape</h2>
            <dl className="mt-8 divide-y divide-fg/[0.08] border-t border-fg/[0.08]">
              {BY_SHAPE.map((s) => (
                <div key={s.slug} className="py-5">
                  <dt className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <Link
                      href={`/rings/${s.slug}`}
                      className="font-serif text-[19px] leading-tight text-blush underline underline-offset-4 transition hover:text-accent"
                    >
                      {s.name}
                    </Link>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-accent">
                      {s.verdict}
                    </span>
                  </dt>
                  <dd className="mt-2 max-w-[68ch] t-copy">{s.copy}</dd>
                </div>
              ))}
            </dl>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-fg/10 bg-panel-soft px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">Choosing the band itself</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-9 max-md:grid-cols-1">
              {PRINCIPLES.map((p) => (
                <div key={p.heading} className="border-t border-accent/40 pt-4">
                  <h3 className="font-serif text-[19px] leading-tight text-blush">
                    {p.heading}
                  </h3>
                  <p className="mt-3 t-copy">{p.copy}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <FAQ items={BAND_FAQS} />

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">Start from the stone</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              Each shape page covers what that cut changes about the diamond
              itself — how it sparkles, what it hides, and how it has to be set.
            </p>
            <ul className="mt-8 grid grid-cols-3 gap-x-8 gap-y-3 text-sm max-lg:grid-cols-2 max-sm:grid-cols-1">
              {SHAPE_GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/rings/${g.slug}`}
                    className="text-fg/60 transition-colors hover:text-accent"
                  >
                    {g.h1}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[64ch] t-copy">
              Bringing an existing ring for a band to be cut against?{" "}
              <Link
                href="/book-appointment"
                className="text-accent underline underline-offset-4"
              >
                Book a time
              </Link>{" "}
              and bring it with you — we cannot fit a band to a photograph, and
              the sizing takes ten minutes with the ring in front of us.
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
