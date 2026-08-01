import type { Product } from "@/lib/types";

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-12 gap-4 py-3 border-b border-white/[0.06]">
      <dt className="col-span-5 text-[11px] tracking-[0.18em] uppercase text-dim">{label}</dt>
      <dd className="col-span-7 text-[14px] text-fg/90">{value}</dd>
    </div>
  );
}

export default function ProductSpecs({ product }: { product: Product }) {
  return (
    <dl className="mt-4">
      <Row label="Brand" value={product.brand} />
      <Row label="Model" value={product.model} />
      <Row label="Reference" value={product.referenceNumber} />
      <Row label="Year" value={product.year} />
      <Row label="Case size" value={product.caseSize} />
      <Row label="Movement" value={product.movement} />
      <Row label="Dial" value={product.dial} />
      <Row label="Bezel" value={product.bezel} />
      <Row label="Water resistance" value={product.waterResistance} />
      <Row label="Materials" value={product.materials} />
      <Row label="Gemstones" value={product.gemstones} />
      <Row label="Carat weight" value={product.carat} />
      <Row label="Condition" value={product.condition} />
    </dl>
  );
}
