import Image from "next/image";
import Link from "next/link";
import { catalogueItemUrl, type CatalogueItem } from "@/lib/catalogue";
import { buildCatalogueEnquiryUrl } from "@/lib/whatsapp";

function CatalogueCard({ item }: { item: CatalogueItem }) {
  const hero = item.images[0];
  const alt = [item.brand, item.model, item.variant, item.reference]
    .filter(Boolean)
    .join(" ");

  const cardClass =
    "group flex flex-col relative overflow-hidden border border-black/[0.08] bg-black/[0.03] transition hover:border-black/[0.20]";

  const inner = (
    <>
      {/* No photo, no media box at all — an empty frame is just scroll. */}
      {hero ? (
        <div className="w-full relative aspect-[4/5] bg-black/[0.03]">
          <Image
            src={hero}
            alt={alt}
            fill
            draggable={false}
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h4 className="font-serif text-[15px] leading-tight tracking-[0.01em]">
          {item.variant || item.model}
        </h4>
        <p className="text-[10px] tracking-[0.14em] uppercase text-dim">
          {item.model}
          {item.reference ? ` · Ref ${item.reference}` : ""}
        </p>
        {/* CTA sits on the tile itself rather than reading as a text link. */}
        <span className="mt-3 block w-full bg-accent px-3 py-2 text-center text-[10px] font-medium tracking-[0.16em] uppercase text-bg transition group-hover:brightness-110">
          {hero ? "View Details" : "Enquire Now"}
        </span>
      </div>
    </>
  );

  // No photography yet — send the enquiry straight to WhatsApp with the
  // reference pre-filled instead of linking to a page without images.
  if (!hero) {
    return (
      <a
        href={buildCatalogueEnquiryUrl(item)}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
        aria-label={`Enquire about ${item.brand} ${item.model} ${item.variant} on WhatsApp`}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href={catalogueItemUrl(item)}
      className={cardClass}
      aria-label={`View ${item.brand} ${item.model} ${item.variant}`}
    >
      {inner}
    </Link>
  );
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

  // One flat grid rather than a divider per model — far less scrolling.
  const ordered = [
    ...items.filter((i) => i.hasImages),
    ...items.filter((i) => !i.hasImages),
  ];

  return (
    <section className="mt-24 border-t border-black/[0.10] pt-14">
      <header className="max-w-2xl">
        <p className="text-[11px] tracking-[0.2em] uppercase text-accent">Available to Source</p>
        <h2 className="mt-3 font-serif text-[clamp(26px,3.4vw,40px)] leading-tight">
          {total} {brandName} references we can source
        </h2>
        <p className="mt-3 text-dim text-sm leading-relaxed">
          Every reference below can be authenticated and sourced to order through our Hatton
          Garden showroom. Enquire on WhatsApp and we&apos;ll confirm availability and pricing.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1 max-md:gap-3">
        {ordered.map((item) => (
          <CatalogueCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
