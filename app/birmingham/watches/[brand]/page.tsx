import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../../components/SiteHeader";
import Footer from "../../../components/Footer";
import WhatsAppButton from "../../../components/WhatsAppButton";
import Breadcrumbs from "../../../components/Breadcrumbs";
import BrandHero from "../../../components/BrandHero";
import CatalogueGrid from "../../../components/CatalogueGrid";
import { toGridTiles } from "../../../components/ProductGrid";
import ScrollReveal from "../../../components/ScrollReveal";
import CTAStrip from "../../../components/CTAStrip";
import { WATCH_BRANDS, watchBrandBySlug } from "@/lib/taxonomy";
import { getWatchesByBrand, productUrl } from "@/lib/products";
import { getCatalogueProductsByBrand, mergeBrandListings } from "@/lib/catalogue";
import { sellBrandBySlug } from "@/lib/sell/brands";
import { BIRMINGHAM } from "@/lib/locations/copy";
import { pageMetadata, ldJsonGraph, collectionLd, truncateForSerp } from "@/lib/seo";
import { locationBySlug } from "@/lib/site";
import { ROUTES } from "@/lib/routes";
import type { WatchBrandSlug } from "@/lib/types";

/**
 * "hublot birmingham" — the query this whole spine was built for.
 *
 * 49 impressions in the three months to 2026-09-19, at position 61, and the
 * single largest non-brand query the site has. It was resolving to
 * /watches/hublot, a page that does not contain the word Birmingham, for a
 * business that has a shop there.
 *
 * ── What keeps this from being a doorway page ──
 *
 * It lists the real stock, which is the substance: the same inventory is
 * genuinely viewable at either counter, so a Birmingham buyer looking at this
 * grid is looking at watches they can actually handle this week. That is a
 * true statement about a real shop, not a city name sprinkled over a copy.
 *
 * The brand's editorial — the model families and the what-to-check guide on
 * /watches/[brand] — is deliberately NOT repeated here. Those sections are
 * about the watches and have nothing to do with the city, so duplicating them
 * would add length without adding anything a Birmingham reader needs, and
 * would be the clearest possible signal that these pages are templated. This
 * page carries the local framing and the stock, and links to the London page
 * for the editorial.
 *
 * ── Watch this in Search Console ──
 *
 * Eight of these exist and they are thinner than the London equivalents by
 * design. If they come back as "Duplicate, Google chose a different canonical"
 * then the right response is to cut them to the brands with real local demand
 * — Hublot above all — rather than to add filler to all eight.
 */

type RouteParams = { brand: string };

export const dynamicParams = false;

