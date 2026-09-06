import type { WatchBrandSlug } from "../types";

/**
 * Editorial content for /watches/[brand].
 *
 * Those eight pages were a hero, a one-sentence heritage line and a product
 * grid. Nothing else — no prose, no model explanation, no FAQ block and
 * therefore no FAQPage schema anywhere on the watch side of the site. Search
 * Console shows exactly what that earns: /watches/hublot has 50 impressions at
 * an average position of 59.4, /watches/omega 14 at 59.36, /watches itself 29
 * at 62.14. Real demand arriving at pages with nothing on them to rank.
 *
 * Four brands, not eight. Hublot, Omega, Rolex and Audemars Piguet are the
 * ones with impressions against them in the data; the other four would be four
 * more pages written from a template with the noun swapped, which is a doorway
 * set and reads as duplicate to a crawler. The same reasoning as
 * lib/sell/brands.ts, and the same conclusion. A brand earns a guide when the
 * search data says somebody is looking for it, and the type below makes the
 * content optional so the section simply does not render for the rest.
 *
 * What is deliberately absent: prices, and reference numbers the desk has not
 * confirmed. Both go stale, and a wrong reference on a dealer's page costs
 * more credibility than a missing one. What is here instead is the mechanism —
 * how the model families differ, what separates a good example from a poor one
 * of the same reference, and what to check before buying. That is stable, it
 * is checkable, and it is what somebody at this stage is trying to find out.
 */

export type BrandGuide = {
  /** Answer-first opening. What this brand is, in one paragraph. */
  intro: string;
  /** The model families, and what genuinely separates them. */
  lines: { name: string; copy: string }[];
  /** What to check on a pre-owned example. Brand-specific, not generic. */
  checks: { heading: string; copy: string }[];
  faqs: { question: string; answer: string }[];
};

