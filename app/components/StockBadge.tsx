import type { StockState } from "@/lib/types";

export default function StockBadge({ state }: { state: StockState }) {
  if (state === "in_stock") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] uppercase text-accent border border-accent/60 px-2 py-1">
        <span className="block w-1.5 h-1.5 rounded-full bg-accent" />
        In Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] uppercase text-dim border border-white/20 px-2 py-1">
      <span className="block w-1.5 h-1.5 rounded-full bg-dim" />
      Sourceable
    </span>
  );
}
