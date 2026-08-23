import Nav from "./Nav";
import { WATCH_BRANDS, JEWELLERY_CATEGORIES } from "@/lib/taxonomy";
import { SEED_QUOTE, tickerItems } from "@/lib/metal-prices";

/**
 * The bar's announcement strip is filled in by the browser, not by this
 * component.
 *
 * It used to await the live spot feed here. `SiteHeader` renders on every route
 * on the site, so the feed's five-minute cache became a five-minute revalidate
 * on all 535 pages, and each one re-rendered in a serverless function the first
 * time it was requested after its window expired. Five numbers in a scrolling
 * strip were the reason nothing on the site could be served as plain static
 * HTML. See app/api/metal-prices/route.ts.
 *
 * What is passed down is the seed: the last figures we recorded, formatted
 * exactly as the live ones will be, so the strip opens at its right width and
 * nothing moves when the real quote arrives.
 */
export default function SiteHeader() {
  const { items: ticker } = tickerItems(SEED_QUOTE);
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
    <Nav suggestions={suggestions} ticker={ticker} />
  );
}
