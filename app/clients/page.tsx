import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ScrollReveal from "../components/ScrollReveal";
import CTAStrip from "../components/CTAStrip";
import FAQ from "../components/FAQ";
import { CLIENTS, clientInitials } from "@/lib/clients";
import { CLIENTS_FAQS } from "@/lib/faqs";
import { pageMetadata, ldJsonGraph, faqLd } from "@/lib/seo";
import { SITE, siteUrl } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

const PATH = ROUTES.clients;

const DESCRIPTION =
  "Alpoe London dresses TV personalities including Gemma Collins, VIP collectors and first-time buyers in bespoke jewellery made in Hatton Garden, London.";

export const metadata: Metadata = pageMetadata({
  title: "Our Clients — Celebrity & VIP Jewellery",
  description: DESCRIPTION,
  path: PATH,
});

/**
 * Who walks through the door. The page opens on the range rather than the
 * names, because the point of a roster is that the person reading it is
 * welcome on it — whoever they are.
 */
const CLIENT_TYPES = [
  {
    title: "Public Figures",
    copy: "Pieces chosen for camera, stage and the red carpet — set to catch studio light and hold up in a still frame.",
  },
  {
    title: "Collectors",
    copy: "Rare references sourced worldwide and stones matched to a brief, for clients who know the market as well as we do.",
  },
  {
    title: "First-Time Buyers",
    copy: "A first engagement ring or first serious watch, explained plainly and priced fairly, with no pressure at the counter.",
  },
  {
    title: "The Trade",
    copy: "Dealers and industry insiders who come to Hatton Garden for sourcing, valuation and a second opinion on a stone.",
  },
];

export default function ClientsPage() {
  /*
   * Each client is published as a Person with `sameAs` pointing at their own
   * verified profiles. That is what tells a search engine *which* Gemma
   * Collins this page means, and ties the page to the entity people search
   * for — the name alone is ambiguous, the profiles are not.
   */
  const ld = ldJsonGraph([
    {
      "@type": "CollectionPage",
      "@id": siteUrl(PATH) + "#clients",
      url: siteUrl(PATH),
      name: `${SITE.name} Clients`,
      description: DESCRIPTION,
      about: { "@id": siteUrl("/") + "#organization" },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: CLIENTS.length,
        itemListElement: CLIENTS.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Person",
            "@id": `${siteUrl(PATH)}#${c.slug}`,
            name: c.name,
            jobTitle: c.role,
            description: c.blurb,
            sameAs: [...c.links.map((l) => l.href), ...c.references],
          },
        })),
      },
    },
    // Breadcrumbs are emitted by the <Breadcrumbs> component below.
    faqLd(CLIENTS_FAQS),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Clients"
          title="Our Clients"
          copy="From faces you know from prime-time television to the person buying their very first ring — every Alpoe London client is looked after the same way: privately, personally, from our Hatton Garden bench."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Clients", href: PATH, current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-16 max-md:px-6">
          <ScrollReveal>
            <div className="max-w-3xl">
              <p className="t-copy">
                Some of our clients are photographed wearing their pieces. Most are not, and
                never will be. A household name and a first-time buyer get the same private
                consultation, the same sourcing and the same{" "}
                <Link href={ROUTES.bespoke} className="text-accent hover:text-blush">
                  bespoke bench
                </Link>
                . The clients below have chosen to be named.
              </p>
            </div>
          </ScrollReveal>

          <ul className="mt-14 grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {CLIENT_TYPES.map((t, i) => (
              <li key={t.title}>
                <ScrollReveal delay={i * 0.08}>
                  <div className="h-full border border-fg/[0.10] bg-fg/[0.04] p-6">
                    <h2 className="t-sub">{t.title}</h2>
                    <p className="mt-3 t-copy">{t.copy}</p>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-fg/10 px-[52px] py-16 max-md:px-6 max-md:py-12">
          <ScrollReveal>
            <p className="t-eyebrow">The Roster</p>
            <h2 className="t-section mt-3">Worn By</h2>
          </ScrollReveal>

          <ul className="mt-10 flex flex-col gap-px bg-fg/[0.10]">
            {CLIENTS.map((c) => (
              <li key={c.slug} id={c.slug} className="scroll-mt-32 bg-bg">
                <ScrollReveal>
                  <article className="grid grid-cols-[auto_1fr] items-center gap-10 py-10 max-md:grid-cols-1 max-md:gap-6">
                    {/* A monogram rather than a photograph: a picture of a
                        client needs their permission and the photographer's,
                        and initials in the house serif need neither. */}
                    <div
                      aria-hidden="true"
                      className="flex h-40 w-40 items-center justify-center border border-accent/50 bg-panel max-md:h-28 max-md:w-28"
                    >
                      <span className="t-page !text-blush">
                        {clientInitials(c.name)}
                      </span>
                    </div>
                    <div className="max-w-2xl">
                      <p className="t-eyebrow">
                        {c.role}
                      </p>
                      <h3 className="t-section mt-3">
                        {c.name}
                      </h3>
                      <p className="mt-4 t-copy">{c.blurb}</p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        {c.links.map((l) => (
                          // Followed links, and the referrer kept: the
                          // client's team should be able to see the visits
                          // that came from here.
                          <a
                            key={l.href}
                            href={l.href}
                            target="_blank"
                            rel="noopener"
                            className="inline-flex items-center gap-2 border border-fg/20 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-fg/80 transition hover:border-accent hover:text-blush"
                          >
                            {l.label}
                            <span className="normal-case tracking-normal text-fg/50">
                              {l.handle}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </section>

        <FAQ items={CLIENTS_FAQS} />
        <CTAStrip
          eyebrow="Join them"
          title="Become an Alpoe London client"
          copy="Whether it is a first ring or a piece for the cameras, it starts with a private conversation in Hatton Garden."
          whatsappMessage="Hi Alpoe, I'd like to talk to you about becoming a client."
          secondary={{ label: "Book an Appointment", href: ROUTES.bookAppointment }}
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
