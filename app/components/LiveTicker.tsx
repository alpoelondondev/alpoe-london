"use client";

import { useEffect, useState } from "react";
import MarketTicker from "./MarketTicker";
import { tickerItems, type MetalQuote, type TickerItem } from "@/lib/metal-prices";
import { ROUTES } from "@/lib/routes";

/**
 * The announcement strip, filled in by the browser.
 *
 * It was a server component awaiting the price feed, which meant the feed's
 * five-minute cache became a five-minute revalidate on every page that renders
 * a header — which is every page. See app/api/metal-prices/route.ts for what
 * that cost.
 *
 * The seed is painted first so the strip has its figures, its width and its
 * scroll from the first frame; the live quote replaces them a moment later
 * without moving anything. `stale` is deliberately not seeded: whether the
 * market is open is a fact about now, and the server rendering this page may
 * have been a fortnight ago. It appears once the browser knows.
 */
export default function LiveTicker({
  seed,
  ariaBusyUntilLoaded = false,
}: {
  /** Last figures we recorded, formatted — see SEED_QUOTE. */
  seed: TickerItem[];
  ariaBusyUntilLoaded?: boolean;
}) {
  const [live, setLive] = useState<{ items: TickerItem[]; stale: boolean } | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    fetch(ROUTES.apiMetalPrices, { signal: ac.signal })
      .then((r) => (r.ok ? (r.json() as Promise<MetalQuote>) : Promise.reject(r.status)))
      .then((quote) => setLive(tickerItems(quote)))
      // The seed stays on screen. A strip of week-old spot is a better answer
      // than an empty bar, and nothing on the site transacts off these figures.
      .catch(() => {});
    return () => ac.abort();
  }, []);

  return (
    <div aria-busy={ariaBusyUntilLoaded && !live ? true : undefined}>
      <MarketTicker items={live?.items ?? seed} stale={live?.stale} />
    </div>
  );
}
