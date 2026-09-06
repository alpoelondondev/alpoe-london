import { ROUTES, type Route } from "../routes";

/**
 * One guide per metal, for /rings/{metal}-engagement-rings.
 *
 * The gap this fills: the site had ten diamond-shape pages and nothing at all
 * on metal, while metal is the *other* axis every engagement ring buyer has to
 * decide on and the one they ask about first in the showroom. "Platinum or
 * white gold" is the single most common question at the counter and there was
 * no page on this site that answered it.
 *
 * Four pages rather than one comparison page, for the same reason the shape
 * guides are ten: `platinum engagement rings` and `rose gold engagement rings`
 * are separate searches with separate intent, and the slug is the cheapest
 * place to match the phrase. They are not a doorway set — the four metals
 * behave genuinely differently in ways that change what you should buy, and
 * each page leads on the fact that is specific to it.
 *
 * ── The sourcing rule, same as lib/rings/shapeGuides.ts ──
 *
 * Everything here is either a standards fact (hallmarking fineness, carat
 * percentages), a material property that is not in dispute (platinum's
 * density, why white gold is plated, what copper does to rose gold), or a
 * statement about what this workshop does. No market-share percentages, no
 * price comparisons and no "most popular" claims: those move, they vary by
 * source, and none of them is checkable a year from now. The keyword research
 * carried figures for metal popularity — they are deliberately not published
 * here, because a statistic in body copy is a claim, and an unsourced one is
 * a liability.
 *
 * The single most useful fact on any of these pages is that white gold is
 * rhodium-plated and the plating wears off. Most people buying it do not know
 * that, and finding out two years later feels like being sold something.
 * Saying it plainly costs a little and is why the page deserves to rank.
 */

export type MetalGuide = {
  slug: string;
  /** The registry path, so nothing rebuilds "/rings/…" by hand. */
  path: Route;
  /** The metal as a person says it: "platinum", "18ct yellow gold". */
  name: string;
  /** The <h1>, which is the search phrase near enough verbatim. */
  h1: string;
  title: string;
  description: string;
  /** Answer-first opening — the thing that decides it, in one paragraph. */
  intro: string;
  /** The single fact that most changes a buying decision on this metal. */
  headline: { label: string; copy: string };
  facts: { heading: string; copy: string }[];
  faqs: { question: string; answer: string }[];
};

