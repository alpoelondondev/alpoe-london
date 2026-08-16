export type MetalSymbol = "XAU" | "XAG" | "XPT" | "XPD";

export type MetalPrice = {
  symbol: MetalSymbol;
  name: string;
  priceUsd: number;
  priceGbp: number;
};

export type MetalQuote = {
  prices: MetalPrice[];
  usdToGbp: number;
  fetchedAt: string;
  /** True when the live fetch failed and these are the last figures we held. */
  stale: boolean;
};

const METALS: { symbol: MetalSymbol; name: string }[] = [
  { symbol: "XAU", name: "Gold" },
  { symbol: "XAG", name: "Silver" },
  { symbol: "XPT", name: "Platinum" },
  { symbol: "XPD", name: "Palladium" },
];

/**
 * Seed figures, recorded 16 Aug 2026. Only ever shown if the very first fetch
 * on a cold server fails — once any fetch succeeds this is replaced in memory.
 */
const SEED: MetalQuote = {
  prices: [
    { symbol: "XAU", name: "Gold", priceUsd: 4377.6, priceGbp: 3234.66 },
    { symbol: "XAG", name: "Silver", priceUsd: 64.83, priceGbp: 47.89 },
    { symbol: "XPT", name: "Platinum", priceUsd: 1755, priceGbp: 1296.49 },
    { symbol: "XPD", name: "Palladium", priceUsd: 1338, priceGbp: 988.43 },
  ],
  usdToGbp: 0.73874,
  fetchedAt: "2026-08-16T08:06:30.000Z",
  stale: true,
};

let lastGood: MetalQuote = SEED;

/**
 * Live spot in USD per troy ounce, converted to GBP.
 * Cached for 5 minutes, so all visitors share one upstream call per window.
 * If anything upstream fails we serve the last figures we successfully held.
 */
export async function getMetalPrices(): Promise<MetalQuote> {
  try {
    const [usd, usdToGbp] = await Promise.all([
      Promise.all(
        METALS.map(async (m) => {
          const res = await fetch(`https://api.gold-api.com/price/${m.symbol}`, {
            next: { revalidate: 300 },
          });
          if (!res.ok) throw new Error(`${m.symbol} responded ${res.status}`);
          const { price } = (await res.json()) as { price: number };
          if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
            throw new Error(`${m.symbol} returned no usable price`);
          }
          return price;
        }),
      ),
      fetch("https://api.frankfurter.dev/v1/latest?base=USD&symbols=GBP", {
        next: { revalidate: 3600 },
      }).then(async (res) => {
        if (!res.ok) throw new Error(`FX responded ${res.status}`);
        const { rates } = (await res.json()) as { rates: { GBP: number } };
        if (typeof rates?.GBP !== "number" || !Number.isFinite(rates.GBP)) {
          throw new Error("FX returned no usable rate");
        }
        return rates.GBP;
      }),
    ]);

    lastGood = {
      prices: METALS.map((m, i) => ({
        ...m,
        priceUsd: usd[i],
        priceGbp: Number((usd[i] * usdToGbp).toFixed(2)),
      })),
      usdToGbp,
      fetchedAt: new Date().toISOString(),
      stale: false,
    };
    return lastGood;
  } catch (err) {
    console.error("Metal price fetch failed, serving last held figures:", err);
    return { ...lastGood, stale: true };
  }
}

export function formatGbp(value: number) {
  return value.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatUsd(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Troy ounce, the unit spot is quoted in. */
export const TROY_OUNCE_GRAMS = 31.1034768;

export function perGram(pricePerOunce: number) {
  return pricePerOunce / TROY_OUNCE_GRAMS;
}

/**
 * Hallmark finenesses, which is what a counter actually weighs against. Scrap
 * and part-exchange are settled per gram at the alloy's gold content, so the
 * carat rows are the ones a customer can do their own sum with.
 */
export const GOLD_CARATS = [
  { label: "24ct", fineness: 0.999, hallmark: 999 },
  // Struck as 916, though the alloy is 916.6 parts per thousand — the assay
  // office rounds down, so the stamp and the sum disagree by a whisker.
  { label: "22ct", fineness: 0.9166, hallmark: 916 },
  { label: "18ct", fineness: 0.75, hallmark: 750 },
  { label: "14ct", fineness: 0.585, hallmark: 585 },
  { label: "9ct", fineness: 0.375, hallmark: 375 },
] as const;

/**
 * Loco London spot runs from Sunday evening to Friday evening, breaking for an
 * hour each day at 22:00 London. Between those hours nothing is being priced,
 * so the figures above are the last print rather than a live one — which is a
 * material difference to anyone reading them on a Saturday.
 */
export function isSpotMarketOpen(at: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(at);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");

  if (weekday === "Sat") return false;
  if (weekday === "Sun") return hour >= 23;
  if (weekday === "Fri" && hour >= 22) return false;
  // The daily settlement break.
  return hour !== 22;
}

/** "16 Aug 2026 · 09:36:39 BST" — the clock a trading table is read against. */
export function formatClock(iso: string) {
  return new Date(iso)
    .toLocaleString("en-GB", {
      timeZone: "Europe/London",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    })
    .replace(",", " ·");
}

export function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: "Europe/London",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
