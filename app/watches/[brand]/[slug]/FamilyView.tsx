import Link from "next/link";
import SiteHeader from "../../../components/SiteHeader";
import Footer from "../../../components/Footer";
import WhatsAppButton from "../../../components/WhatsAppButton";
import Breadcrumbs from "../../../components/Breadcrumbs";
import BrandHero from "../../../components/BrandHero";
import CatalogueGrid from "../../../components/CatalogueGrid";
import { toGridTiles } from "../../../components/ProductGrid";
import ScrollReveal from "../../../components/ScrollReveal";
import SellStrip from "../../../components/SellStrip";
import { productUrl } from "@/lib/products";
import { getPublishedFamilies, type PublishedFamily } from "@/lib/watches/modelFamilies";
import { ldJsonGraph, collectionLd } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";
import type { WatchBrandSlug } from "@/lib/types";

/**
 * A model-family page: every watch of one family in stock, the verified
 * overview of each model in it, and a specification table by reference.
 *
 * See lib/watches/modelFamilies.ts for why this is a family and not a
 * catalogue model, and for what keeps it from being a thin page.
 */
export default async function FamilyView({
  brandName,
  brandSlug,
  family,
}: {
  brandName: string;
  brandSlug: WatchBrandSlug;
  family: PublishedFamily;
}) {
  const path = ROUTES.watchFamily(brandSlug, family.slug);
  const siblings = (await getPublishedFamilies(brandSlug)).filter(
    (f) => f.slug !== family.slug,
  );
  const [lead, ...rest] = family.overviews;

  const modelOptions = [...new Set(family.products.map((p) => p.model).filter(Boolean))]
    .sort()
    .map((m) => ({ value: m as string, label: m as string }));

  const ld = ldJsonGraph([
    ...collectionLd({
      name: `${brandName} ${family.name}`,
      description: lead.text,
      path,
      products: family.products.map((p) => ({ title: p.title, url: productUrl(p) })),
    }),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow={brandName}
          title={`${brandName} ${family.name} for Sale in London`}
          copy={`${family.products.length} authenticated ${brandName} ${family.name} watches in stock, each checked by our specialists. View them at our Hatton Garden or Birmingham counter.`}
        />

        <section className="px-[52px] py-4 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Watches", href: ROUTES.watches },
              { name: brandName, href: ROUTES.watchBrand(brandSlug) },
              { name: family.name, href: path, current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-10 max-md:px-6">
          <ScrollReveal>
            <p className="max-w-[70ch] t-copy">{lead.text}</p>
          </ScrollReveal>
        </section>

        <section className="px-[52px] pb-20 max-md:px-6">
          <CatalogueGrid tiles={toGridTiles(family.products)} modelOptions={modelOptions} />
        </section>

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">
              {brandName} {family.name} references in stock
            </h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
                <thead>
                  <tr className="border-b border-fg/[0.14] text-[11px] uppercase tracking-[0.14em] text-dim">
                    <th className="py-3 pr-6 font-normal">Reference</th>
                    <th className="py-3 pr-6 font-normal">Watch</th>
                    <th className="py-3 pr-6 font-normal">Case</th>
                    <th className="py-3 pr-6 font-normal">Dial</th>
                    <th className="py-3 font-normal">Materials</th>
                  </tr>
                </thead>
                <tbody>
                  {family.products.map((p) => (
                    <tr key={p.id} className="border-b border-fg/[0.08] align-top">
                      <td className="py-3 pr-6 text-blush">{p.referenceNumber ?? "—"}</td>
                      <td className="py-3 pr-6">
                        <Link
                          href={productUrl(p)}
                          className="text-fg/80 transition-colors hover:text-accent"
                        >
                          {p.title}
                        </Link>
                      </td>
                      <td className="py-3 pr-6 text-fg/70">{p.caseSize ?? "—"}</td>
                      <td className="py-3 pr-6 text-fg/70">{p.dial ?? "—"}</td>
                      <td className="py-3 text-fg/70">{p.materials ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </ScrollReveal>

        {rest.length ? (
          <ScrollReveal>
            <section className="border-t border-fg/10 bg-panel-soft px-[52px] py-14 max-md:px-6 max-md:py-10">
              <h2 className="t-section">The {family.name} range</h2>
              <dl className="mt-8 divide-y divide-fg/[0.08] border-t border-fg/[0.08]">
                {rest.map((o) => (
                  <div key={o.model} className="py-5">
                    <dt className="font-serif text-[19px] leading-tight text-blush">
                      {o.model}
                    </dt>
                    <dd className="mt-2 max-w-[70ch] t-copy">{o.text}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </ScrollReveal>
        ) : null}

        <SellStrip brandSlug={brandSlug} />

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">More {brandName}</h2>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
              {siblings.map((f) => (
                <li key={f.slug}>
                  <Link
                    href={ROUTES.watchFamily(brandSlug, f.slug)}
                    className="text-fg/60 transition-colors hover:text-accent"
                  >
                    {brandName} {f.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={ROUTES.watchBrand(brandSlug)}
                  className="text-fg/60 transition-colors hover:text-accent"
                >
                  All {brandName}
                </Link>
              </li>
            </ul>
          </section>
        </ScrollReveal>
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
