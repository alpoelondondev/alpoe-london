import Image from "next/image";
import Link from "next/link";
import { catalogueItemUrl, type CatalogueGroup, type CatalogueItem } from "@/lib/catalogue";
import { buildCatalogueEnquiryUrl } from "@/lib/whatsapp";

function CatalogueCard({ item }: { item: CatalogueItem }) {
  const hero = item.images[0];
  const alt = [item.brand, item.model, item.variant, item.reference]
    .filter(Boolean)
    .join(" ");

  const cardClass =
    "group block relative overflow-hidden border border-white/[0.06] bg-white/[0.02]";

  const inner = (
    <>
      <div className="w-full aspect-[4/5] relative bg-white/[0.02]">
        {hero ? (
          <Image
            src={hero}
            alt={alt}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 300px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-dim text-[10px] tracking-[0.18em] uppercase text-center px-3">
            Image on request
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,6,8,0.9)] via-[rgba(6,6,8,0.15)] to-transparent pointer-events-none" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h4 className="font-serif text-[15px] leading-tight tracking-[0.01em]">
          {item.variant || item.model}
        </h4>
        {item.reference ? (
          <p className="mt-1 text-[10px] tracking-[0.14em] uppercase text-dim">
            Ref {item.reference}
          </p>
        ) : null}
        <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase text-accent opacity-90 group-hover:opacity-100">
          {hero ? "View details →" : "Enquire Now →"}
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
  groups,
  total,
}: {
  brandName: string;
  groups: CatalogueGroup[];
  total: number;
}) {
  if (!total) return null;

  return (
    <section className="mt-24 border-t border-white/[0.08] pt-14">
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

      <div className="mt-12 space-y-14">
        {groups.map((group) => (
          <div key={group.model}>
            <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-3">
              <h3 className="font-serif text-xl tracking-[0.02em]">{group.model}</h3>
              <span className="text-[10px] tracking-[0.16em] uppercase text-dim">
                {group.items.length}{" "}
                {group.items.length === 1 ? "reference" : "references"}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-4 max-md:grid-cols-2 max-md:gap-3">
              {group.items.map((item) => (
                <CatalogueCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
