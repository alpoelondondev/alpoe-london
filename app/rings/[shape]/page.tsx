import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import ScrollReveal from "../../components/ScrollReveal";
import SheetFaq from "../../components/SheetFaq";
import {
  SHAPE_GUIDES,
  SHAPE_SOURCES,
  shapeGuideBySlug,
} from "@/lib/rings/shapeGuides";
import { shape as shapeById, stoneSizeMm } from "@/lib/ring/shapes";
import { pageMetadata, ldJsonGraph, faqLd, truncateForSerp } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

/**
 * One page per diamond shape.
 *
 * Sits under /rings alongside the two static children, which take precedence
 * over this dynamic segment, so /rings/engagement-and-wedding-rings and
 * /rings/ready-to-ship are unaffected. The slugs are the search phrases
 * verbatim — /rings/oval-engagement-rings, /rings/emerald-cut-engagement-rings
 * — because `{shape} engagement rings hatton garden` is a live autocomplete
 * pattern and the URL is the cheapest place to match it.
 *
 * There is no product grid on these pages, and that is deliberate rather than
 * a gap: the ring renders are not hosted yet (see lib/ring/renders.ts), so a
 * grid would be a screen of empty frames. What the page has instead is the
 * writing — which is what the competitors' shape pages are actually ranking
 * on. Queensmith's oval page carries about 350 words of editorial and 700 of
 * FAQ; 77 Diamonds' carries 250. When the renders land, a grid drops in above
 * the buying advice without any of this moving.
 *
 * Every factual claim comes from lib/rings/shapeGuides.ts, which is written
 * under a strict sourcing rule — read the comment at the top of that file
 * before adding anything here.
 */

type RouteParams = { shape: string };

export async function generateStaticParams() {
  return SHAPE_GUIDES.map((g) => ({ shape: g.slug }));
}

export async function generateMetadata(
  props: { params: Promise<RouteParams> },
): Promise<Metadata> {
  const { shape } = await props.params;
  const g = shapeGuideBySlug(shape);
  if (!g) return {};
  return pageMetadata({
    title: g.title,
    description: truncateForSerp(g.description),
    path: `/rings/${g.slug}`,
    image: "/og/engagement-rings.jpg",
  });
}

/** A one-carat stone in this shape, in millimetres. Real, and reassuringly concrete. */
function oneCaratSize(id: ReturnType<typeof shapeById>["id"]) {
  const { widthMm, lengthMm } = stoneSizeMm(id, 1);
  const w = widthMm.toFixed(1);
  const l = lengthMm.toFixed(1);
  return w === l ? `${w} mm across` : `${l} × ${w} mm`;
}

