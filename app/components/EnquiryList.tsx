"use client";

/*
 * A client component, and not because it has any interactivity — it has none.
 *
 * Rendered on the server, every row's markup is written into the page twice:
 * once as HTML and once again inside the React Server Components payload that
 * hydration reads. With a hundred and forty Tailwind-classed rows on the Rolex
 * hub that second copy came to half a megabyte, and the page weighed 954KB.
 * A client component's payload is its props instead — a few hundred bytes of
 * strings per row — while the HTML is server-rendered exactly as before, so
 * crawlers still see every link. The component is ~2KB of JS to ship for it.
 */
import Link from "next/link";

export type EnquiryListRow = {
  id: string;
  /** WhatsApp enquiry, with the reference pre-filled. */
  href: string;
  /**
   * The piece's own page on this site, when it has one.
   *
   * Every row here used to be a single anchor straight out to WhatsApp, which
   * meant that roughly 290 product pages — all of them built, all of them in
   * the sitemap — had no internal link pointing at them from anywhere on the
   * site. A crawler could not reach a single unphotographed watch or any of
   * the thirteen jewellery pieces. The row now goes to the page and keeps the
   * WhatsApp action beside it, so the fast path out is still one tap and the
   * pages stop being orphans.
   */
  pageHref?: string;
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
        <div className="flex items-baseline justify-between gap-4 border-t border-fg/[0.14] pt-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-accent">{label}</p>
          <p className="text-[10px] tracking-[0.14em] uppercase text-dim">
            {rows.length} {rows.length === 1 ? "reference" : "references"}
          </p>
        </div>
      ) : null}

      <div className="relative mt-4">
        <ul className="list-scroll max-h-[60vh] min-h-0 overflow-y-auto border-y border-fg/[0.10]">
          {rows.map((row) => {
            const detail = (
              <div className="min-w-0 flex-1">
                {row.eyebrow ? (
                  <p className="text-[10px] tracking-[0.18em] uppercase text-accent">
                    {row.eyebrow}
                  </p>
                ) : null}
                <h3 className="t-sub mt-1">{row.title}</h3>
              </div>
            );
            const enquire = (
              <span className="text-[11px] tracking-[0.14em] uppercase text-accent md:w-[132px] md:text-right">
                Enquire{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            );
            const meta = row.meta ? (
              <p className="text-[11px] tracking-[0.14em] uppercase text-dim">{row.meta}</p>
            ) : null;

            return (
              <li key={row.id} className="border-b border-fg/[0.10] last:border-b-0">
                {row.pageHref ? (
                  // Two destinations, so two links: the row reads through to
                  // the piece's page, and "Enquire" still goes to WhatsApp.
                  <div className="group flex items-center gap-4 px-1 py-4 transition-colors hover:bg-fg/[0.04] max-md:flex-col max-md:items-stretch max-md:gap-2">
                    <Link href={row.pageHref} className="min-w-0 flex-1">
                      {detail}
                    </Link>
                    <div className="flex shrink-0 items-baseline gap-4 max-md:w-full max-md:justify-between md:justify-end">
                      {meta}
                      <a
                        href={row.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={row.ariaLabel ?? `Enquire about ${row.title} on WhatsApp`}
                      >
                        {enquire}
                      </a>
                    </div>
                  </div>
                ) : (
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={row.ariaLabel ?? `Enquire about ${row.title} on WhatsApp`}
                    className="group flex items-center gap-4 px-1 py-4 transition-colors hover:bg-fg/[0.04] max-md:flex-col max-md:items-stretch max-md:gap-2"
                  >
                    {detail}
                    <div className="flex shrink-0 items-baseline gap-4 max-md:w-full max-md:justify-between md:justify-end">
                      {meta}
                      {enquire}
                    </div>
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* Hints that the list keeps going without a hard scrollbar edge. */}
        {scrolls ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-bg to-transparent" />
        ) : null}
      </div>
    </div>
  );
}
