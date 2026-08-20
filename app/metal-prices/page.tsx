import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ScrollReveal from "../components/ScrollReveal";
import CTAStrip from "../components/CTAStrip";
import {
  getMetalPrices,
  formatGbp,
  formatUsd,
  formatClock,
  perGram,
  GOLD_CARATS,
  isSpotMarketOpen,
  type MetalPrice,
} from "@/lib/metal-prices";
import { getMetalsNews, formatAge } from "@/lib/metals-news";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { pageMetadata, ldJsonGraph } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Live Gold, Silver & Platinum Prices",
  description:
    "Live gold, silver, platinum and palladium spot prices in GBP and USD, per troy ounce and per gram, with carat breakdowns. Reference rates from Hatton Garden.",
  path: "/metal-prices",
});

export const revalidate = 300;

/**
 * A panel of the sheet: black masthead over ruled rows, closing on an enquiry
 * line. The masthead is the page ground's own off-black, so the sheet reads as
 * an inversion of the site rather than a widget borrowed from elsewhere.
 */
function Panel({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-sheet-panel shadow-[0_1px_3px_rgba(23,19,18,0.10)]">
      <div className="bg-bg px-6 py-4 text-center">
        <h2 className="t-sub">
          {title}
        </h2>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
      {footer ? (
        <div className="border-t border-sheet-line px-6 py-4">{footer}</div>
      ) : null}
    </div>
  );
}

/**
 * One ruled line. Figures sit right-aligned in fixed columns in tabular
 * numerals so the decimals stack down the panel, and every other row takes a
 * faint wash — on a table this dense, the stripe is what keeps your eye on the
 * line you are reading.
 */
