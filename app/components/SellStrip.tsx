import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { sellBrandBySlug } from "@/lib/sell/brands";
import { ROUTES } from "@/lib/routes";

/**
 * The link from a watch page to the matching /sell/[brand] page.
 *
 * Search Console, three months to 2026-09-19: the watch pages rank and the
 * sell pages do not. /watches/rolex sits at position 8.7 and
 * /watches/audemars-piguet at 11.6, while "sell my audemars piguet london"
 * (8 impressions) sits at 87 and "sell rolex hatton garden" at 76. The sell
 * pages are not thin — they are the most detailed pages on the site — they
 * were simply orphaned: linked from the /sell hub and from each other, and
 * from nowhere else. Nothing that Google rates was pointing at them.
 *
 * So this is a link from the page that has the standing to the page that
 * needs it, on the one subject both pages share. It renders as prose with an
 * inline anchor rather than a button, because the anchor text and the sentence
 * around it are the part that carries meaning.
 *
 * It renders nothing when the brand has no sell page. Five of the eight watch
 * brands have one, deliberately — see lib/sell/brands.ts for why the other
 * three do not, and do not "fix" this by adding empty pages for them.
 */
export default function SellStrip({ brandSlug }: { brandSlug: string }) {
  const sell = sellBrandBySlug(brandSlug);
  if (!sell) return null;

  return (
    <ScrollReveal>
      <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
        <h2 className="t-section">Selling a {sell.name} instead?</h2>
        <p className="mt-4 max-w-[68ch] t-copy">
          We buy {sell.name} outright and take {sell.name} in part-exchange at
          our counter in Hatton Garden — send the reference number, the year and
          a few photographs and you will have a no-obligation figure back the
          same day.{" "}
          <Link
            href={ROUTES.sellBrand(sell.slug)}
            className="text-accent underline underline-offset-4"
          >
            Sell your {sell.name} in London
          </Link>{" "}
          sets out what moves the number, which references the desk is asked
          after and what the paperwork is actually worth.
        </p>
      </section>
    </ScrollReveal>
  );
}
