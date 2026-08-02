export type EnquiryListRow = {
  id: string;
  href: string;
  /** Brand · model line above the name. */
  eyebrow?: string;
  title: string;
  /** Reference number or material — sits right of the name on desktop. */
  meta?: string;
  ariaLabel?: string;
};

/**
 * References we have no photography for. A card with an empty frame is just
 * scroll, so these read as a dense list instead: one hairline between rows,
 * capped height so a 100-strong brand list never runs away with the page.
 */
export default function EnquiryList({
  rows,
  label,
}: {
  rows: EnquiryListRow[];
  /** Small uppercase rule above the list. */
  label?: string;
}) {
  if (!rows.length) return null;
  // Short lists fit inside the cap, so a fade there would just dim the last row.
  const scrolls = rows.length > 7;

  return (
    <div className={label ? "mt-12" : ""}>
      {label ? (
        <div className="flex items-baseline justify-between gap-4 border-t border-black/[0.10] pt-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-accent">{label}</p>
          <p className="text-[10px] tracking-[0.14em] uppercase text-dim">
            {rows.length} {rows.length === 1 ? "reference" : "references"}
          </p>
        </div>
      ) : null}

      <div className="relative mt-4">
        <ul className="list-scroll max-h-[60vh] min-h-0 overflow-y-auto border-y border-black/[0.08]">
          {rows.map((row) => (
            <li key={row.id} className="border-b border-black/[0.07] last:border-b-0">
              <a
                href={row.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={row.ariaLabel ?? `Enquire about ${row.title} on WhatsApp`}
                className="group flex items-center gap-4 px-1 py-4 transition-colors hover:bg-black/[0.03] max-md:flex-col max-md:items-stretch max-md:gap-2"
              >
                <div className="min-w-0 flex-1">
                  {row.eyebrow ? (
                    <p className="text-[10px] tracking-[0.18em] uppercase text-accent">
                      {row.eyebrow}
                    </p>
                  ) : null}
                  <h3 className="mt-1 font-serif text-[clamp(17px,1.5vw,21px)] leading-tight tracking-[0.02em]">
                    {row.title}
                  </h3>
                </div>

                {/* Reference and CTA share one line on mobile so a row stays compact. */}
                <div className="flex shrink-0 items-baseline gap-4 max-md:w-full max-md:justify-between md:justify-end">
                  {row.meta ? (
                    <p className="text-[11px] tracking-[0.14em] uppercase text-dim">{row.meta}</p>
                  ) : null}
                  <p className="text-[11px] tracking-[0.14em] uppercase text-accent md:w-[132px] md:text-right">
                    Enquire{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* Hints that the list keeps going without a hard scrollbar edge. */}
        {scrolls ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-bg to-transparent" />
        ) : null}
      </div>
    </div>
  );
}
