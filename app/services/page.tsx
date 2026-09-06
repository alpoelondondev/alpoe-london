import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ScrollReveal from "../components/ScrollReveal";
import { SERVICE_GUIDES } from "@/lib/services/serviceGuides";
import { pageMetadata, ldJsonGraph, collectionLd } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

/**
 * The workshop hub.
 *
 * Exists for the same reason /guides does: three service pages with no parent
 * would each sit at the end of a cul-de-sac, reachable only from the footer
 * and from each other. This gives them a breadcrumb parent, a second and third
 * inbound link, and somewhere for the rest of the bench's work to go when it
 * earns a page.
 */

export const metadata: Metadata = pageMetadata({
  title: "Workshop Services in Hatton Garden",
  description:
    "Ring resizing, jewellery repairs and remodelling inherited pieces, done at our own bench in Hatton Garden and hallmarked at the London Assay Office.",
  path: ROUTES.services,
  image: "/og/bespoke.jpg",
});

export default function ServicesPage() {
  const ld = ldJsonGraph(
    collectionLd({
      name: "Workshop services",
      description:
        "Ring resizing, jewellery repairs and remodelling, at Alpoe London's bench in Hatton Garden.",
      path: ROUTES.services,
      products: SERVICE_GUIDES.map((s) => ({ title: s.h1, url: s.path })),
    }),
  );

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Workshop"
          title="Workshop Services in Hatton Garden"
          copy="Resizing, repairs and remodelling, done at our own bench rather than sent away. Bring a piece in — it does not have to be one we made."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Services", href: ROUTES.services, current: true },
            ]}
          />
        </section>

        <ScrollReveal>
          <section className="px-[52px] pb-14 max-md:px-6">
            <p className="max-w-[68ch] t-copy">
              The bench is upstairs from the counter, which is the practical
              reason to bring a piece here rather than post it somewhere: the
              person who will do the work can look at it while you wait and tell
              you what it needs, what it does not need, and when the honest
              answer is to leave it alone. The London Assay Office counter is on
              Greville Street, inside the quarter, so anything requiring a
              hallmark is a walk rather than a wait.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <dl className="divide-y divide-fg/[0.08] border-t border-fg/[0.08]">
              {SERVICE_GUIDES.map((s) => (
                <div key={s.slug} className="py-6">
                  <dt>
                    <Link
                      href={s.path}
                      className="font-serif text-[22px] leading-tight text-blush underline underline-offset-4 transition hover:text-accent"
                    >
                      {s.h1}
                    </Link>
                  </dt>
                  <dd className="mt-2 max-w-[68ch] t-copy">{s.blurb}</dd>
                </div>
              ))}
            </dl>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">Related</h2>
            <ul className="mt-6 flex flex-col gap-3">
              <li>
                <Link
                  href={ROUTES.hallmarking}
                  className="t-copy underline underline-offset-4 hover:text-accent"
                >
                  What a British hallmark certifies
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.ringSizeGuide}
                  className="t-copy underline underline-offset-4 hover:text-accent"
                >
                  Ring size guide and UK size chart
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.bespoke}
                  className="t-copy underline underline-offset-4 hover:text-accent"
                >
                  Bespoke commissions
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.sell}
                  className="t-copy underline underline-offset-4 hover:text-accent"
                >
                  Sell or part-exchange
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