export default async function ShapePage(props: { params: Promise<RouteParams> }) {
  const { shape } = await props.params;
  const g = shapeGuideBySlug(shape);
  if (!g) notFound();

  const PATH = `/rings/${g.slug}`;
  const others = SHAPE_GUIDES.filter((o) => o.slug !== g.slug);
  const builderHref = `/ring-builder?shape=${g.shape}`;

  const ld = ldJsonGraph([
    {
      "@type": "Article",
      "@id": siteUrl(PATH) + "#article",
      headline: g.h1,
      description: g.description,
      about: [
        { "@type": "Thing", name: `${g.name} diamond` },
        { "@type": "Thing", name: "Engagement rings" },
      ],
      author: { "@id": siteUrl("/") + "#organization" },
      publisher: { "@id": siteUrl("/") + "#organization" },
      inLanguage: "en-GB",
      isPartOf: { "@id": siteUrl("/") + "#website" },
      mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(PATH) },
      // Named sources, because the gemmology on this page is checkable and
      // saying where it came from is the difference between a claim and a fact.
      citation: SHAPE_SOURCES.map((s) => ({
        "@type": "CreativeWork",
        name: s.label,
        url: s.href,
      })),
      url: siteUrl(PATH),
    },
    {
      "@type": "Service",
      "@id": siteUrl(PATH) + "#service",
      name: `${g.name} engagement rings, made to order`,
      serviceType: "Bespoke engagement ring commission",
      description: `${g.name} engagement rings designed with you and made to order at Alpoe London's bench in Hatton Garden. Natural or laboratory-grown diamonds, hallmarked at the London Assay Office.`,
      provider: { "@id": siteUrl("/") + "#localbusiness" },
      areaServed: [
        { "@type": "Place", name: "Hatton Garden, London EC1N" },
        { "@type": "Place", name: "Greater London" },
        { "@type": "Country", name: "United Kingdom" },
      ],
      url: siteUrl(PATH),
    },
    // Every question below is rendered on the page by <SheetFaq>.
    faqLd(g.faqs),
  ]);

  return (
    <>
      <SiteHeader />

      <main className="on-sheet bg-white">
        <section className="clears-nav px-[52px] pb-8 max-md:px-6 max-md:pb-6">
          <p className="t-eyebrow font-semibold">
            <Link href="/rings" className="underline underline-offset-4">
              Rings
            </Link>
          </p>
          <h1 className="t-page mt-3">{g.h1}</h1>
          <p className="mt-5 max-w-[64ch] t-copy">{g.intro}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={builderHref}
              className="inline-flex min-w-[236px] items-center justify-center bg-accent px-6 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-white transition hover:bg-accent-deep"
            >
              Build a {g.name.toLowerCase()} ring
            </Link>
            <Link
              href="/book-appointment"
              className="inline-flex min-w-[236px] items-center justify-center border border-sheet-ink/25 px-6 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-sheet-ink transition hover:border-sheet-ink/50"
            >
              See stones in person
            </Link>
          </div>
        </section>

        <section className="px-[52px] pb-10 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Rings", href: "/rings" },
              { name: g.h1, href: PATH, current: true },
            ]}
          />
        </section>

        {/* ---- the facts, stated flat --------------------------------------
            A summary table first because this is what the page is for: the
            three or four things somebody wants to know about the shape before
            they read a word of prose. */}
        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-12 max-md:px-6 max-md:py-9">
            <h2 className="t-sub">The {g.name.toLowerCase()} in brief</h2>
            <dl className="mt-6 max-w-3xl divide-y divide-sheet-line border-t border-sheet-line">
              <div className="flex gap-8 py-4 max-sm:flex-col max-sm:gap-1">
                <dt className="w-40 shrink-0 text-[13px] uppercase tracking-[0.1em] text-sheet-dim">
                  Cut style
                </dt>
                <dd className="t-copy">
                  <strong className="!text-sheet-ink">{g.cutStyle.label}.</strong>{" "}
                  {g.cutStyle.copy}
                </dd>
              </div>
              {g.facets ? (
                <div className="flex gap-8 py-4 max-sm:flex-col max-sm:gap-1">
                  <dt className="w-40 shrink-0 text-[13px] uppercase tracking-[0.1em] text-sheet-dim">
                    Facets
                  </dt>
                  <dd className="t-copy">{g.facets}</dd>
                </div>
              ) : null}
              <div className="flex gap-8 py-4 max-sm:flex-col max-sm:gap-1">
                <dt className="w-40 shrink-0 text-[13px] uppercase tracking-[0.1em] text-sheet-dim">
                  Length to width
                </dt>
                <dd className="t-copy">
                  <strong className="!text-sheet-ink">{g.ratio.headline}.</strong>{" "}
                  {g.ratio.copy}
                </dd>
              </div>
              <div className="flex gap-8 py-4 max-sm:flex-col max-sm:gap-1">
                <dt className="w-40 shrink-0 text-[13px] uppercase tracking-[0.1em] text-sheet-dim">
                  One carat measures
                </dt>
                <dd className="t-copy">
                  About {oneCaratSize(g.shape)}. A useful sanity check — carat is
                  weight, not size, and two stones of the same weight in
                  different shapes cover quite different amounts of finger.
                </dd>
              </div>
            </dl>
          </section>
        </ScrollReveal>

        {/* ---- the 4Cs, for this shape specifically ------------------------ */}
        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-12 max-md:px-6 max-md:py-9">
            <h2 className="t-sub">
              Choosing a {g.name.toLowerCase()} diamond
            </h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              General four Cs advice is written for round brilliants. Where it
              differs for this shape, it differs like this.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-8 max-lg:grid-cols-1">
              {g.grading.map((item) => (
                <div key={item.heading} className="border-t border-sheet-line pt-4">
                  <h3 className="text-[15px] font-medium text-sheet-ink">
                    {item.heading}
                  </h3>
                  <p className="mt-2 t-copy">{item.copy}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {g.watchFor ? (
          <ScrollReveal>
            <section className="border-t border-sheet-line bg-sheet-panel px-[52px] py-12 max-md:px-6 max-md:py-9">
              <h2 className="t-sub">{g.watchFor.heading}</h2>
              <p className="mt-3 max-w-[68ch] t-copy">{g.watchFor.copy}</p>
            </section>
          </ScrollReveal>
        ) : null}

        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-12 max-md:px-6 max-md:py-9">
            <div className="grid grid-cols-2 gap-10 max-lg:grid-cols-1">
              <div>
                <h2 className="t-sub">Setting a {g.name.toLowerCase()}</h2>
                <p className="mt-3 max-w-[56ch] t-copy">{g.setting}</p>
              </div>
              <div>
                <h2 className="t-sub">The wedding ring beside it</h2>
                <p className="mt-3 max-w-[56ch] t-copy">{g.band}</p>
                <p className="mt-3 max-w-[56ch] t-copy">
                  <Link
                    href="/guides/wedding-bands"
                    className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep"
                  >
                    All ten shapes compared
                  </Link>
                  , with profile, width and whether to solder the pair.
                </p>
              </div>
            </div>
            {g.history ? (
              <div className="mt-10 border-t border-sheet-line pt-6">
                <h2 className="t-sub">Where the shape comes from</h2>
                <p className="mt-3 max-w-[68ch] t-copy">{g.history}</p>
              </div>
            ) : null}
          </section>
        </ScrollReveal>

        <section className="px-[52px] pb-4 max-md:px-6">
          <SheetFaq
            items={g.faqs}
            heading={`${g.name} diamonds, answered`}
            id="faq"
          />
        </section>

        {/* ---- the other nine ---------------------------------------------- */}
        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-12 max-md:px-6 max-md:py-9">
            <h2 className="t-sub">Other shapes</h2>
            <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/rings/${o.slug}`}
                    className="text-sheet-dim underline underline-offset-4 transition hover:text-accent-deep"
                  >
                    {o.h1}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[64ch] t-copy">
              Undecided is a perfectly good place to start —{" "}
              <Link
                href="/book-appointment"
                className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep"
              >
                come and see several side by side
              </Link>
              , which is the only way to settle it. Before that, the{" "}
              <Link
                href="/guides/natural-vs-lab-grown-diamonds"
                className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep"
              >
                natural and laboratory-grown comparison
              </Link>{" "}
              and the{" "}
              <Link
                href="/ring-size-guide"
                className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep"
              >
                ring size guide
              </Link>{" "}
              are the two things worth reading.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-10 max-md:px-6 max-md:py-8">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-accent-deep">
              Sources
            </h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              Gemmological claims on this page are from the Gemological Institute
              of America. Where GIA gives no figure — facet counts for most fancy
              shapes, several length-to-width ratios — we say so rather than
              repeat a trade convention as fact.
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {SHAPE_SOURCES.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sheet-dim underline underline-offset-4 transition hover:text-accent-deep"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
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
