import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import BrandHero from "../../components/BrandHero";
import ScrollReveal from "../../components/ScrollReveal";
import FAQ from "../../components/FAQ";
import { SELL_BRANDS } from "@/lib/sell/brands";
import { pageMetadata, ldJsonGraph, faqLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

const PATH = ROUTES.guideSellingAWatch;

/**
 * Where to sell a luxury watch in London, and what each route actually pays.
 *
 * Search Console put this cluster top of the commercial pile: "sell a audemars
 * piguet london", "sell rolex hatton garden", "sell my patek philippe london",
 * "sell audemars piguet london", "rolex part exchange london", "sell your
 * luxury watch cambridge" and "sell my 5316p patek philippe london" — nineteen
 * impressions across nine variants in a fortnight, every one of them from
 * somebody who owns the watch already.
 *
 * Deliberately NOT a rival to /sell or /sell/[brand]. Those pages are
 * transactional: they exist to take a reference number and give a figure back,
 * and they already hold the "sell my rolex london" shape of query. This page
 * answers the question that comes *before* it — dealer, auction, consignment,
 * private sale or platform, and what each one costs you — which none of them
 * covers and which no Hatton Garden dealer covers honestly, because the honest
 * answer is not always "sell to a dealer". Every route links onward to the
 * brand pages, so the guide feeds the spine rather than competing with it.
 *
 * The comparison is written to be true rather than flattering. Auction beats a
 * trade counter on headline price for genuinely rare pieces and the page says
 * so; a dealer wins on certainty, speed and cost, and the page says why. A
 * page that concluded "sell to us" in every scenario would rank for nothing,
 * because it would answer nobody's actual question.
 *
 * "Part-exchange" earns its own route rather than a sentence, because "rolex
 * part exchange london" is its own query with its own intent — that person is
 * buying, not just selling, and is worth several times a straight seller.
 */

export const metadata: Metadata = pageMetadata({
  title: "Where to Sell a Luxury Watch in London",
  description:
    "Dealer, auction, consignment, private sale or part-exchange — what each route pays for a Rolex, Patek or AP, what it costs in fees, and how long it takes.",
  path: PATH,
  image: "/og/sell.jpg",
});

type SaleRoute = {
  name: string;
  speed: string;
  fees: string;
  copy: string;
  bestFor: string;
};

const SALE_ROUTES: SaleRoute[] = [
  {
    name: "Sell to a dealer",
    speed: "Same day",
    fees: "None to you",
    copy:
      "You are paid a net figure and the dealer carries everything after that — the authentication, the servicing, the warranty they give the next owner, the months the watch sits in a safe before it sells, and the risk that the market moves while it does. That is what the gap between the dealer's offer and the price you see on a listing site is buying. The offer is lower than a private sale and it is certain, which for most people most of the time is the right trade. Get two or three; on a liquid reference the spread between counters is usually a few per cent, and on an unusual one it can be a great deal more.",
    bestFor: "Anyone who wants the money now and the problem gone.",
  },
  {
    name: "Auction",
    speed: "Three to six months",
    fees: "Around 20–30% all in",
    copy:
      "The highest headline prices in the market are set at auction, and for something genuinely rare — an early Daytona, an unpolished vintage Patek, anything with provenance — an auction room is where the two collectors who care about it bid against each other. Read the total cost before you commit. There is a seller's commission, and then insurance, photography, cataloguing and lotting fees, and the hammer price you celebrate is not the figure that reaches your account. There is also no floor unless you set a reserve, and a lot that fails to sell is publicly burned for a while afterwards.",
    bestFor: "Rare, vintage, provenanced or complicated pieces.",
  },
  {
    name: "Consignment",
    speed: "Weeks to months",
    fees: "Typically 10–20%",
    copy:
      "The dealer sells the watch on your behalf and takes a percentage on completion. You keep more of the retail price than an outright sale gives you and you skip the auction timetable, but you are still waiting, you are exposed to the market for as long as it takes, and you do not get paid until somebody buys. Worth asking for on a piece a dealer is hesitant to buy outright — a hesitation to buy and a willingness to consign tells you something real about how quickly they expect it to move.",
    bestFor: "Higher-value pieces you are not in a hurry to convert.",
  },
  {
    name: "Private sale",
    speed: "Unpredictable",
    fees: "Listing fees, plus your time",
    copy:
      "The best net figure available, and the only route where the entire margin is yours. It is also the only route with real personal risk. Watch theft during arranged private sales is a genuine problem in London, and the standard fraud is a bank transfer that is reversed after you have handed the watch over. If you sell privately: meet inside a bank or a jeweller's premises rather than a station or a car park, never at either party's home, and do not release the watch until the funds have cleared into your account — not shown as pending, cleared.",
    bestFor: "Confident sellers with time and a common reference.",
  },
  {
    name: "Online instant-buy platforms",
    speed: "A few days",
    fees: "None visible, priced into the offer",
    copy:
      "Post the watch, receive a bank transfer. Convenient, and the offer is usually the lowest of the five because the platform is pricing in a watch it has not held, from a seller it has not met, with a returns policy it has to honour. The part worth reading twice is what happens if their inspection disagrees with your description: a revised offer at that stage leaves you choosing between accepting less than you agreed and paying to have your own watch posted back.",
    bestFor: "Common references where speed beats a few per cent.",
  },
  {
    name: "Part-exchange",
    speed: "Same day",
    fees: "None to you",
    copy:
      "The route people forget, and usually the best value of the six if you are buying anything at all. A dealer can be more generous on a watch coming in than on one bought outright, because the margin sits on both sides of the deal and only one of them has to work. If you are trading up — a Datejust toward a Daytona, a Speedmaster toward a Royal Oak — ask for the part-exchange figure and the outright figure separately, and compare the difference against what you would have paid for the new piece anyway. That difference is the real number.",
    bestFor: "Anyone whose next watch is already in mind.",
  },
];

const DRIVERS = [
  {
    heading: "The reference, not the model",
    copy:
      "A Submariner is not a price. 124060, 126610LN and 116610LN are three separate markets, and the dial or bezel variant moves the number again inside each one. The reference is engraved between the lugs at twelve o'clock, underneath the bracelet. Find it before you ask anyone for a figure, because a valuation given on a model name is a guess and will be revised downwards when the watch arrives.",
  },
  {
    heading: "Papers, and what they are worth",
    copy:
      "A full set — box, warranty card, booklets, tags — is worth a real premium, and on some references it is a large one. But it varies by maker far more than people expect: an Extract from the Archives matters enormously on a vintage Patek and hardly at all on a five-year-old Datejust, and a service history from the manufacturer can be worth more than the original card on a piece that has been serviced elsewhere. Send what you have and let the desk tell you which parts count.",
  },
  {
    heading: "Condition, and why not to polish",
    copy:
      "Do not have a watch polished before selling it. It feels like presenting it well and it is the single most common way people reduce their own offer. Polishing removes metal, softens the case lines and the bevels, and on anything collectable a sharp unpolished case is worth substantially more than a shiny rounded one. Clean the bracelet, leave the case alone.",
  },
  {
    heading: "Timing, and the one thing you control",
    copy:
      "Pre-owned prices move, and nobody who tells you they know which way is being straight with you. What you can control is not selling under pressure. An offer accepted the same afternoon it was made is the one most likely to have been low, and every desk knows the difference between a seller who is curious and a seller who needs the money by Friday.",
  },
];

const FAQS = [
  {
    question: "Where can I sell a luxury watch in London?",
    answer:
      "The five routes are a dealer, an auction house, consignment, a private sale or an online buying platform, plus part-exchange if you are buying something else. A dealer pays less than a private sale and pays today; an auction can beat both on a rare piece but takes months and costs 20–30% in fees. Hatton Garden is where most of London's watch trade counters sit, which is the practical reason to start there: you can get several offers on the same street in an afternoon.",
  },
  {
    question: "How much will a dealer pay for my Rolex?",
    answer:
      "It depends on the reference rather than the model, and then on condition, papers and how quickly that particular reference sells. Anyone who quotes a figure from the model name alone has not valued your watch. Send the reference number engraved between the lugs, the year and a few clear photographs, and you should have a real number back the same day.",
  },
  {
    question: "Is it better to sell a watch to a dealer or at auction?",
    answer:
      "A dealer, for anything common, current or straightforward — the certainty and the same-day payment are worth more than the difference. An auction, for something genuinely rare, vintage, provenanced or complicated, where the ceiling is set by two collectors bidding rather than by a resale calculation. Set the auction's total fees against the dealer's offer before deciding, because 20–30% is a large amount of a hammer price.",
  },
  {
    question: "Can I part-exchange a watch against another one?",
    answer:
      "Yes, and it is usually worth more to you than selling outright. Ask for the part-exchange allowance and the outright purchase figure as two separate numbers so you can see which part of the deal is doing the work. We take part-exchange against anything in our catalogue and against pieces we source to order.",
  },
  {
    question: "Do I need the box and papers to sell a watch?",
    answer:
      "No. Watches without their original box and papers are bought every day and sell perfectly well. A full set is worth a premium, and how large a premium depends on the maker and the reference — it is significant on collectable Patek and AP, and much smaller on a recent steel sports Rolex that is easy to authenticate on its own merits.",
  },
  {
    question: "Do I pay tax when I sell a watch in the UK?",
    answer:
      "For most private sellers, no. HMRC generally treats a mechanical watch as a wasting asset — machinery with a predicted life under fifty years — which normally puts a gain outside Capital Gains Tax. That treatment is not universal: it can differ if the watch was used in a business, if capital allowances were claimed, or if HMRC considers you to be trading rather than selling a personal possession. It is a general position rather than advice, so check with an accountant before relying on it for a large sale.",
  },
  {
    question: "Can I sell a watch in London if I do not live there?",
    answer:
      "Yes. Most sales we handle from outside London start with photographs and the reference number by email or WhatsApp, and finish either with an insured, tracked courier or with a single trip in. Sellers come to Hatton Garden from Cambridge, Birmingham, Manchester and Brighton for exactly that reason — several counters within a few streets means several offers in one afternoon rather than one offer by post.",
  },
];

export default function SellingAWatchInLondonPage() {
  const ld = ldJsonGraph([
    {
      "@type": "Article",
      "@id": siteUrl(PATH) + "#article",
      headline: "Where to Sell a Luxury Watch in London",
      description:
        "Dealer, auction, consignment, private sale or part-exchange — what each route pays, what it costs in fees, and how long it takes.",
      about: [
        { "@type": "Thing", name: "Selling luxury watches" },
        { "@type": "Thing", name: "Watch valuation" },
        { "@type": "Thing", name: "Part-exchange" },
      ],
      author: { "@id": siteUrl("/") + "#organization" },
      publisher: { "@id": siteUrl("/") + "#organization" },
      inLanguage: "en-GB",
      isPartOf: { "@id": siteUrl("/") + "#website" },
      mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(PATH) },
      url: siteUrl(PATH),
    },
    faqLd(FAQS),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Guide"
          title="Where to Sell a Luxury Watch in London"
          copy="Dealer, auction, consignment, private sale or part-exchange. What each one pays, what it costs you, and how long you wait — from a counter in Hatton Garden."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Guides", href: ROUTES.guides },
              { name: "Selling a luxury watch", href: PATH, current: true },
            ]}
          />
        </section>

        <ScrollReveal>
          <section className="px-[52px] pb-14 max-md:px-6">
            <p className="max-w-[64ch] text-[19px] leading-relaxed font-light text-blush">
              There are six ways to turn a watch into money in London, and they
              differ by roughly a third from top to bottom on the same piece. The
              gap is not a scandal — it is speed, certainty and risk being priced
              — but it is worth understanding before you accept the first offer.
            </p>
            <p className="mt-5 max-w-[68ch] t-copy">
              We buy watches, so read this knowing that. What follows is still
              the version we would give a friend: there are pieces we would tell
              you to take to an auction house instead of selling to us, and this
              page says which and why. Before any of it, find the reference
              number engraved between the lugs at twelve o&rsquo;clock. Every
              figure anyone quotes you without it is a guess.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">The six routes, compared</h2>
            <dl className="mt-8 divide-y divide-fg/[0.08] border-t border-fg/[0.08]">
              {SALE_ROUTES.map((r) => (
                <div key={r.name} className="py-6">
                  <dt className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="font-serif text-[19px] leading-tight text-blush">
                      {r.name}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-accent">
                      {r.speed} · {r.fees}
                    </span>
                  </dt>
                  <dd className="mt-2 max-w-[68ch] t-copy">{r.copy}</dd>
                  <dd className="mt-2 max-w-[68ch] text-[13px] text-fg/55">
                    <span className="uppercase tracking-[0.12em] text-accent/80">
                      Best for
                    </span>{" "}
                    {r.bestFor}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-fg/10 bg-panel-soft px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">What actually moves the number</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-9 max-md:grid-cols-1">
              {DRIVERS.map((d) => (
                <div key={d.heading} className="border-t border-accent/40 pt-4">
                  <h3 className="font-serif text-[19px] leading-tight text-blush">
                    {d.heading}
                  </h3>
                  <p className="mt-3 t-copy">{d.copy}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">Why Hatton Garden</h2>
            <p className="mt-3 max-w-[68ch] t-copy">
              London&rsquo;s watch and jewellery trade has been concentrated into
              a few streets in EC1 for well over a century, and the practical
              consequence for a seller is competition inside walking distance.
              You can take the same watch to several counters in an afternoon and
              hold three offers by the end of it, which is the single most
              effective thing you can do to avoid selling cheaply. No amount of
              research substitutes for a second offer.
            </p>
            <p className="mt-4 max-w-[68ch] t-copy">
              It also means the authentication happens in front of you rather
              than in a warehouse a week later. A watch opened, timed and
              inspected while you wait produces a figure that does not get
              revised afterwards &mdash; and if a counter will not authenticate
              in front of you, that is worth knowing before you hand anything
              over.
            </p>
          </section>
        </ScrollReveal>

        <FAQ items={FAQS} />

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">What we pay, maker by maker</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              Each page covers what moves the price for that maker specifically
              &mdash; which references the desk is asked for, which paperwork
              counts, and what gets a piece valued above the screen price.
            </p>
            <ul className="mt-8 grid grid-cols-3 gap-x-8 gap-y-3 text-sm max-lg:grid-cols-2 max-sm:grid-cols-1">
              {SELL_BRANDS.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={ROUTES.sellBrand(b.slug)}
                    className="text-fg/60 transition-colors hover:text-accent"
                  >
                    Sell your {b.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[64ch] t-copy">
              Have the reference number to hand?{" "}
              <Link
                href={ROUTES.sell}
                className="text-accent underline underline-offset-4"
              >
                Send it for a free valuation
              </Link>{" "}
              and you will have a no-obligation figure back the same day, or{" "}
              <Link
                href={ROUTES.bookAppointment}
                className="text-accent underline underline-offset-4"
              >
                book a time
              </Link>{" "}
              to bring the watch in and be paid on the spot.
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
