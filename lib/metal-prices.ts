export type MetalSymbol = "XAU" | "XAG" | "XPT";

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
