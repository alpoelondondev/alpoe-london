import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import BrandHero from "../../components/BrandHero";
import ScrollReveal from "../../components/ScrollReveal";
import FAQ from "../../components/FAQ";
import { pageMetadata, ldJsonGraph, faqLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

const PATH = ROUTES.guideProposeInLondon;

/**
 * Where to propose in London.
 *
 * The one piece of content on the queue that exists to earn links rather than
 * to convert. The site's real weakness is not on-page — it is that "Alpoe" has
 * almost no third-party mentions, and branded mentions correlate more strongly
 * with being cited by an assistant than backlinks do. A genuinely good London
 * listicle is the cheapest thing a jeweller can publish that other people
 * actually link to, and proposal season runs from about November to February,
 * so it wants to be indexed well before then.
 *
 * Written to be useful rather than to rank on volume. Every entry says what
 * the place is actually like to propose in — how private it is, what time of
 * day works, and what goes wrong there — because the generic version of this
 * article ("Primrose Hill has lovely views!") is already written a hundred
 * times and links to none of them.
 *
 * Deliberately absent: opening hours, ticket prices, booking rules and
 * anything else operational. Those change, this page will not be revised every
 * season, and a guide that sends somebody to a closed gate has done real
 * damage on the one day it mattered. Where booking matters the page says to
 * check rather than stating a policy.
 */

export const metadata: Metadata = pageMetadata({
  title: "Where to Propose in London",
  description:
    "Twelve places to propose in London, what each is actually like on the day, and the practical things that go wrong — timing, crowds, weather and keeping the ring safe.",
  path: PATH,
  image: "/og/engagement-rings.jpg",
});

type Spot = {
  name: string;
  area: string;
  verdict: string;
  copy: string;
};

const SPOTS: Spot[] = [
  {
    name: "Primrose Hill",
    area: "NW1",
    verdict: "The classic, and busier than you think",
    copy:
      "The skyline view everybody pictures, free, open at all hours, and a short walk up from Regent's Park. The catch is that the summit is a destination rather than a secret — on a clear evening it is full of people doing exactly what you are doing. Go at sunrise if you want it to yourself, or take the eastern slope a little below the top, where the view is nearly identical and the crowd is not.",
  },
  {
    name: "Kyoto Garden, Holland Park",
    area: "W8",
    verdict: "Best small garden in London",
    copy:
      "A Japanese garden with a tiered waterfall, koi, and peacocks that will absolutely photobomb you. It is small, which is the appeal and the problem: there is one obvious spot by the falls and you may have to wait for it. Weekday mornings are quiet. Autumn is when the maples make it worth the trip over anything else on this list.",
  },
  {
    name: "St Dunstan in the East",
    area: "EC3",
    verdict: "Atmospheric, tiny, photographed to death",
    copy:
      "A bombed-out church left as a ruin and planted through — ivy up the walls, a tower still standing, and light that does remarkable things in the late afternoon. It is genuinely beautiful and it is also very small and very well known to photographers, so expect company unless you go early. Ten minutes from the Tower and a good pairing with a river walk afterwards.",
  },
  {
    name: "Hampstead Heath, Parliament Hill",
    area: "NW5",
    verdict: "The other skyline, with more room to hide",
    copy:
      "The view south from Parliament Hill is the equal of Primrose Hill and the Heath is enormous, so you can find privacy a few minutes' walk in any direction. That size is the argument for it: if the spot you wanted is occupied, there are twenty more. Wear proper shoes — it is a hill, it is often mud, and the walk up is longer than it looks.",
  },
  {
    name: "Richmond Park",
    area: "TW10",
    verdict: "Big skies, deer, genuine solitude",
    copy:
      "The largest of the royal parks and the only place on this list where you can be properly alone outdoors. Pembroke Lodge gardens and King Henry's Mound are the obvious spots; the ponds and the plantations are better if you want nobody at all. Keep a respectful distance from the deer, particularly in autumn rut and in spring — they are wild animals and people forget it.",
  },
  {
    name: "Greenwich Park and the Observatory",
    area: "SE10",
    verdict: "The best view of the city, and a boat home",
    copy:
      "The climb up to the Observatory gives you the Old Royal Naval College in the foreground and Canary Wharf behind it, which is the most cinematic composition in London. The hill is free and open even when the Observatory itself is not. The riverboat back into town afterwards turns an afternoon into a day, and the walk through the market on the way is no hardship.",
  },
  {
    name: "Little Venice and the Regent's Canal",
    area: "W9",
    verdict: "Quiet, level, and almost nobody does it",
    copy:
      "The towpath from Little Venice through to Camden is calm, flat and surprisingly empty on a weekday, with the Regent's Park stretch the prettiest part of it. It suits a proposal that is a walk rather than a destination — no summit to reach, no view to wait for, just a moment you choose. The waterbus does the same route if walking is not the plan.",
  },
  {
    name: "Postman's Park",
    area: "EC1",
    verdict: "Small, moving, and a five-minute walk from Hatton Garden",
    copy:
      "A pocket park behind St Botolph's holding the Watts Memorial to Heroic Self-Sacrifice — a wall of ceramic tablets recording ordinary people who died saving others. It is quiet, it is genuinely affecting, and it is unlike anywhere else on this list. Worth knowing that it is a working lunch spot for the offices around it, so before noon or after six is better.",
  },
  {
    name: "The Sky Garden",
    area: "EC3",
    verdict: "Indoors, high up, and needs planning",
    copy:
      "The top of 20 Fenchurch Street, with a planted terrace and the whole city underneath you. Entry is free but it works on advance booking and slots go quickly, so check well ahead rather than turning up — and check again nearer the time, because private events close it. The best answer to a February proposal where every outdoor option is dark and wet by five.",
  },
  {
    name: "Battersea Park",
    area: "SW11",
    verdict: "The riverside one, with a pagoda",
    copy:
      "The Peace Pagoda on the river walk is the obvious spot and deserves to be, particularly at dusk with the water in front of it. The park is large enough to be quiet away from the main paths, and the walk east toward Chelsea Bridge is a good approach that does not telegraph anything. Easy to reach and much less obvious than Primrose Hill.",
  },
  {
    name: "Kew Gardens",
    area: "TW9",
    verdict: "Worth the ticket, needs a whole day",
    copy:
      "Three hundred acres, a treetop walkway, the Palm House, and more places to be alone than you will get through in a day. It is ticketed and it closes in the afternoon in winter, so check before building a plan around it. The Temperate House and the Japanese Gateway are the two spots people come back for.",
  },
  {
    name: "Hatton Garden itself",
    area: "EC1N",
    verdict: "Unromantic, and more common than you would guess",
    copy:
      "Not a suggestion so much as an observation: a fair number of proposals happen the same afternoon the ring is collected, on a bench in one of the squares off the Garden, because the person could not wait. There is nothing wrong with that. If the plan is a grand one, though, do not collect the ring and then carry it around all day — that is how rings get left in restaurant coats.",
  },
];

const PRACTICAL = [
  {
    heading: "Golden hour, not sunset",
    copy:
      "The light worth having is the hour before sunset, not the moment of it — by actual sunset the colour goes fast and the temperature with it. Look up the time for the date rather than guessing, because in London it swings from about four in the afternoon in December to after nine in June, and a plan built on the wrong one falls apart.",
  },
  {
    heading: "Have a wet plan",
    copy:
      "It is London. Every outdoor entry on this list has a bad day, and the proposals that go wrong are the ones with no second option. Pick an indoor alternative in advance — a restaurant, the Sky Garden, a hotel bar you both like — and decide the night before rather than in the rain.",
  },
  {
    heading: "Where the ring actually goes",
    copy:
      "Not a coat pocket, and not a bag you might put down. A front trouser pocket or an inside jacket pocket you can feel, in the box or in something less bulky if the box gives it away. If a friend is carrying it, agree the handover in advance. Rings are lost on proposal day more often than anyone admits.",
  },
  {
    heading: "If you want photographs, arrange them",
    copy:
      "A hired photographer standing at a distance with a long lens is unobtrusive and gets the moment properly; a friend hiding behind a tree with a phone gets a blurred back of a head. Give whoever it is the exact spot and the exact time, and a signal. Several London photographers do only this and know these locations well.",
  },
  {
    heading: "Get the size right beforehand",
    copy:
      "A ring that will not go on is the one avoidable disappointment. Borrow a ring she already wears on the correct finger and have it measured, or ask somebody who would know. If you cannot find out without giving it away, have the ring made slightly large — it is easier to size down afterwards than to spend the moment forcing it.",
  },
  {
    heading: "Ask, if asking matters to them",
    copy:
      "Whether you speak to family first is a question about your two families rather than about etiquette, and the only wrong answer is guessing. For some people it matters a great deal; for others it would be strange. You already know which, and it is worth acting on.",
  },
];

const FAQS = [
  {
    question: "Where is the best place to propose in London?",
    answer:
      "It depends on how private you want it to be. For a view, Primrose Hill and Parliament Hill are the classics and both are busy — Greenwich Park gives you a better composition with fewer people. For seclusion, Richmond Park is the only place on this list where you can be genuinely alone outdoors. For a small, atmospheric spot, Kyoto Garden in Holland Park or St Dunstan in the East. For winter or bad weather, the Sky Garden, which is indoors and high up but needs booking well ahead.",
  },
  {
    question: "Do you need permission to propose in a London park?",
    answer:
      "Not to propose — the royal parks and the commons are public and nobody needs permission to ask a question in one. You may need permission for what goes with it: professional photography, anything set up on the ground, drones, and any kind of installation are generally restricted, and rules differ between the royal parks, the City gardens and borough parks. If your plan involves more than the two of you and a ring, check with the specific park before the day.",
  },
  {
    question: "When is the best time of year to propose in London?",
    answer:
      "Most proposals happen between November and February, which is why restaurants book up over Christmas and New Year. The weather is against you and the light goes early, so indoor options and golden-hour timing matter more. Late spring and early autumn are far easier outdoors — May and late September give you long light, dry ground and gardens at their best, with none of the December competition for tables.",
  },
  {
    question: "How far ahead should I order an engagement ring?",
    answer:
      "For a made-to-order ring, allow six to eight weeks from an approved design, and longer if it is a complex setting or an unusual stone. Hallmarking adds a few days after the ring is finished. If the date is fixed, say so at the first conversation rather than at the end — a deadline is usually workable when it is known early and rarely when it appears late. Finished rings that only need sizing are far quicker.",
  },
  {
    question: "What if I do not know her ring size?",
    answer:
      "Borrow a ring she already wears on the correct finger and bring it in to be measured — that is the accurate method. Failing that, ask someone who would know without asking her. If neither is possible, have the ring made slightly large: sizing down afterwards is straightforward on most settings, and a ring that will not pass the knuckle in the moment is the one thing you cannot recover from.",
  },
];

export default function WhereToProposePage() {
  const ld = ldJsonGraph([
    {
      "@type": "Article",
      "@id": siteUrl(PATH) + "#article",
      headline: "Where to Propose in London",
      description:
        "Twelve places to propose in London, what each is really like on the day, and the practical things that go wrong.",
      about: [
        { "@type": "Thing", name: "Proposals" },
        { "@type": "Thing", name: "London" },
        { "@type": "Thing", name: "Engagement rings" },
      ],
      author: { "@id": siteUrl("/") + "#organization" },
      publisher: { "@id": siteUrl("/") + "#organization" },
      inLanguage: "en-GB",
      isPartOf: { "@id": siteUrl("/") + "#website" },
      mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(PATH) },
      url: siteUrl(PATH),
    },
    faqLd(FAQS),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Guide"
          title="Where to Propose in London"
          copy="Twelve places worth it, what each is actually like on the day, and the practical things that go wrong. From a workshop that makes the rings."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Guides", href: ROUTES.guides },
              { name: "Where to propose in London", href: PATH, current: true },
            ]}
          />
        </section>

        <ScrollReveal>
          <section className="px-[52px] pb-14 max-md:px-6">
            <p className="max-w-[64ch] text-[19px] leading-relaxed font-light text-blush">
              The best place to propose in London is wherever means something to
              the two of you. Everything below is for when that is not obvious,
              or when it is and you want to know what the spot is really like
              before you build a day around it.
            </p>
            <p className="mt-5 max-w-[68ch] t-copy">
              We have written what each place is actually like rather than what
              it looks like in a photograph &mdash; how busy, what time works,
              and what goes wrong there. The practical section underneath is the
              part people come back and tell us they wish they had read: light,
              weather, where to keep the ring, and getting the size right before
              the day rather than during it.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">Twelve places</h2>
            <dl className="mt-8 divide-y divide-fg/[0.08] border-t border-fg/[0.08]">
              {SPOTS.map((s) => (
                <div key={s.name} className="py-6">
                  <dt className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="font-serif text-[19px] leading-tight text-blush">
                      {s.name}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-accent">
                      {s.area} · {s.verdict}
                    </span>
                  </dt>
                  <dd className="mt-2 max-w-[68ch] t-copy">{s.copy}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 max-w-[68ch] text-[13px] text-fg/55">
              Opening times, ticketing and booking rules change and are
              deliberately not listed here &mdash; check the venue before you
              build a plan around it.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-fg/10 bg-panel-soft px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">The practical part</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-9 max-md:grid-cols-1">
              {PRACTICAL.map((p) => (
                <div key={p.heading} className="border-t border-accent/40 pt-4">
                  <h3 className="font-serif text-[19px] leading-tight text-blush">
                    {p.heading}
                  </h3>
                  <p className="mt-3 t-copy">{p.copy}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <FAQ items={FAQS} />

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">Before the day</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              The ring is the one part of this that cannot be arranged the week
              before. Made-to-order takes six to eight weeks plus hallmarking,
              and the size is the thing most worth getting right in advance.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              <li>
                <Link
                  href={ROUTES.engagementAndWeddingRings}
                  className="t-copy underline underline-offset-4 hover:text-accent"
                >
                  Engagement rings made to order in Hatton Garden
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.ringBuilder}
                  className="t-copy underline underline-offset-4 hover:text-accent"
                >
                  Design the ring yourself in the ring builder
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.ringSizeGuide}
                  className="t-copy underline underline-offset-4 hover:text-accent"
                >
                  Ring size guide &mdash; including how to find a size in secret
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.readyToShipRings}
                  className="t-copy underline underline-offset-4 hover:text-accent"
                >
                  Ready-to-ship rings, if the date is close
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.guideLabGrownDiamonds}
                  className="t-copy underline underline-offset-4 hover:text-accent"
                >
                  Laboratory-grown vs natural diamonds
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
