import type { Metadata } from "next";
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
  formatTimestamp,
} from "@/lib/metal-prices";
import { pageMetadata, ldJsonGraph, breadcrumbLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Live Metal Prices — Gold, Silver & Platinum Spot",
  description:
    "Live gold, silver and platinum spot prices in GBP and USD per troy ounce, updated every five minutes. Reference rates from Alpoe London, Hatton Garden.",
  path: "/metal-prices",
});

export const revalidate = 300;

export default async function MetalPricesPage() {
  const { prices, usdToGbp, fetchedAt, stale } = await getMetalPrices();

  const ld = ldJsonGraph([
    breadcrumbLd([
      { name: "Home", url: siteUrl("/") },
      { name: "Metal Prices", url: siteUrl("/metal-prices") },
    ]),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Market Data"
          title="Live Metal Prices"
          copy="Gold, silver and platinum spot, quoted per troy ounce in sterling and dollars. Refreshed every five minutes through the trading day."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Metal Prices", href: "/metal-prices", current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-16 max-md:px-6">
          <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
            {prices.map((m, i) => (
              <ScrollReveal key={m.symbol} delay={i * 0.08}>
                <div className="h-full border border-fg/[0.10] bg-fg/[0.04] p-8">
                  <div className="flex items-baseline justify-between">
                    <h2 className="font-serif text-[24px] leading-none tracking-[0.02em]">
                      {m.name}
                    </h2>
                    <span className="font-serif text-[14px] leading-none text-accent">
                      {m.symbol}
                    </span>
                  </div>
                  <p className="mt-6 font-serif text-[clamp(30px,3.4vw,42px)] leading-none">
                    {formatGbp(m.priceGbp)}
                  </p>
                  <p className="mt-3 text-[14px] leading-relaxed text-dim">
                    {formatUsd(m.priceUsd)} · per troy ounce
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-8 border border-fg/[0.10] p-6">
              <p className="text-[13px] leading-relaxed text-dim">
                <span className="text-accent">
                  {stale ? "Last held figures" : "Live spot"}
                </span>{" "}
                — recorded {formatTimestamp(fetchedAt)} (London), converted at{" "}
                {usdToGbp.toFixed(4)} USD/GBP.
                {stale
                  ? " Our market feed is not responding, so these are the most recent figures we hold and may be some way behind the market."
                  : ""}
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-dim">
                Spot data is drawn from gold-api.com, with exchange rates from the
                European Central Bank via frankfurter.dev. These are indicative market
                reference rates shown for guidance only — they are not an offer or a
                quotation, and prices may not be accurate at the time of enquiry or
                purchase. Bullion and jewellery are transacted at the rate confirmed with
                you in writing at the point of sale, which includes our premium, and
                finished pieces carry additional costs for workmanship, stones and
                finishing. Please confirm the current figure with us before committing to
                a purchase or a sale.
              </p>
            </div>
          </ScrollReveal>
        </section>

        <CTAStrip
          eyebrow="Buying or selling on the day's rate?"
          title="Get today's figure confirmed"
          copy="Message us and we'll confirm the live rate for your piece, with our premium set out in full."
          whatsappMessage="Hi Alpoe, I'd like today's confirmed rate on gold, silver or platinum."
          secondary={{ label: "Sell Your Watch", href: "/sell" }}
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