export const BRAND_GUIDES: Partial<Record<WatchBrandSlug, BrandGuide>> = {
  hublot: {
    intro:
      "Hublot is the youngest house on this page and the most divisive, which is most of why it is interesting to buy pre-owned. The original 1980 watch put a gold case on a rubber strap — unheard of then, ordinary now — and the modern brand built on that idea under the name Art of Fusion: unusual materials, combined loudly. What that means for a buyer is that the material matters as much as the model. Two Big Bangs of the same size and complication can be entirely different watches and entirely different prices because one is titanium and the other is King Gold.",
    lines: [
      {
        name: "Big Bang",
        copy: "The volume model and the one most people mean by Hublot. Launched in 2005 and made in almost every combination since — 38mm through 45mm, time-and-date or chronograph, and a materials list that runs from stainless steel and titanium through ceramic, carbon and King Gold. The Unico versions carry Hublot's own in-house chronograph movement with the column wheel visible through the dial side, and they are a different proposition to the earlier examples built on outsourced bases.",
      },
      {
        name: "Classic Fusion",
        copy: "The quiet one, and the closest thing the current range has to the original 1980 watch. Slimmer, flatter, no exposed screws crowding the bezel, and it wears under a cuff in a way a Big Bang does not. If somebody likes the idea of Hublot but not the wrist presence, this is almost always the answer — and it is usually the better value on the pre-owned market, because the demand runs the other way.",
      },
      {
        name: "Spirit of Big Bang",
        copy: "The tonneau — a barrel-shaped case rather than a round one, which changes how it sits on the wrist far more than the spec sheet suggests. A narrower audience than the round Big Bang, so examples sit longer and are priced accordingly. Worth trying on rather than judging from photographs; the case shape is the whole point of it.",
      },
      {
        name: "MP and the material pieces",
        copy: "Low-volume, high-concept: sapphire cases, Magic Gold, one-off collaborations. These are valued piece by piece rather than by reference, and the market for them is thin in both directions — hard to buy well, and slower to sell. Bought and sourced on request rather than held as stock.",
      },
    ],
    checks: [
      {
        heading: "The strap, and what a new one costs",
        copy: "Rubber perishes. It hardens, it cracks at the lugs where it flexes, and a strap that looks tired on a photograph is tired. Factor a replacement into the price, because Hublot straps are not cheap and the correct one for a given case is not interchangeable across the range. Newer models use a one-click release that makes changing them trivial; older ones need the screws out.",
      },
      {
        heading: "Ceramic chips, it does not scratch",
        copy: "A ceramic bezel will outlast a steel one for scratches and then chip outright if it meets a door frame. Look at the bezel edge under a light rather than straight on. A chip is not repairable — the part is replaced — so it is a real number rather than a cosmetic note.",
      },
      {
        heading: "Which movement is inside it",
        copy: "Hublot uses both its own Unico calibres and outsourced bases depending on the model and the year. That affects servicing, parts availability and value, and it is not something you can tell from the case. Confirm the calibre rather than assuming it from the model name.",
      },
      {
        heading: "Buy on the honest number, not the list price",
        copy: "Hublot depreciates harder from retail than Rolex, Patek or AP do. Said plainly because it cuts both ways: it is the reason a pre-owned Hublot is often extremely good value, and the reason it should not be bought as an investment. Buy one because you want to wear it.",
      },
    ],
    faqs: [
      {
        question: "Where can I buy a pre-owned Hublot in London?",
        answer:
          "We hold Hublot at our Hatton Garden showroom and source specific references to order. Big Bang and Classic Fusion are the two families we are asked for most. Everything is authenticated in-house before it is offered, and you are welcome to see a piece on the wrist before deciding — a Big Bang in particular wears very differently from how it photographs.",
      },
      {
        question: "Is a Hublot a good investment?",
        answer:
          "No, and we would rather say so. Hublot loses more of its retail price than Rolex, Patek Philippe or Audemars Piguet, and only a handful of limited pieces have appreciated. The flip side is that a pre-owned Hublot is one of the best value propositions in Swiss watchmaking — you are buying an in-house chronograph and genuinely unusual materials for a fraction of what the first owner paid.",
      },
      {
        question: "What is the difference between a Big Bang and a Classic Fusion?",
        answer:
          "Size and attitude. The Big Bang is thick, sporty and covered in exposed screws, and it is the model that made the brand. The Classic Fusion is slimmer, flatter and much closer to the original 1980 Hublot, and it fits under a shirt cuff. Same house, two quite different watches — try both before deciding, because most people have a clear preference once they have.",
      },
      {
        question: "What is King Gold?",
        answer:
          "Hublot's own red gold alloy. It uses platinum in the mix rather than the usual proportions of copper and silver, which holds the colour and stops it fading toward yellow as ordinary rose gold can over time. It is a genuine 18ct gold and hallmarked as such — the difference is in the alloy, not the purity.",
      },
    ],
  },

  omega: {
    intro:
      "Omega is the value argument in Swiss watchmaking, and the Speedmaster is the reason most people arrive at it. It is the watch NASA qualified for spaceflight in 1965 after testing it to destruction alongside its competitors, and the only one worn on the surface of the Moon. It is also, unusually for a watch with that history, still made and still affordable. What matters when buying one is the detail: two Speedmasters that look identical across a counter can differ by a crystal, a calibre and a great deal of money.",
    lines: [
      {
        name: "Speedmaster Moonwatch",
        copy: "The hand-wound chronograph, and the one with the history. The single most important thing to establish is the calibre: the long-running 1861 was replaced in 2021 by the 3861, which brought the co-axial escapement, a full METAS Master Chronometer certification and a subtly revised case and dial. Both are excellent and they are different watches to a buyer. The second thing is the crystal — Hesalite, the acrylic NASA specified, or sapphire. Hesalite is the historically correct one and scratches easily but polishes out with a fingertip; sapphire looks sharper and costs more.",
      },
      {
        name: "Seamaster",
        copy: "Four separate markets under one name. The Diver 300M is the modern everyday dive watch and the one with the Bond association; the Planet Ocean is larger, deeper-rated and more serious; the Aqua Terra is the dress-leaning one with the vertically ribbed dial; and the vintage Seamaster 300 is a collector's watch priced on dial originality. Decide which of the four you are actually shopping for before comparing prices, because they overlap on the search results page and nowhere else.",
      },
      {
        name: "Constellation and De Ville",
        copy: "The dress side. The modern Constellation with its griffe claws at three and nine is a distinctive, well-made and consistently undervalued watch; the vintage pie-pan Constellation is a different and more careful purchase, priced almost entirely on whether the dial is original. De Ville covers the rest of the dress range, often in gold, where the metal sets a floor and the calibre sets everything above it.",
      },
    ],
    checks: [
      {
        heading: "Establish the calibre before the price",
        copy: "On a Speedmaster this is the whole conversation. A 1861 and a 3861 sit in a similar case with a similar dial and are valued differently, and the caseback and the paperwork are where you confirm it rather than the seller's description. If a listing does not state the calibre, that is the first question.",
      },
      {
        heading: "Hesalite or sapphire, and which you actually want",
        copy: "The Hesalite version is the one flight-qualified by NASA and has a solid caseback with the seahorse. The sapphire version has a display back showing the movement. Neither is better; they are different watches with different prices, and buying the one you did not mean to is a common and avoidable mistake.",
      },
      {
        heading: "Redials, on anything vintage",
        copy: "A refinished dial can be very hard to spot and takes a serious bite out of the value of a vintage Omega. Look at the printing under magnification — sharp, slightly raised text on an original, softer and flatter on a reprint — and at whether the lume plots match the hands in tone. On anything pre-1980 this is worth having checked by somebody who does it often.",
      },
      {
        heading: "The Reduced is not a Moonwatch",
        copy: "The Speedmaster Reduced is smaller, automatic and built on a different movement. It is a perfectly good watch and it is not the Moonwatch, and the two are confused often enough that it is worth checking the case size and the winding before agreeing a price.",
      },
    ],
    faqs: [
      {
        question: "Where can I buy an Omega Speedmaster in London?",
        answer:
          "We hold Speedmaster references at our Hatton Garden showroom and source specific ones to order. Tell us whether you want the Hesalite or the sapphire crystal and whether you are after the 1861 or the current 3861 calibre, and we will tell you what is available and what it should cost. Every piece is authenticated in-house before it is offered.",
      },
      {
        question: "What is the difference between the Speedmaster 1861 and 3861?",
        answer:
          "The 3861 replaced the 1861 in 2021. It uses Omega's co-axial escapement, carries full METAS Master Chronometer certification for accuracy and magnetic resistance, and came with a lightly revised case and a stepped dial. The 1861 is the movement that ran for decades and is simpler to service. Both are hand-wound, both are excellent, and they are priced differently — so the calibre is the first thing to establish on any Speedmaster.",
      },
      {
        question: "Should I buy a Speedmaster with Hesalite or sapphire?",
        answer:
          "Hesalite is the acrylic crystal NASA specified, it comes with a solid caseback, and it is the historically correct choice. It scratches easily, but light scratches polish out by hand in a minute. Sapphire is far harder to scratch, comes with a display caseback showing the movement, and costs more. Most people who care about the Apollo history choose Hesalite; most people who want to see the movement choose sapphire.",
      },
      {
        question: "Is an Omega better value than a Rolex?",
        answer:
          "On the pre-owned market, generally yes, if value means watchmaking per pound. Omega's co-axial movements and METAS certification are genuinely excellent and the watches cost meaningfully less than the Rolex equivalents. Rolex holds its price better and is easier to sell quickly. Which matters more depends on whether you are buying a watch to wear or an asset to move on.",
      },
    ],
  },

  rolex: {
    intro:
      "Rolex is the most liquid watch on earth, which changes how you should shop for one. There is always a buyer and always a seller, so you are never forced into a particular example — but the market prices these watches down to the individual variant, and the gap between a good buy and a poor one on the same model can be substantial. The single most useful habit is to stop thinking in models and start thinking in references.",
    lines: [
      {
        name: "The professional models",
        copy: "Submariner, GMT-Master II, Daytona, Explorer, Sea-Dweller and Yacht-Master. Steel sports references are where the demand is concentrated, which means waiting lists at authorised dealers and pre-owned prices that have at times run above retail. Within a family, small differences carry large prices — bezel colour on a GMT is most of the number, and the ceramic-era pieces trade apart from the aluminium ones.",
      },
      {
        name: "Datejust and Oyster Perpetual",
        copy: "The widest variety Rolex makes, and therefore the widest spread. Case size, bezel (fluted or smooth), bracelet (Jubilee or Oyster) and dial each move the price, and the same nominal model can differ by a multiple across those choices. The 2020 lacquer-dial Oyster Perpetuals trade quite separately from the classic dials — colour matters more than size on those.",
      },
      {
        name: "Day-Date",
        copy: "Precious metal only, so the metal itself sets a floor under the value. Above that floor it is the dial, the bracelet and whether the case has been refinished. An unpolished example with sharp lugs is worth a great deal more than a heavily polished one of the same reference, and it is the easiest thing to check and the easiest to overlook.",
      },
    ],
    checks: [
      {
        heading: "Find the reference before anything else",
        copy: "Engraved between the lugs at twelve o'clock, underneath the bracelet. Every meaningful conversation about price starts there. A quote given against a model name is a guess and will be revised when the watch is in front of somebody.",
      },
      {
        heading: "Look at the lugs from the side",
        copy: "Polishing removes metal. A case that has been through it more than once has rounded lugs and soft bevels, and once you have seen a sharp example next to a soft one you cannot unsee it. It is the clearest single indicator of how a watch has been treated, and it is visible in seconds.",
      },
      {
        heading: "Card, or no card",
        copy: "A full set commands a premium, and how much depends on the reference. On a recent steel sports model it is significant; on an older piece that is straightforward to authenticate it matters less than people assume. A service history from Rolex can be worth as much as the original card on a watch that has been maintained elsewhere.",
      },
      {
        heading: "Bracelet stretch",
        copy: "Hold the watch horizontally by one end of the bracelet and look at the gaps between links. Wear here is normal on an older piece and is not a fault, but a stretched bracelet is a real cost to put right and is a fair thing to price in.",
      },
    ],
    faqs: [
      {
        question: "Where can I buy a Rolex in London without a waiting list?",
        answer:
          "Pre-owned and unworn Rolex is available immediately from dealers rather than through an authorised dealer's allocation list. We hold references at our Hatton Garden showroom and source specific ones to order, authenticated in-house. If you want a particular reference, dial and bracelet combination, tell us and we will find it rather than sell you the nearest thing in the case.",
      },
      {
        question: "Why does the reference number matter so much on a Rolex?",
        answer:
          "Because it, not the model name, is what the market prices. A Submariner is not a price — the different references are separate markets, and within them the dial and bezel variant moves the number again. The reference is engraved between the lugs at twelve o'clock, under the bracelet. Anyone quoting you a figure without it is estimating.",
      },
      {
        question: "Does a Rolex need the box and papers?",
        answer:
          "No, and plenty of excellent watches are sold without them. A full set is worth a premium and how large depends on the reference — larger on a current steel sports model, smaller on something older that is easy to authenticate on its own merits. A watch with no papers from a dealer who authenticates in-house is a perfectly sound purchase.",
      },
    ],
  },

  "audemars-piguet": {
    intro:
      "Audemars Piguet is effectively one watch and a supporting cast, and that is not a criticism — the Royal Oak is among the most consequential designs in the history of the industry. Gérald Genta drew it in 1972 as a steel sports watch priced like a gold dress watch, which was close to commercial heresy at the time and is now the template half the industry follows. Buying one well means understanding that the case finishing and the dial are the value, and both are things you assess in person rather than from a listing photograph.",
    lines: [
      {
        name: "Royal Oak",
        copy: "The octagonal bezel with eight hexagonal screws, the integrated bracelet, and the tapisserie dial. Size is the first decision and it matters more here than on most watches: the thin 39mm 'Jumbo' lineage descends directly from the 1972 original and trades quite separately from the 41mm date models and the 37mm and 34mm. Dial colour is the second, and on a Royal Oak it is a large part of the price rather than a preference — the blue dial is the signature and the most asked-for, grey and the smoked 'Bleu Nuit, Nuage 50' variants trade at their own levels, and white, black and green each have their own following. Name the colour as well as the reference when you enquire; on this watch the two together are the price.",
      },
      {
        name: "Royal Oak Offshore",
        copy: "The larger, louder interpretation, launched in 1993 to considerable objection from people who liked the original. Valued on size, dial and strap, and complete sets with the spare strap and the tool measurably outperform incomplete ones. A different audience from the Royal Oak proper, and worth trying on — the Offshore wears substantially bigger than its case measurement suggests.",
      },
      {
        name: "Code 11.59",
        copy: "The round-cased collection, and a younger and more variable market than either Royal Oak line. Some references have found their audience and some have not, so these are priced on the individual piece rather than by family. Genuinely interesting watchmaking, and one of the few places in this price bracket where you can still buy against the trend rather than with it.",
      },
    ],
    checks: [
      {
        heading: "The finishing is the product — look at it",
        copy: "A Royal Oak case is a sequence of alternating brushed surfaces and mirror-polished bevels, and the crispness of the line between them is where the money went. On a heavily polished example those lines soften and the case loses the quality it was bought for. Tilt it under a light rather than looking straight down at it.",
      },
      {
        heading: "The tapisserie dial, under magnification",
        copy: "The waffle pattern is cut, not stamped on, and it should be sharp and even across the whole dial with no smudging around the applied markers. It is also the part most likely to show marks from a careless movement service, so look at the area around the hands.",
      },
      {
        heading: "Bracelet stretch and the clasp",
        copy: "An integrated bracelet is not easily replaced and cannot be swapped for a strap, so its condition is a bigger part of the value here than on a watch with lugs. Check for stretch link by link and open and close the clasp a few times — it should snap rather than sag.",
      },
      {
        heading: "The complete set, on an Offshore especially",
        copy: "Box, papers, spare strap and the strap-changing tool. On the Offshore the spare strap is a genuine value item rather than a nice-to-have, and its absence is a fair thing to negotiate on.",
      },
    ],
    faqs: [
      {
        question: "Where can I buy an Audemars Piguet Royal Oak in London?",
        answer:
          "We hold Royal Oak and Royal Oak Offshore references at our Hatton Garden showroom and source specific ones to order, authenticated in-house. Royal Oaks are difficult to obtain at retail, so the pre-owned market is where most buyers find one. Tell us the case size and dial colour you want rather than just the model — on this watch, those two choices are most of the price.",
      },
      {
        question: "What is the difference between the 39mm and 41mm Royal Oak?",
        answer:
          "The 39mm is the thin, time-only 'Jumbo' lineage that descends directly from Gérald Genta's 1972 original, and it is the reference collectors treat as the pure form of the watch. The 41mm adds a date and more case depth and is the more common everyday choice. They trade as separate markets rather than as two sizes of one watch, and the 39mm carries a considerable premium.",
      },
      {
        question: "What is a tapisserie dial?",
        answer:
          "The small squared waffle pattern on a Royal Oak dial, machine-cut on a rose engine rather than stamped. It comes in three scales — Petite, Grande and Mega Tapisserie — and which one a reference uses is part of how it is identified and valued. It should look sharp and even under magnification, particularly around the applied hour markers.",
      },
    ],
  },
};

export function brandGuide(slug: string): BrandGuide | undefined {
  return BRAND_GUIDES[slug as WatchBrandSlug];
}
