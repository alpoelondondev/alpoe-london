import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import ScrollReveal from "../components/ScrollReveal";
import FAQ from "../components/FAQ";
import { CLIENTS, clientInitials, type Client } from "@/lib/clients";
import { CLIENTS_FAQS } from "@/lib/faqs";
import { pageMetadata, ldJsonGraph, faqLd } from "@/lib/seo";
import { SITE, siteUrl } from "@/lib/site";
import { asset } from "@/lib/assets";
import { ROUTES } from "@/lib/routes";

const PATH = ROUTES.clients;

const DESCRIPTION =
  "Alpoe London dresses TV personalities including Gemma Collins, VIP collectors and first-time buyers in bespoke jewellery made in Hatton Garden, London.";

export const metadata: Metadata = pageMetadata({
  title: "Our Clients — Celebrity & VIP Jewellery",
  description: DESCRIPTION,
  path: PATH,
});

/*
 * Line icons for the four kinds of client, drawn on one 24-unit grid at one
 * stroke weight so they read as a set.
 */
const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "h-6 w-6",
} as const;

const ICONS: Record<string, ReactNode> = {
  // A four-point sparkle: the camera flash.
  spotlight: (
    <svg {...ICON_PROPS}>
      <path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z" />
      <path d="M19 16.5c.2 1.3.9 2 2.2 2.2-1.3.2-2 .9-2.2 2.2-.2-1.3-.9-2-2.2-2.2 1.3-.2 2-.9 2.2-2.2Z" />
    </svg>
  ),
  watch: (
    <svg {...ICON_PROPS}>
      <path d="M9 3.4h6l-.5 3.2M9 20.6h6l-.5-3.2M9.5 6.6L9 3.4M9.5 17.4L9 20.6" />
      <circle cx="12" cy="12" r="5.4" />
      <path d="M12 9.1V12l1.9 1.2" />
    </svg>
  ),
  ring: (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="15" r="5.6" />
      <path d="M9.6 6.2 12 9.4l2.4-3.2-1-1.6h-2.8l-1 1.6Z" />
    </svg>
  ),
  loupe: (
    <svg {...ICON_PROPS}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5.5 5.5" />
      <path d="M8.4 9.6 10.5 12l2.1-2.4-.6-1h-3l-.6 1Z" />
    </svg>
  ),
};

/**
 * Who walks through the door. The page opens on the range rather than the
 * names, because the point of a roster is that the person reading it is
 * welcome on it — whoever they are.
 */
const CLIENT_TYPES = [
  {
    icon: "spotlight",
    title: "Public Figures",
    copy: "Pieces chosen for camera, stage and the red carpet — set to catch studio light and hold up in a still frame.",
  },
  {
    icon: "watch",
    title: "Collectors",
    copy: "Rare references sourced worldwide and stones matched to a brief, for clients who know the market as well as we do.",
  },
  {
    icon: "ring",
    title: "First-Time Buyers",
    copy: "A first engagement ring or first serious watch, explained plainly and priced fairly, with no pressure at the counter.",
  },
  {
    icon: "loupe",
    title: "The Trade",
    copy: "Dealers and industry insiders who come to Hatton Garden for sourcing, valuation and a second opinion on a stone.",
  },
];

/** Brand marks for the profile buttons, keyed by the link's label. */
const SOCIAL_ICONS: Record<string, ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
    </svg>
  ),
};

/** The filled pill — one per section, so each has one obvious answer. */
const PILL_PRIMARY =
  "inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-bg transition hover:bg-accent-deep";
const PILL_OUTLINE =
  "inline-flex items-center justify-center gap-2.5 rounded-full border border-fg/25 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg transition hover:border-accent hover:text-blush";

