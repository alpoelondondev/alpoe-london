import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import StudioClient from "./StudioClient";
import { pageMetadata, ldJsonGraph, breadcrumbLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

const PATH = "/ring-builder";

/**
 * The title targets the query, the page calls itself the Custom Studio.
 *
 * "Custom studio" has no search intent in jewellery — nobody types it — while
 * "design your own engagement ring" and "engagement ring builder" are what
 * people actually search and what competitors rank on. So the two names do
 * different jobs: the metadata goes after the search, and the brand name lives
 * on the page where it can mean something.
 */
export const metadata: Metadata = pageMetadata({
  title: "Design Your Own Engagement Ring — Ring Builder",
  description:
    "Build a bespoke engagement ring in 3D: choose the setting, diamond shape, carat, metal and UK ring size, then send your specification straight to our Hatton Garden workshop. Natural or laboratory-grown, hand-set in London.",
  path: PATH,
});

export default function RingBuilderPage() {
  return (
    <>
      <SiteHeader />

      <main>
        <section>
          <Suspense
            fallback={
              <p className="py-24 text-center text-[11px] tracking-[0.2em] uppercase text-dim">
                Loading the studio…
              </p>
            }
          >
            <StudioClient />
          </Suspense>
        </section>

        <ScrollReveal>
          <section className="border-t border-fg/[0.10] px-[52px] py-16 max-md:px-6 max-md:py-12">
            <p className="max-w-[64ch] t-copy">
              Every ring here is made to order at our bench in Hatton Garden, cast and
              hand-set once you have approved a CAD design, then hallmarked at the London
              Assay Office. If you would rather start from a sketch, an heirloom stone or
              simply a conversation, that is our{" "}
              <a href="/bespoke" className="text-accent underline underline-offset-4">
                bespoke service
              </a>
              .
            </p>
          </section>
        </ScrollReveal>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            ldJsonGraph([
              breadcrumbLd([
                { name: "Home", url: siteUrl("/") },
                { name: "Bespoke", url: siteUrl("/bespoke") },
                { name: "Ring Builder", url: siteUrl(PATH) },
              ]),
            ]),
          ),
        }}
      />
    </>
  );
}