export const METAL_GUIDES: MetalGuide[] = [
  {
    slug: "platinum-engagement-rings",
    path: ROUTES.platinumEngagementRings,
    name: "platinum",
    h1: "Platinum Engagement Rings",
    title: "Platinum Engagement Rings, Made in Hatton Garden",
    description:
      "Why platinum never needs replating, what its density means for weight and cost, how the patina forms, and when white gold is the better choice. Made to order in Hatton Garden.",
    intro:
      "Platinum is the metal to choose when you do not want to think about the ring again. It is naturally white, so it never needs plating and never changes colour; it is hypoallergenic, so it suits skin that reacts to alloys; and it does not lose metal when it is scratched. That last property is the one worth understanding, because it is the real difference between platinum and every gold on this page.",
    headline: {
      label: "It displaces rather than wears away",
      copy:
        "When gold is scratched, a tiny amount of metal is removed and gone. When platinum is scratched, the metal is pushed aside rather than lost — the surface dulls into a soft satin finish that jewellers call a patina, but the ring still weighs what it did. Over decades a platinum shank keeps its metal where a gold one slowly thins. If you like the original mirror finish, it polishes back in minutes; plenty of people prefer the patina and leave it.",
    },
    facts: [
      {
        heading: "950 platinum, and what the hallmark says",
        copy:
          "UK platinum jewellery is almost always 950 — 95% pure platinum, against 75% metal content in 18ct gold. The London Assay Office marks it with the fineness number 950 and the platinum orb symbol. Anything sold as platinum over half a gram must carry that mark, which is the independent test rather than the seller's description.",
      },
      {
        heading: "Why it costs more than the gram price suggests",
        copy:
          "Two things stack. Platinum is denser than gold — noticeably so — which means the same ring takes more metal by weight than it would in 18ct. And it melts far hotter and works harder at the bench, so the labour is greater. That is why a platinum ring is not simply the gold price plus a percentage, and why the difference is largest on a heavy or intricate setting.",
      },
      {
        heading: "It holds a stone more securely",
        copy:
          "Platinum claws bend rather than snap and hold their shape under knocks, which is why a great many jewellers set important stones in platinum claws even on a gold band. If the centre stone is the point of the ring, this is a real argument and not a sales one.",
      },
      {
        heading: "The weight is a preference, not a virtue",
        copy:
          "A platinum ring feels substantial, and some people love that and some find it heavy on the hand all day. It is worth trying both metals at the same width before deciding, because it is the one difference you cannot judge from a photograph or a specification.",
      },
    ],
    faqs: [
      {
        question: "Is platinum better than white gold for an engagement ring?",
        answer:
          "For most people, yes — but not for everyone. Platinum is naturally white so it never needs replating, it is hypoallergenic, and it does not lose metal when scratched. White gold costs less and is lighter on the hand, which some people prefer. The honest test is whether you want to revisit the ring every year or two: white gold needs rhodium replating to stay bright, and platinum needs nothing at all.",
      },
      {
        question: "Does platinum scratch?",
        answer:
          "Yes, and it shows scratches sooner than gold does. The difference is what happens to the metal: a scratch in platinum displaces metal to the side rather than removing it, so the ring dulls to a satin patina without getting thinner. Many owners come to prefer that finish. If you want the original polish back it takes a jeweller a few minutes, and no metal is lost doing it.",
      },
      {
        question: "Why is platinum more expensive than gold?",
        answer:
          "Partly the metal price, but mostly two other things. Platinum is denser, so the same ring needs more of it by weight than 18ct gold would. And it has a much higher melting point and is harder to work, so it takes more time at the bench. The gap is widest on heavy or intricate settings and narrowest on a fine plain band.",
      },
      {
        question: "Does platinum turn your finger green?",
        answer:
          "No. That reaction comes from copper in an alloy, and 950 platinum is 95% pure with no copper in it. It is also the reason platinum is the usual recommendation for anyone whose skin reacts to jewellery — there is very little in it to react to.",
      },
    ],
  },

  {
    slug: "white-gold-engagement-rings",
    path: ROUTES.whiteGoldEngagementRings,
    name: "white gold",
    h1: "White Gold Engagement Rings",
    title: "White Gold Engagement Rings — And the Rhodium Question",
    description:
      "White gold is plated, and the plating wears off. What that means, how often it needs redoing, how it compares to platinum, and what 18ct and 9ct actually change. Made in Hatton Garden.",
    intro:
      "White gold is the most popular white metal for engagement rings and the one most often bought without the buyer being told how it works. Gold is yellow. There is no such thing as naturally white gold — it is yellow gold alloyed with white metals to lighten it, and then almost always plated with rhodium to make it properly white. The plating is what gives a new white gold ring its bright, slightly cool brilliance, and the plating is not permanent.",
    headline: {
      label: "The rhodium wears off, and that is normal",
      copy:
        "Rhodium is a hard, very white metal applied as an extremely thin layer over the finished ring. Worn daily it typically lasts somewhere between one and three years before the warmer tone of the gold beneath begins to show through, usually first on the underside of the shank where the ring rubs. This is not a fault and it is not a sign of a cheap ring — every white gold ring does it. Replating is a routine, inexpensive job that takes a jeweller very little time. But you should know it is coming before you buy, not two years afterwards.",
    },
    facts: [
      {
        heading: "What it is actually made of",
        copy:
          "18ct white gold is 75% gold with the remaining quarter made up of white metals — commonly palladium, silver and zinc. Palladium-heavy alloys are whiter and more expensive to start with and stay closer to white as the plating thins. It is worth asking which alloy a ring uses, because it changes how noticeable the regrowth is.",
      },
      {
        heading: "9ct or 18ct",
        copy:
          "Nine carat is 37.5% gold and 18ct is 75%. Nine carat is harder, more scratch-resistant and considerably cheaper; 18ct is the standard for fine jewellery, holds a better colour under the plating and is what most engagement rings are made in. Both are hallmarked at the assay office with their fineness — 375 and 750 respectively.",
      },
      {
        heading: "The nickel question",
        copy:
          "Some white gold alloys historically used nickel to whiten the metal, and nickel is a common contact allergen. UK and EU rules restrict how much nickel a piece in prolonged skin contact may release, and the alloys we use are nickel-free. If you have reacted to jewellery before, say so — it is the deciding factor between white gold and platinum for a fair number of people.",
      },
      {
        heading: "Matching a wedding band later",
        copy:
          "Two white gold rings made at different times from different alloys can sit side by side and not quite match, and it is far more visible on a hand than on a bench. If a wedding band is likely, having both made from the same alloy — ideally at the same time — is the way to avoid it.",
      },
    ],
    faqs: [
      {
        question: "How often does a white gold ring need replating?",
        answer:
          "Typically every one to three years with daily wear, depending on the alloy, the finish and how hard a life the ring has. The first place it shows is usually the underside of the band. It is a quick and inexpensive job — the ring is cleaned, polished and re-plated with rhodium — and it comes back looking new.",
      },
      {
        question: "Why is my white gold ring turning yellow?",
        answer:
          "It is not turning yellow; the rhodium plating has worn through and you are seeing the colour of the gold alloy underneath. Every white gold ring does this eventually because gold is naturally yellow and white gold is an alloy plated to look white. Replating restores it. If you would rather never deal with it, platinum is naturally white and never needs plating.",
      },
      {
        question: "Is white gold or platinum better value?",
        answer:
          "White gold costs less up front, and platinum costs nothing to maintain. Over a long enough time the replating adds up, but not usually to the difference in purchase price — so white gold is genuinely the cheaper option, provided you are willing to have it replated. Choose platinum if you want to buy it once and forget about it, or if your skin reacts to alloys.",
      },
      {
        question: "Can white gold be left unplated?",
        answer:
          "Yes, and some people prefer it. Unplated white gold has a softer, slightly warm grey tone rather than a bright cool white — closer to how it looked before rhodium plating became standard. Say so at the point of ordering and we will finish it that way. Palladium-rich alloys look best unplated.",
      },
    ],
  },

  {
    slug: "yellow-gold-engagement-rings",
    path: ROUTES.yellowGoldEngagementRings,
    name: "yellow gold",
    h1: "Yellow Gold Engagement Rings",
    title: "Yellow Gold Engagement Rings, Made in Hatton Garden",
    description:
      "What 9ct, 14ct and 18ct actually change about colour and hardness, why yellow gold never needs plating, and how it flatters a warmer diamond. Made to order in Hatton Garden.",
    intro:
      "Yellow gold is the oldest choice and the least demanding one. It needs no plating, so it never changes colour and never needs a visit to keep it looking right; it is the easiest of the metals to work, so it is the simplest to resize, repair and remodel decades later; and its warmth does something for a stone that white metals do not. The only real decision is the carat.",
    headline: {
      label: "The carat sets both the colour and the hardness",
      copy:
        "Nine carat is 37.5% gold, 14ct is 58.5% and 18ct is 75%. More gold means a deeper, warmer yellow and a softer metal; less gold means a paler yellow and a harder, more scratch-resistant one. Eighteen carat is the usual choice for an engagement ring in the UK — rich enough to read as proper gold, durable enough to wear every day. Nine carat is a sensible choice for someone hard on their hands, and it is hallmarked 375 rather than 750.",
    },
    facts: [
      {
        heading: "It flatters a warmer stone",
        copy:
          "A diamond graded lower on the colour scale — into the I to K range — can look slightly warm against a white metal and entirely bright against yellow gold, because the setting and the stone agree rather than compete. That is a real budget lever: a warmer stone in yellow gold often looks better than a colder one and costs less. Worth seeing side by side before deciding.",
      },
      {
        heading: "Nothing to maintain",
        copy:
          "No plating means no replating. A yellow gold ring will pick up fine surface scratches over the years like any metal, and a polish brings it back, but its colour is its own rather than a coating. This is the practical argument for yellow gold and it is a strong one.",
      },
      {
        heading: "The easiest metal to live with long term",
        copy:
          "Yellow gold sizes, solders and reshapes more readily than platinum and more predictably than rose gold. If a ring is likely to be resized, added to, or remade for a later generation, it is the metal that makes all of that simplest and cheapest.",
      },
      {
        heading: "The hallmark",
        copy:
          "Any gold ring over one gram sold in the UK must be hallmarked. The fineness mark — 375, 585 or 750 — is the independent statement of how much gold is in it, tested by an assay office rather than asserted by the shop.",
      },
    ],
    faqs: [
      {
        question: "Is 9ct or 18ct gold better for an engagement ring?",
        answer:
          "Eighteen carat for colour, 9ct for hardness. 18ct is 75% gold with a rich warm yellow and is the standard for fine jewellery in the UK. 9ct is 37.5% gold, noticeably paler, considerably cheaper and more resistant to scratching and bending — a reasonable choice for someone who works with their hands. Both are hallmarked with their fineness, and both are real gold.",
      },
      {
        question: "Does yellow gold need replating?",
        answer:
          "No. Yellow gold's colour is the metal itself rather than a coating, so there is nothing to wear off and nothing to renew. That is its main practical advantage over white gold, which is rhodium-plated and needs redoing every year or few. A polish restores the shine when it dulls; the colour never changes.",
      },
      {
        question: "Does yellow gold make a diamond look yellow?",
        answer:
          "It can lend a very slight warmth to the stone, and on a lower colour grade that usually works in your favour rather than against it — the stone and setting agree instead of contrasting. If you are buying a high colour grade specifically for its icy whiteness, a white metal shows it off better. If you are buying yellow gold, you can generally drop a colour grade or two and spend the difference elsewhere.",
      },
      {
        question: "Can a yellow gold ring be resized?",
        answer:
          "Usually yes, and more easily than platinum or rose gold. Plain and partly set bands typically resize by one or two sizes in either direction. Full eternity rings cannot be resized in any metal, because the stones run the whole way round.",
      },
    ],
  },

  {
    slug: "rose-gold-engagement-rings",
    path: ROUTES.roseGoldEngagementRings,
    name: "rose gold",
    h1: "Rose Gold Engagement Rings",
    title: "Rose Gold Engagement Rings, Made in Hatton Garden",
    description:
      "Copper is what makes rose gold pink, and it also makes it harder than yellow gold. How the shade is controlled, why it never needs plating, and what it means for resizing later.",
    intro:
      "Rose gold is yellow gold with copper in the alloy, and the copper is the whole story. It sets the colour, it makes the metal harder than yellow gold of the same carat, and it is the reason the shade varies so much between jewellers — there is no single standard pink, so two rose gold rings from two workshops can be visibly different. Like yellow gold it is never plated, so the colour is permanent.",
    headline: {
      label: "The copper content sets the shade, and it is a choice",
      copy:
        "More copper gives a redder, more coppery tone; less gives a soft blush closer to champagne. An 18ct rose gold is 75% gold whatever the shade, with the remaining quarter mostly copper and a little silver — so the carat is fixed by law and the colour is set by how that quarter is balanced. It is worth seeing a sample of the actual alloy rather than choosing from a photograph, because screens render this metal particularly badly.",
    },
    facts: [
      {
        heading: "Harder than yellow gold at the same carat",
        copy:
          "Copper is a harder metal than the silver and zinc that lighten yellow gold, so an 18ct rose gold band resists scratching and bending better than an 18ct yellow one. It is a genuine practical advantage for a ring worn every day, and it is rarely mentioned.",
      },
      {
        heading: "Never plated, so never fades",
        copy:
          "Unlike white gold, the colour is the alloy and not a coating. A rose gold ring will not fade, wash out or need renewing, and it does not become more or less pink over time. What it does do is pick up the same fine surface scratches as any metal, and a polish restores it.",
      },
      {
        heading: "It suits warmer stones and vintage settings",
        copy:
          "Rose gold does for a slightly warm diamond what yellow gold does, and it sits particularly well with milgrain, engraving and other vintage detailing, where the softness of the colour suits the softness of the work. It is also the natural partner for morganite and champagne diamonds if the centre stone is not going to be white.",
      },
      {
        heading: "One thing to plan for",
        copy:
          "Copper-rich alloys are less forgiving to resize and re-solder than yellow gold, and some become brittle if worked repeatedly. It does not stop a ring being resized, but it is a reason to get the size right at the outset and to have any later work done by a bench that knows the alloy. There is also no platinum equivalent — rose is a gold colour only.",
      },
    ],
    faqs: [
      {
        question: "Does rose gold fade or lose its colour?",
        answer:
          "No. The pink comes from copper in the alloy itself rather than from a plating, so there is nothing to wear off. A rose gold ring will look the same in twenty years as it does now, aside from the fine surface scratches any metal picks up, which polish out. This is the main practical advantage it shares with yellow gold and does not share with white gold.",
      },
      {
        question: "Is rose gold real gold?",
        answer:
          "Yes. 18ct rose gold is 75% pure gold — exactly the same gold content as 18ct yellow or white gold — and it is hallmarked 750 at the assay office like any other. The difference is only in the remaining quarter of the alloy, which for rose gold is mostly copper.",
      },
      {
        question: "Why do rose gold rings vary so much in colour?",
        answer:
          "Because there is no standard for the shade. The carat is fixed — 18ct is 75% gold by law — but how the remaining quarter is split between copper and silver is up to the maker, and more copper means redder. That is why it is worth seeing the actual alloy in person rather than choosing from a screen, which renders this metal especially unreliably.",
      },
      {
        question: "Is rose gold harder-wearing than yellow gold?",
        answer:
          "At the same carat, yes, slightly. Copper is harder than the metals used to lighten yellow gold, so an 18ct rose gold band resists scratches and knocks a little better than an 18ct yellow one. The trade-off is that copper-rich alloys are less forgiving to resize and re-solder later, so it is worth getting the size right first time.",
      },
    ],
  },
];

export function metalGuideBySlug(slug: string): MetalGuide | undefined {
  return METAL_GUIDES.find((m) => m.slug === slug);
}
