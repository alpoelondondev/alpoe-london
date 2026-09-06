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
import { SELL_FAQS } from "@/lib/faqs";
import Link from "next/link";
import { WATCH_BRANDS } from "@/lib/taxonomy";
import { SELL_BRANDS } from "@/lib/sell/brands";
import { pageMetadata, ldJsonGraph, faqLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  title: "Sell Your Watch — Paid the Same Day",
  description:
    "Sell or part-exchange a luxury watch with Alpoe London. Free valuation on Rolex, Patek Philippe and AP, authenticated in Hatton Garden, paid the same day.",
  path: ROUTES.sell,
  image: "/og/sell.jpg",
});

const STEPS = [
  { n: "01", title: "Send the details", copy: "Reference number, condition, year, and whether you still have box and papers. Photos help." },
  { n: "02", title: "Get a figure", copy: "We check live market data and come back with a no-obligation valuation, usually within the hour." },
  { n: "03", title: "Authentication", copy: "Bring it in or ship it insured. Our specialists inspect and authenticate it while you wait." },
  { n: "04", title: "Paid same day", copy: "Accept the offer and payment goes out by bank transfer that day. Or put it toward a part-exchange." },
];

const FIELDS: EnquiryField[] = [
  { name: "name", label: "Name", required: true, half: true, placeholder: "Your name" },
  { name: "contact", label: "Phone or Email", required: true, half: true, placeholder: "How we reach you" },
  {
    name: "brand",
    label: "Brand",
    type: "select",
    required: true,
    half: true,
    options: [...WATCH_BRANDS.map((b) => b.name), "Other"],
  },
  { name: "model", label: "Model & reference", required: true, half: true, placeholder: "e.g. Submariner 124060" },
  { name: "year", label: "Year (approx)", half: true, placeholder: "e.g. 2021" },
  {
    name: "condition",
    label: "Condition",
    type: "select",
    half: true,
    options: ["Unworn", "Excellent", "Good — light wear", "Fair — visible wear", "Needs servicing"],
  },
  {
    name: "papers",
    label: "Box & papers",
    type: "select",
    half: true,
    options: ["Full set — box and papers", "Watch and box only", "Watch and papers only", "Watch only"],
  },
  {
    name: "intent",
    label: "Sell or part-exchange?",
    type: "select",
    half: true,
    options: ["Sell outright", "Part-exchange against another piece", "Just after a valuation"],
  },
  {
    name: "details",
    label: "Anything else",
    type: "textarea",
    placeholder: "Service history, any damage, the figure you have in mind…",
  },
];

export default function SellPage() {
  const ld = ldJsonGraph([
    {
      "@type": "Service",
      "@id": siteUrl(ROUTES.sell) + "#service",
      name: "Sell & Trade Your Luxury Watch",
      serviceType: "Luxury watch buying and part-exchange",
      areaServed: "Worldwide",
      provider: { "@id": siteUrl("/") + "#organization" },
      description:
        "Free no-obligation valuations on pre-owned luxury watches, authenticated in Hatton Garden with same-day payment.",
      url: siteUrl(ROUTES.sell),
    },
    // Breadcrumbs are emitted by the <Breadcrumbs> component this page
    // renders, which is the single source of truth for the trail. Building
    // a second BreadcrumbList here published two competing trails per
    // document — Google picks one arbitrarily, or neither.
    faqLd(SELL_FAQS),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Sell With Us"
          title="Sell & Trade, Paid The Same Day"
          copy="We buy pre-owned luxury watches outright and offer strong trade-in valuations against anything in our catalogue. Free, no-obligation, and authenticated in our own Hatton Garden showroom."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Sell & Trade", href: ROUTES.sell, current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-16 max-md:px-6">
          <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {STEPS.map((s, i) => (
              <ScrollReveal key={s.n} delay={i * 0.08}>
                <div className="h-full border border-fg/[0.10] bg-fg/[0.04] p-6">
                  <span className="font-serif text-[20px] leading-none text-accent">{s.n}</span>
                  <h2 className="t-sub mt-4">
                    {s.title}
                  </h2>
                  <p className="mt-3 t-copy">{s.copy}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/*
          The hub's job is to hand off to the brand pages. Without this block
          they would sit in the sitemap with no internal link pointing at them
          — which is how /ourbrand ended up invisible.
        */}
        <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">What are you selling?</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              We buy across the market. These five have their own page, because
              what moves the price on a Royal Oak is not what moves it on a
              Speedmaster and the advice is worth separating.
            </p>
            <ul className="mt-8 grid grid-cols-3 gap-px bg-fg/[0.10] max-md:grid-cols-1">
              {SELL_BRANDS.map((sb) => (
                <li key={sb.slug} className="bg-bg">
                  <Link
                    href={ROUTES.sellBrand(sb.slug)}
                    className="block h-full p-7 transition-colors hover:bg-fg/[0.04]"
                  >
                    <span className="font-serif text-[20px] leading-tight text-blush">
                      Sell your {sb.name}
                    </span>
                    <span className="mt-2 block t-copy">
                      {sb.models
                        .slice(0, 3)
                        .map((m) => m.name)
                        .join(" · ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 t-copy">
              Selling something else — Breitling, Richard Mille, Hublot, IWC,
              Panerai, Vacheron Constantin, or a piece of jewellery? Use the form
              below; we buy all of it, whether or not we list it.
            </p>
          </ScrollReveal>
        </section>

        <section id="sell-form" className="bg-panel-soft px-[52px] py-20 max-md:px-6 max-md:py-14">
          <ScrollReveal>
            <h2 className="t-section text-center">
              Get A Valuation
            </h2>
            <p className="mx-auto mt-3 mb-10 max-w-xl text-center t-copy">
              Fill this in and it opens WhatsApp with your watch details written out. Attach
              your photos in the chat and we&apos;ll come straight back with a figure.
            </p>
            <div className="mx-auto max-w-3xl">
              <EnquiryForm
                fields={FIELDS}
                intro="Hi Alpoe, I'd like a valuation on a watch I'm looking to sell."
                submitLabel="Get My Valuation"
                note="Free and no obligation — you're not committed to anything."
              />
            </div>
          </ScrollReveal>
        </section>

        {/*
          * The route-comparison guide, linked from the hub rather than only
          * from /guides. Somebody on this page is deciding *whether* to sell
          * to a dealer at all, and the honest comparison is what earns the
          * decision — sending them away to read it and come back converts
          * better than pretending the other five routes do not exist.
          */}
        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">Weighing up your options?</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              We wrote the comparison we would give a friend:{" "}
              <Link
                href={ROUTES.guideSellingAWatch}
                className="text-accent underline underline-offset-4"
              >
                where to sell a luxury watch in London
              </Link>{" "}
              &mdash; dealer, auction, consignment, private sale, platform or
              part-exchange, with what each one pays, what it costs in fees and
              how long you wait. It includes the pieces we would tell you to take
              to an auction house instead of to us.
            </p>
          </section>
        </ScrollReveal>

        <FAQ items={SELL_FAQS} />
        <CTAStrip
          eyebrow="Got the watch to hand?"
          title="Send us a photo and the reference"
          copy="That's usually all we need to give you a figure — no forms, no appointment."
          whatsappMessage="Hi Alpoe, I'd like a valuation on a watch I'm looking to sell."
          secondary={{ label: "Browse Watches", href: ROUTES.watches }}
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