export async function generateStaticParams() {
  return WATCH_BRANDS.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata(
  props: { params: Promise<RouteParams> },
): Promise<Metadata> {
  const { brand } = await props.params;
  const b = watchBrandBySlug(brand);
  if (!b) return {};
  return pageMetadata({
    // "Hublot Birmingham" is the query. The brand leads and the city follows,
    // because that is the order people type it in.
    title: `${b.name} Birmingham — Watches for Sale`,
    description: truncateForSerp(
      `Authenticated ${b.name} watches, viewable at Alpoe's Birmingham counter. We also buy and part-exchange ${b.name} — priced by reference, not by brand.`,
    ),
    path: ROUTES.birminghamWatchBrand(b.slug),
  });
}

export default async function BirminghamBrandPage(
  props: { params: Promise<RouteParams> },
) {
  const { brand } = await props.params;
  const b = watchBrandBySlug(brand);
  if (!b) notFound();

  const slug = b.slug as WatchBrandSlug;
  const LOCATION = locationBySlug("birmingham")!;

  const all = mergeBrandListings(
    getWatchesByBrand(slug),
    await getCatalogueProductsByBrand(slug),
  );

  const modelOptions = [...new Set(all.map((p) => p.model).filter(Boolean))]
    .sort()
    .map((m) => ({ value: m as string, label: m as string }));

  // Not every watch brand has a sell page — five did, Hublot is the sixth, and
  // the rest deliberately do not. See lib/sell/brands.ts.
  const sell = sellBrandBySlug(slug);
  const hasLocalSell = sell && slug in BIRMINGHAM.sellIntros;

  const ld = ldJsonGraph([
    ...collectionLd({
      name: `${b.name} Watches in Birmingham`,
      description: `Authenticated ${b.name} watches available to view at Alpoe's Birmingham counter.`,
      path: ROUTES.birminghamWatchBrand(slug),
      products: all.map((p) => ({ title: p.title, url: productUrl(p) })),
    }),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Birmingham"
          title={`${b.name} in Birmingham`}
          copy={`Our ${b.name} stock, viewable at the Birmingham counter. Everything listed here can be brought to whichever of our two shops suits you — tell us which and give us a day's notice if the piece is currently in London.`}
        />

        <section className="px-[52px] py-4 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Birmingham", href: ROUTES.birmingham },
              {
                name: b.name,
                href: ROUTES.birminghamWatchBrand(slug),
                current: true,
              },
            ]}
          />
        </section>

        <section className="px-[52px] pb-20 max-md:px-6">
          <CatalogueGrid tiles={toGridTiles(all)} modelOptions={modelOptions} />
        </section>

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">Viewing a {b.name} in Birmingham</h2>
            <p className="mt-4 max-w-[68ch] t-copy">
              One stock, two counters. {LOCATION.city} and Hatton Garden work
              from the same inventory and the same specialist desk, so the only
              thing that changes between them is your journey. Message us with
              the reference you want to see and we will confirm which shop it is
              in and have it at the other if that is easier.
            </p>
            <p className="mt-4 max-w-[68ch] t-copy">
              For the {b.name} model families and what to check on a pre-owned
              one,{" "}
              <Link
                href={ROUTES.watchBrand(slug)}
                className="text-accent underline underline-offset-4"
              >
                our {b.name} guide
              </Link>{" "}
              covers the detail — it applies whichever counter you use.
            </p>
          </section>
        </ScrollReveal>

        {hasLocalSell ? (
          <ScrollReveal>
            <section className="border-t border-fg/10 bg-panel-soft px-[52px] py-14 max-md:px-6 max-md:py-10">
              <h2 className="t-section">Selling a {b.name} instead?</h2>
              <p className="mt-4 max-w-[68ch] t-copy">
                We buy {b.name} outright and take {b.name} in part-exchange at
                the Birmingham counter, on identical terms to London — send the
                reference number, the year and a few photographs and you will
                have a no-obligation figure back the same day.{" "}
                <Link
                  href={ROUTES.birminghamSellBrand(slug)}
                  className="text-accent underline underline-offset-4"
                >
                  Sell your {b.name} in Birmingham
                </Link>{" "}
                sets out what moves the number and what the paperwork is worth.
              </p>
            </section>
          </ScrollReveal>
        ) : null}

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">Other brands in Birmingham</h2>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
              {WATCH_BRANDS.filter((o) => o.slug !== slug).map((o) => (
                <li key={o.slug}>
                  <Link
                    href={ROUTES.birminghamWatchBrand(o.slug)}
                    className="text-fg/60 transition-colors hover:text-accent"
                  >
                    {o.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={ROUTES.birmingham}
                  className="text-fg/60 transition-colors hover:text-accent"
                >
                  The Birmingham counter
                </Link>
              </li>
            </ul>
          </section>
        </ScrollReveal>

        <CTAStrip
          eyebrow={`${b.name} · Birmingham`}
          title="Tell us which piece and which counter"
          copy="We will confirm availability and have it ready at the shop that suits you. No appointment strictly needed, but a message first means the right specialist is in."
          whatsappMessage={`Hi Alpoe — I'd like to view a ${b.name} at your Birmingham counter.`}
          secondary={{ label: "All of Birmingham", href: ROUTES.birmingham }}
        />
      </main>
      <Footer />
      <WhatsAppButton />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
