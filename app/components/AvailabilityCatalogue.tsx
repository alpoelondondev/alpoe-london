import { catalogueItemUrl, type CatalogueItem } from "@/lib/catalogue";
import { buildCatalogueEnquiryUrl } from "@/lib/whatsapp";
import ProductTile, { TILE_GRID_CLASS } from "./ProductTile";
import EnquiryList, { type EnquiryListRow } from "./EnquiryList";

function CatalogueCard({ item }: { item: CatalogueItem }) {
  return (
    <ProductTile
      href={catalogueItemUrl(item)}
      image={item.images[0]}
      alt={[item.brand, item.model, item.variant, item.reference].filter(Boolean).join(" ")}
      title={item.variant || item.model}
      meta={
        [item.model, item.reference ? `Ref ${item.reference}` : null]
          .filter(Boolean)
          .join(" · ") || undefined
      }
      cta="View Details"
      ariaLabel={`View ${item.brand} ${item.model} ${item.variant}`}
    />
  );
}

// No photography yet — the enquiry goes straight to WhatsApp with the reference
// pre-filled rather than to a page with nothing to look at.
function toRow(item: CatalogueItem): EnquiryListRow {
  return {
    id: item.id,
    href: buildCatalogueEnquiryUrl(item),
    eyebrow: `${item.brand}${item.model ? ` · ${item.model}` : ""}`,
    title: item.variant || item.model,
    meta: item.reference ? `Ref ${item.reference}` : undefined,
    ariaLabel: `Enquire about ${item.brand} ${item.model} ${item.variant} on WhatsApp`,
  };
}

export default function AvailabilityCatalogue({
  brandName,
  items,
  total,
}: {
  brandName: string;
  items: CatalogueItem[];
  total: number;
}) {
  if (!total) return null;

  // One flat grid of the shot references; everything else runs as a list below.
  const shot = items.filter((i) => i.hasImages);
  const unshot = items.filter((i) => !i.hasImages);

  return (
    <section className="mt-24 border-t border-fg/[0.14] pt-14">
      <header className="max-w-2xl">
        <p className="text-[11px] tracking-[0.2em] uppercase text-accent">Available to Source</p>
        <h2 className="t-section mt-3">
          {total} {brandName} references we can source
        </h2>
        <p className="mt-3 text-dim text-sm leading-relaxed">
          Every reference below can be authenticated and sourced to order through our Hatton
          Garden showroom. Enquire on WhatsApp and we&apos;ll confirm availability and pricing.
        </p>
      </header>

      {shot.length ? (
        <div className={`mt-10 ${TILE_GRID_CLASS}`}>
          {shot.map((item) => (
            <CatalogueCard key={item.id} item={item} />
          ))}
        </div>
      ) : null}

      <EnquiryList
        rows={unshot.map(toRow)}
        label={shot.length ? "More references to order" : "References to order"}
      />
    </section>
  );
}