function ClientFeature({ client: c }: { client: Client }) {
  return (
    <article
      id={c.slug}
      className="scroll-mt-32 grid grid-cols-[5fr_7fr] overflow-hidden rounded-card border border-accent/25 bg-gradient-to-br from-panel via-panel-soft to-bg shadow-2xl shadow-accent/15 max-md:grid-cols-1"
    >
      <div className="relative min-h-[520px] max-md:min-h-[360px]">
        <Image
          src={c.image.src}
          alt={c.image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 42vw"
          className="object-cover"
        />
        {/* Lands the photograph on the panel's own colour, rightwards on a
            desktop and downwards on a phone, so the card reads as one piece. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-panel max-md:bg-gradient-to-b"
        />
        <span className="absolute left-5 top-5 rounded-full border border-fg/15 bg-bg/60 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-champagne backdrop-blur-md">
          Featured Client
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-5 left-5 flex h-16 w-16 items-center justify-center rounded-full border border-accent/50 bg-bg/60 text-[18px] font-semibold tracking-[0.08em] text-blush backdrop-blur-md"
        >
          {clientInitials(c.name)}
        </span>
      </div>

      <div className="flex flex-col justify-center p-14 max-lg:p-10 max-md:p-7">
        <p className="t-eyebrow">{c.role}</p>
        <h3 className="t-page mt-4 !text-blush">{c.name}</h3>
        <div aria-hidden="true" className="mt-6 h-px w-16 bg-accent" />
        <p className="t-copy mt-6 max-w-xl">{c.blurb}</p>

        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-fg/45">
          Known for
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {c.knownFor.map((k) => (
            <li
              key={k}
              className="rounded-full border border-fg/15 bg-fg/[0.04] px-4 py-1.5 text-[12px] text-fg/80"
            >
              {k}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          {c.links.map((l, i) => (
            // Followed links, and the referrer kept: the client's team should
            // be able to see the visits that came from here.
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener"
              className={i === 0 ? PILL_PRIMARY : PILL_OUTLINE}
            >
              {SOCIAL_ICONS[l.label]}
              {l.label}
              <span className="font-normal normal-case tracking-normal opacity-70">
                {l.handle}
              </span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

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
            description: `${c.blurb} Known for ${c.knownFor.join(", ")}.`,
            sameAs: [...c.links.map((l) => l.href), ...c.references],
          },
        })),
      },
    },
    // Breadcrumbs are emitted by the <Breadcrumbs> component below.
    faqLd(CLIENTS_FAQS),
  ]);

  const featured = CLIENTS[0];

  return (
    <>
      <SiteHeader />
      <main>
        {/* The opening: the house film in a rounded panel, inset from the
            page edges rather than full bleed, so the page reads as a set of
            cards from the first screen. */}
        <section className="px-[52px] pt-52 max-md:px-4 max-md:pt-44">
          <div className="relative flex min-h-[460px] items-end overflow-hidden rounded-card border border-fg/10 max-md:min-h-[420px]">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/alpoe-london-hero.jpg"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50"
            >
              <source src={asset("/alpoe-london-hero.mp4")} type="video/mp4" />
            </video>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/20" />

            <div className="relative w-full p-14 max-md:p-7">
              <ScrollReveal>
                <span className="inline-block rounded-full border border-accent/40 bg-bg/50 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne backdrop-blur-md">
                  Clients
                </span>
                <h1 className="t-page mt-5 max-w-3xl">Our Clients</h1>
                <p className="t-copy mt-5 max-w-2xl !text-fg/80">
                  From faces you know from prime-time television to the person buying their very
                  first ring — every Alpoe London client is looked after the same way: privately,
                  personally, from our Hatton Garden bench.
                </p>
                {featured ? (
                  <a
                    href={`#${featured.slug}`}
                    className="group mt-8 inline-flex items-center gap-3 rounded-full border border-fg/15 bg-bg/50 py-1.5 pl-1.5 pr-5 text-[12px] text-fg/85 backdrop-blur-md transition hover:border-accent"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[10px] font-semibold tracking-[0.06em] text-bg">
                      {clientInitials(featured.name)}
                    </span>
                    Worn on screen by {featured.name}
                    <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
                  </a>
                ) : null}
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Clients", href: PATH, current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-20 max-md:px-4 max-md:pb-14">
          <ScrollReveal>
            <div className="grid grid-cols-[5fr_7fr] items-end gap-10 max-md:grid-cols-1 max-md:gap-5 max-md:px-2">
              <h2 className="t-section">Discretion is the service.</h2>
              <p className="t-copy">
                Some of our clients are photographed wearing their pieces. Most are not, and never
                will be. A household name and a first-time buyer get the same private consultation,
                the same sourcing and the same{" "}
                <Link href={ROUTES.bespoke} className="text-accent underline-offset-4 hover:text-blush hover:underline">
                  bespoke bench
                </Link>
                . The clients below have chosen to be named.
              </p>
            </div>
          </ScrollReveal>

          <ul className="mt-12 grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {CLIENT_TYPES.map((t, i) => (
              <li key={t.title}>
                <ScrollReveal delay={i * 0.08} className="h-full">
                  <div className="group h-full rounded-card border border-fg/[0.08] bg-gradient-to-b from-fg/[0.06] to-fg/[0.02] p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/40">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-bg">
                      {ICONS[t.icon]}
                    </span>
                    <h3 className="t-sub mt-6">{t.title}</h3>
                    <p className="t-copy mt-3">{t.copy}</p>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </section>

        <section className="px-[52px] pb-20 max-md:px-4 max-md:pb-14">
          <ScrollReveal>
            <div className="mb-10 text-center">
              <p className="t-eyebrow">The Roster</p>
              <h2 className="t-section mt-3">Worn By</h2>
            </div>
          </ScrollReveal>

          <div className="flex flex-col gap-6">
            {CLIENTS.map((c) => (
              <ScrollReveal key={c.slug}>
                <ClientFeature client={c} />
              </ScrollReveal>
            ))}

            {/* The open seat. With a short roster this is what stops the
                list reading as finished — and it is the page's one ask. */}
            <ScrollReveal>
              <div className="flex flex-col items-center rounded-card border border-dashed border-accent/35 bg-accent/[0.04] px-8 py-14 text-center max-md:px-6 max-md:py-10">
                <p className="t-eyebrow">The Next Name</p>
                <h3 className="t-section mt-3">Reserved for you</h3>
                <p className="t-copy mt-4 max-w-lg">
                  Whether it is a first ring or a piece for the cameras, it starts with a private
                  conversation in Hatton Garden.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href={ROUTES.bookAppointment} className={PILL_PRIMARY}>
                    Book a Private Consultation
                  </Link>
                  <Link href={ROUTES.bespoke} className={PILL_OUTLINE}>
                    Bespoke Jewellery
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <FAQ items={CLIENTS_FAQS} rounded />
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
