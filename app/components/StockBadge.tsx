import type { StockState } from "@/lib/types";

export default function StockBadge({
  state,
  onDark,
}: {
  state: StockState;
  /** Sitting on a dark band — swap to light ink so it stays legible. */
  onDark?: boolean;
}) {
  if (state === "in_stock") {
    return (
      <span className={`inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] uppercase px-2 py-1 border ${onDark ? "text-champagne border-champagne/50" : "text-accent border-accent/60"}`}>
        <span className={`block w-1.5 h-1.5 rounded-full ${onDark ? "bg-champagne" : "bg-accent"}`} />
        In Stock
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] uppercase px-2 py-1 border ${onDark ? "text-fg/70 border-fg/30" : "text-dim border-fg/30"}`}>
      <span className={`block w-1.5 h-1.5 rounded-full ${onDark ? "bg-fg/70" : "bg-dim"}`} />
      Sourceable
    </span>
  );
}
