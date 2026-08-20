import Link from "next/link";

export type TickerItem = {
  /** What the figure is — "Gold", "18ct". */
  label: string;
  /** The figure itself, already formatted. */
  value: string;
  /** The unit it is quoted in — "/oz", "/g". */
  unit?: string;
};

/**
 * The scroll, carried by the component rather than the global sheet.
 *
 * Keyframes cannot be expressed as an inline style, so they ride along in a
 * <style> tag next to the markup that uses them — which means the strip can
 * never be left un-animated by a stale stylesheet or a rule that failed to
 * make it into the build. The animation itself is set inline on the element,
 * so nothing in the cascade can outrank it either. Duplicate <style> tags are
 * harmless: two identical @keyframes of the same name are one rule.
 */
const TICKER_CSS = `
@keyframes ticker-scroll {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .ticker-track { animation: none !important; }
}
`;

/**
 * The announcement strip: live spot running under the bar.
 *
 * The scroll is one CSS animation on a track holding the list twice over,
 * translating exactly -50% — so the moment the first copy leaves, the second
 * is sitting exactly where it started and the loop is seamless. No measuring,
 * no rAF, nothing to re-run on resize; it works before hydration and keeps
 * working without JavaScript at all.
 */
export default function MarketTicker({
  items,
  stale,
}: {
  items: TickerItem[];
  /** Last figures we held rather than a live print — said plainly. */
  stale?: boolean;
}) {
  if (!items.length) return null;

  // Held roughly constant in pixels-per-second by scaling the duration to how
  // much there is to scroll: adding a metal should not speed the strip up.
  // ~45px/s at this ratio — slow enough to read a figure as it passes, fast
  // enough that the strip is visibly moving rather than looking painted on.
  const duration = Math.max(18, items.length * 4);

  return (
    <Link
      href="/metal-prices"
      /*
       * No aria-label. It read "Live metal prices" while the visible content
       * is a run of metal names and figures, so voice control had no way to
       * address the link by anything a user could see — which is exactly what
       * axe's label-content-name-mismatch rule is for. The prices themselves
       * are a better name than any summary of them.
       */
      className="group relative block overflow-hidden border-t border-fg/[0.10] bg-fg/[0.02]"
    >
      <style dangerouslySetInnerHTML={{ __html: TICKER_CSS }} />
      <div
        className="ticker-track flex w-max items-center"
        style={{ animation: `ticker-scroll ${duration}s linear infinite` }}
      >
        {/* Two copies: the first is the one screen readers get, the second is
            purely there to fill the gap the first leaves behind. */}
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1 ? true : undefined}
          >
            {items.map((item) => (
              <li
                key={`${item.label}-${item.value}`}
                className="flex items-center gap-2 whitespace-nowrap px-6 py-2 text-[10px] tracking-[0.16em] uppercase"
              >
                <span className="text-dim">{item.label}</span>
                <span className="tabular-nums text-accent transition-colors group-hover:text-champagne">
                  {item.value}
                </span>
                {/* Was text-dim/70: 2.91:1 at 10px, well under the 4.5:1
                    minimum. Full-strength dim clears it. */}
                {item.unit ? (
                  <span className="text-dim">{item.unit}</span>
                ) : null}
                <span aria-hidden="true" className="ml-4 h-2.5 w-px bg-fg/15" />
              </li>
            ))}
            {stale ? (
              <li
                className="flex items-center gap-2 whitespace-nowrap px-6 py-2 text-[10px] tracking-[0.16em] uppercase text-dim"
                aria-hidden={copy === 1 ? true : undefined}
              >
                Last print — market closed
                <span aria-hidden="true" className="ml-4 h-2.5 w-px bg-fg/15" />
              </li>
            ) : null}
          </ul>
        ))}
      </div>
    </Link>
  );
}
