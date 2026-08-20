import Nav from "./Nav";
import type { TickerItem } from "./MarketTicker";
import { WATCH_BRANDS, JEWELLERY_CATEGORIES } from "@/lib/taxonomy";
import {
  getMetalPrices,
  formatGbp,
  perGram,
  isSpotMarketOpen,
  GOLD_CARATS,
} from "@/lib/metal-prices";

/**
 * The bar's announcement strip reads off the same spot feed as /metal-prices —
 * one cached upstream call per five-minute window, shared by every page, so
 * the strip and the market sheet can never disagree with each other.
 *
 * Ounces for the four metals, then the two carats a counter actually quotes
 * per gram. If the fetch is down this returns the last figures we held, and
 * the strip says so.
 */
async function tickerItems(): Promise<{ items: TickerItem[]; stale: boolean }> {
  const quote = await getMetalPrices();
  const items: TickerItem[] = quote.prices.map((p) => ({
    label: p.name,
    value: formatGbp(p.priceGbp),
    unit: "/oz",
  }));

  const gold = quote.prices.find((p) => p.symbol === "XAU");
  if (gold) {
    for (const carat of GOLD_CARATS) {
      if (carat.label !== "18ct" && carat.label !== "9ct") continue;
      items.push({
        label: `${carat.label} Gold`,
        value: formatGbp(perGram(gold.priceGbp) * carat.fineness),
        unit: "/g",
      });
    }
  }

  return { items, stale: quote.stale || !isSpotMarketOpen() };
}

export default async function SiteHeader() {
  const { items: ticker, stale: tickerStale } = await tickerItems();
  const suggestions = [
    ...WATCH_BRANDS.map((b) => ({
      name: b.name,
      url: `/watches/${b.slug}`,
      kind: "Brand" as const,
    })),
    ...JEWELLERY_CATEGORIES.map((c) => ({
      name: c.name,
      url: c.href ?? `/jewellery/${c.slug}`,
      kind: "Category" as const,
    })),
  ];
  return (
    <Nav
      suggestions={suggestions}
      ticker={ticker}
      tickerStale={tickerStale}
    />
  );
}