function Row({
  label,
  value,
  secondary,
  strong,
  alt,
  accentLabel,
}: {
  label: string;
  value: string;
  secondary?: string;
  strong?: boolean;
  alt?: boolean;
  /** Metal names carry the house rose, as the reference sheet golds its own. */
  accentLabel?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-x-6 px-6 py-3 max-md:gap-x-3 ${
        alt ? "bg-sheet-alt" : ""
      }`}
    >
      <span
        className={`text-[13px] leading-snug ${
          accentLabel ? "text-accent-deep" : "text-sheet-dim"
        }`}
      >
        {label}
      </span>
      <span
        className={`min-w-[104px] text-right tabular-nums text-sheet-ink max-md:min-w-0 ${
          strong ? "text-[16px] font-normal" : "text-[14px]"
        }`}
      >
        {value}
      </span>
      <span className="min-w-[92px] text-right text-[13px] tabular-nums text-sheet-dim max-md:min-w-0">
        {secondary ?? ""}
      </span>
    </div>
  );
}

function EnquireLink({ label, message }: { label: string; message: string }) {
  return (
    <a
      href={buildGeneralWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-center text-[12px] tracking-[0.14em] uppercase text-accent-deep transition hover:text-sheet-ink"
    >
      + {label}
    </a>
  );
}

export default async function MetalPricesPage() {
  const [{ prices, usdToGbp, fetchedAt, stale }, news] = await Promise.all([
    getMetalPrices(),
    getMetalsNews(12),
  ]);

  const bySymbol = Object.fromEntries(prices.map((p) => [p.symbol, p])) as Record<
    string,
    MetalPrice
  >;
  const gold = bySymbol.XAU;
  const pgms = ["XAG", "XPT", "XPD"].map((s) => bySymbol[s]).filter(Boolean);
  const open = isSpotMarketOpen();
  const live = open && !stale;

  const goldRows = [
    {
      label: "Spot, per troy ounce",
      value: formatGbp(gold.priceGbp),
      secondary: formatUsd(gold.priceUsd),
      strong: true,
    },
    {
      label: "Per gram, fine (999)",
      value: formatGbp(perGram(gold.priceGbp)),
      secondary: formatUsd(perGram(gold.priceUsd)),
    },
    ...GOLD_CARATS.filter((c) => c.label !== "24ct").map((c) => ({
      label: `${c.label} per gram (${c.hallmark})`,
      value: formatGbp(perGram(gold.priceGbp) * c.fineness),
      secondary: formatUsd(perGram(gold.priceUsd) * c.fineness),
    })),
    {
      label: "Per kilo, fine (999)",
      value: formatGbp(perGram(gold.priceGbp) * 1000),
      secondary: formatUsd(perGram(gold.priceUsd) * 1000),
    },
  ];

  const pgmRows = [
    ...pgms.map((m) => ({
      label: m.name,
      value: formatGbp(m.priceGbp),
      secondary: formatUsd(m.priceUsd),
      strong: true,
      accentLabel: true,
    })),
    ...pgms.map((m) => ({
      label: `${m.name}, per gram`,
      value: formatGbp(perGram(m.priceGbp)),
      secondary: formatUsd(perGram(m.priceUsd)),
    })),
  ];

  const ld = ldJsonGraph([
    // Breadcrumbs are emitted by the <Breadcrumbs> component this page
    // renders, which is the single source of truth for the trail. Building
    // a second BreadcrumbList here published two competing trails per
    // document — Google picks one arbitrarily, or neither.
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          title="Live Metal Prices"
          copy="Keep up to date with live market pricing for investment pieces, and the news moving the metals market. Talk to us about investment-grade bullion, coins and bars, and we'll confirm today's figure for you."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Guides", href: "/guides" },
              { name: "Metal Prices", href: "/metal-prices", current: true },
            ]}
          />
        </section>

        {/* The sheet. Everything inside it is light-on-dark inverted — the one
            block on the site that does so, because a price table is a document
            rather than a band of the page. */}
        <section className="bg-sheet px-[52px] py-14 max-md:px-6 max-md:py-10">
          <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
            <ScrollReveal className="h-full">
              <Panel
                title="Live Spot Gold"
                footer={
                  <EnquireLink
                    label="Enquire About Gold"
                    message="Hi Alpoe, I'd like today's confirmed gold rate."
                  />
                }
              >
                <div className="px-6 pt-5 pb-4 text-center">
                  <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.16em] uppercase">
                    <span
                      aria-hidden="true"
                      className={`inline-block h-[7px] w-[7px] rounded-full ${
                        live ? "bg-up" : "bg-accent-deep"
                      }`}
                    />
                    <span className={live ? "text-up" : "text-accent-deep"}>
                      {stale
                        ? "Feed unavailable — last held"
                        : open
                          ? "Spot market is open"
                          : "Spot market is closed"}
                    </span>
                  </p>
                  <p className="mt-2 text-[12px] tabular-nums text-sheet-dim">
                    {formatClock(fetchedAt)}
                  </p>
                </div>
                {goldRows.map((r, i) => (
                  <Row key={r.label} {...r} alt={i % 2 === 0} />
                ))}
              </Panel>
            </ScrollReveal>

            <ScrollReveal delay={0.08} className="h-full">
              <Panel
                title="Silver Price & PGMs"
                footer={
                  <EnquireLink
                    label="Enquire About Silver & PGMs"
                    message="Hi Alpoe, I'd like today's confirmed rate on silver, platinum or palladium."
                  />
                }
              >
                <div className="px-6 pt-5 pb-4 text-center">
                  <p className="text-[11px] tracking-[0.16em] uppercase text-sheet-dim">
                    Per troy ounce · GBP and USD
                  </p>
                  <p className="mt-2 text-[12px] tabular-nums text-sheet-dim">
                    {formatClock(fetchedAt)}
                  </p>
                </div>
                {pgmRows.map((r, i) => (
                  <Row key={r.label} {...r} alt={i % 2 === 0} />
                ))}
              </Panel>
            </ScrollReveal>
          </div>

          {/* Buy & Sell Bullion — black card cut into the sheet, the one place
              the page asks for the sale rather than reporting the market. */}
          <ScrollReveal>
            <div className="mt-6 bg-bg px-8 py-12 text-center">
              <p className="font-serif text-[clamp(26px,3.2vw,38px)] leading-none text-fg">
                Buy &amp; Sell <em className="not-italic text-accent">Bullion</em>
              </p>
              <p className="mt-3 text-[14px] text-fg/60">
                Gold coins, bars and silver at competitive rates.
              </p>
              <a
                href={buildGeneralWhatsAppUrl(
                  "Hi Alpoe, I'd like to buy or sell bullion — could you send today's rates?",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 bg-accent px-9 py-4 font-serif text-[17px] uppercase tracking-[0.1em] text-bg transition hover:bg-accent-deep"
              >
                Enquire About Bullion
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </ScrollReveal>

          {/* Fine print, not a feature. */}
          <p className="mt-6 max-w-4xl text-[11px] leading-[1.7] text-sheet-dim/85">
            {stale ? "Last held figures" : "Live spot"} — recorded {formatClock(fetchedAt)},
            converted at {usdToGbp.toFixed(4)} USD/GBP.
            {stale
              ? " Our market feed is not responding, so these are the most recent figures we hold and may be some way behind the market."
              : ""}{" "}
            Spot data is drawn from gold-api.com, with exchange rates from the European
            Central Bank via frankfurter.dev. Carat rows are the fine-gold content of each
            hallmark standard, calculated from spot. These are indicative market reference
            rates shown for guidance only — they are not an offer or a quotation, and prices
            may not be accurate at the time of enquiry or purchase. Bullion and jewellery are
            transacted at the rate confirmed with you in writing at the point of sale, which
            includes our premium, and finished pieces carry additional costs for workmanship,
            stones and finishing. Please confirm the current figure with us before committing
            to a purchase or a sale.
          </p>

          {news.length ? (
            <ScrollReveal>
              <div className="mt-12 bg-sheet-panel px-8 py-8 shadow-[0_1px_3px_rgba(23,19,18,0.10)] max-md:px-5">
                <div className="flex items-baseline justify-between gap-6 border-b-2 border-accent pb-3">
                  <h2 className="t-sub t-ink">
                    Latest Metals News
                  </h2>
                  <span className="text-[10px] tracking-[0.16em] uppercase text-sheet-dim">
                    Via Google News
                  </span>
                </div>
                <ul>
                  {news.map((n) => (
                    <li key={n.url} className="border-b border-sheet-line last:border-b-0">
                      <a
                        href={n.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group grid grid-cols-[minmax(0,1fr)_150px] items-baseline gap-6 py-4 max-lg:grid-cols-1 max-lg:gap-1"
                      >
                        <span className="text-[15px] leading-snug text-sheet-ink transition-colors group-hover:text-accent-deep">
                          {n.title}
                        </span>
                        <span className="text-right text-[11px] leading-snug text-sheet-dim max-lg:text-left">
                          {n.source}
                          {n.source && n.publishedAt ? <br /> : null}
                          {formatAge(n.publishedAt)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ) : null}
        </section>

        <CTAStrip
          eyebrow="Buying or selling on the day's rate?"
          title="Get today's figure confirmed"
          copy="Message us and we'll confirm the live rate for your piece, with our premium set out in full."
          whatsappMessage="Hi Alpoe, I'd like today's confirmed rate on gold, silver or platinum."
          secondary={{ label: "Sell & Trade", href: "/sell" }}
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
