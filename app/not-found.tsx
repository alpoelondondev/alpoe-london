import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";

/**
 * A 404 that still does a job.
 *
 * Most of the traffic that lands here is a crawler following a stale link or a
 * customer who mistyped, and in both cases a dead end is a wasted visit. So
 * this page names the handful of routes worth going to next — which also gives
 * a crawler somewhere to go, rather than treating the miss as a leaf.
 *
 * Noindex, follow: the page itself should never appear in results, but the
 * links out of it should absolutely be crawled.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const ROUTES: { href: string; label: string; note: string }[] = [
  {
    href: "/rings/engagement-and-wedding-rings",
    label: "Engagement & wedding rings",
    note: "Bespoke solitaires, halos, three-stone and eternity bands",
  },
  {
    href: "/ring-builder",
    label: "Build your own ring",
    note: "Choose the shape, stone, setting and metal",
  },
  { href: "/bespoke", label: "Bespoke commissions", note: "From sketch to hallmarked piece" },
  { href: "/jewellery", label: "Jewellery", note: "Earrings, necklaces, bracelets and pendants" },
  { href: "/watches", label: "Luxury watches", note: "Rolex, Audemars Piguet, Patek Philippe and more" },
  { href: "/sell", label: "Sell your watch or jewellery", note: "Valuation and part-exchange" },
  { href: "/ring-size-guide", label: "Ring size guide", note: "Measure a UK ring size at home" },
  {
    href: "/guides/natural-vs-lab-grown-diamonds",
    label: "Natural vs lab-grown diamonds",
    note: "How they differ, and how to choose",
  },
  { href: "/book-appointment", label: "Book an appointment", note: "See us in Hatton Garden" },
];

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="px-[52px] pt-52 pb-24 max-md:px-6 max-md:pt-48">
        <p className="text-[11px] uppercase tracking-[0.14em] text-accent">404</p>
        <h1 className="t-page mt-4 max-w-3xl">We couldn&apos;t find that page</h1>
        <p className="mt-6 max-w-2xl t-copy font-light text-dim">
          The link may be out of date, or the address slightly off. Here is
          everything worth seeing instead.
        </p>

        <ul className="mt-14 grid grid-cols-3 gap-px bg-white/10 max-lg:grid-cols-2 max-md:grid-cols-1">
          {ROUTES.map((r) => (
            <li key={r.href} className="bg-bg">
              <Link href={r.href} className="block p-8 h-full hover:bg-white/5 transition-colors">
                <span className="block text-[13px] uppercase tracking-[0.1em]">{r.label}</span>
                <span className="mt-2 block text-sm font-light text-dim">{r.note}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-14 text-sm font-light text-dim">
          Still stuck?{" "}
          <Link href="/contact" className="text-accent underline underline-offset-4">
            Get in touch
          </Link>{" "}
          and we&apos;ll point you at the right thing.
        </p>
      </main>
      <Footer />
    </>
  );
}
