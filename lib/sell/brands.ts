import type { WatchBrandSlug } from "../types";

/**
 * Per-brand copy for /sell/[brand].
 *
 * "Sell my rolex london", "where can i sell my patek philippe watch", "sell my
 * cartier watch london" and their model-level tails are the lowest-difficulty,
 * highest-intent cluster this business can reach: somebody typing them has the
 * watch in a drawer and wants a number today. Nobody in Hatton Garden holds
 * those queries with a dedicated page except the two dealers who built exactly
 * this spine.
 *
 * Five brands, not eleven. Eleven pages built from one template with the noun
 * swapped is a doorway set — it reads as thin to a person and as duplicate to
 * a crawler, and it would dilute the five that can actually rank. These five
 * carry real UK search demand and, more importantly, are five businesses I can
 * say genuinely different things about: what moves a Royal Oak's price is not
 * what moves a Speedmaster's, and the pages should show that.
 *
 * Nothing here quotes a price. Valuations move weekly and a figure written
 * into a page is wrong within a month — worse, it is a promise the desk then
 * has to break. What each page gives instead is the *mechanism*: which facts
 * about a watch move the number, which paperwork matters for that maker, and
 * which references are asked after. Those are stable, checkable and are what
 * the seller is actually trying to find out.
 */

export type SellBrand = {
  slug: WatchBrandSlug;
  name: string;
  /** Used in prose: "sell your Rolex" vs "sell your Patek Philippe". */
  title: string;
  /** Answer-first opening. States what happens, in the first sentence. */
  intro: string;
  /** Second paragraph: what makes this maker different to sell. */
  context: string;
  /** What actually moves the number, for this brand specifically. */
  valueDrivers: { heading: string; copy: string }[];
  /** The references the desk is asked about most. */
  models: { name: string; note: string }[];
  /** Paperwork, brand by brand — it genuinely differs. */
  papers: string;
  faqs: { question: string; answer: string }[];
};

export const SELL_BRANDS: SellBrand[] = [
  {
    slug: "rolex",
    name: "Rolex",
    title: "Rolex",
    intro:
      "We buy Rolex outright and take Rolex in part-exchange, from our counter in Hatton Garden. Send the reference number, the year and a few photographs and you will have a no-obligation figure back the same day; bring the watch in or ship it insured, and payment goes out by bank transfer once our specialist has authenticated it.",
    context:
      "Rolex is the most liquid watch on earth, which cuts both ways for a seller. There is always a buyer, so you should never have to accept a bad offer — but the market prices these references down to the individual variant, and the gap between a good offer and a poor one on the same watch is wide enough to be worth ten minutes of your time. What follows is what the desk is actually looking at.",
    valueDrivers: [
      {
        heading: "The reference, not the model",
        copy: "A Submariner is not a price. 116610LN, 124060 and 126610LV are three different markets, and within them the dial and bezel variant moves the number again. The reference is engraved between the lugs at 12 o'clock, under the bracelet, and it is the first thing to find.",
      },
      {
        heading: "Box and papers",
        copy: "A full set — outer box, inner box, warranty card and booklets — is worth a real premium over a bare watch on almost every steel sports reference. Cards issued since 2015 carry a five-year international guarantee, so a card under five years old is doing more than proving provenance; the balance of that guarantee transfers.",
      },
      {
        heading: "Bracelet stretch and link count",
        copy: "Rolex bracelets wear at the pins, and a stretched Oyster on an older reference is a real deduction. So are missing links: a bracelet short of its spare links limits who the watch fits, and the links are not cheap to replace. Keep them, and send them with the watch.",
      },
      {
        heading: "Service history and polishing",
        copy: "A recent Rolex Service Centre invoice helps. Heavy polishing does the opposite — soft, rounded lugs and thin chamfers on an older piece cost more than the scratches would have. If a watch is unpolished and honest, say so.",
      },
    ],
    models: [
      { name: "Submariner", note: "The volume reference. 124060, 126610LN and 126610LV are the current market; 116610LN and the earlier five-digit cases trade on condition and originality." },
      { name: "Daytona", note: "The strongest steel market Rolex has. 116500LN and 126500LN both hold well, and precious-metal Daytonas are valued on the dial as much as the case." },
      { name: "GMT-Master II", note: "Bezel colour is most of the price. Pepsi, Batman and Root Beer are three separate markets on one reference family." },
      { name: "Datejust", note: "Enormous variety and therefore enormous spread — 36mm versus 41mm, fluted versus smooth, Jubilee versus Oyster, and the dial. Send a photograph." },
      { name: "Day-Date", note: "Precious metal only, so the metal price sets a floor. Above that it is the dial, the bracelet and whether it has been refinished." },
      { name: "Oyster Perpetual", note: "The 2020 lacquer dials trade differently to the classic references. Colour matters more than size." },
      { name: "Explorer, Sea-Dweller, Yacht-Master, Sky-Dweller", note: "All bought. All valued reference by reference — send the number." },
    ],
    papers:
      "Rolex warranty cards have been digital-format plastic since 2006 and carry the serial. A card matching the watch is the strongest single piece of provenance there is. No card is not a problem — we buy watch-only every week — but it does move the number, and we will tell you by how much before you commit to anything.",
    faqs: [
      {
        question: "Can I sell my Rolex without box and papers?",
        answer:
          "Yes. A watch with no box and no card is still a straightforward sale — we buy them regularly. Expect the offer to sit below a full set of the same reference, because the next buyer will price it the same way. We will always show you both figures so you can decide whether tracking down the card is worth it.",
      },
      {
        question: "Where can I sell my Rolex in London?",
        answer:
          "Hatton Garden is where the London trade actually happens, and we are on it. The practical advantage over a pawnbroker or a high-street jeweller is that a specialist desk prices the reference rather than the metal, and the practical advantage over an auction is that you are paid this week rather than in three months, with no seller's commission taken off the top.",
      },
      {
        question: "How much will I get for my Rolex?",
        answer:
          "It depends on the reference, the year, the condition and whether the set is complete — which is why nobody honest quotes a figure before seeing those four things. Send them over and you will have a real number the same day, with no obligation attached to it.",
      },
      {
        question: "Can I part-exchange my Rolex against something else?",
        answer:
          "Yes, and it is usually the better deal. Part-exchange lets us make the margin on the piece you are buying instead of the piece you are selling, so the number we can put against your Rolex is higher than the outright cash offer. Anything we can source can be part of it.",
      },
    ],
  },
  {
    slug: "patek-philippe",
    name: "Patek Philippe",
    title: "Patek Philippe",
    intro:
      "We buy Patek Philippe and broker it privately, from Hatton Garden. Send the reference and the paperwork and we will come back with a figure the same day; where a piece is better served by a private sale than an outright purchase we will say so, and tell you what each route is likely to net you.",
    context:
      "Patek is a thinner market than Rolex and a more informed one. Fewer watches change hands, buyers are collectors rather than passers-by, and the difference between a correct example and a compromised one is enormous. That means provenance carries far more weight here than it does on a steel sports watch, and it means the right buyer is worth waiting a few days for.",
    valueDrivers: [
      {
        heading: "The Extract from the Archives",
        copy: "Patek will issue an Extract confirming the movement and case numbers, the model and the date of sale from the manufacture. On an older or unusual piece it is the difference between a good price and a cautious one, and it is worth obtaining before you sell.",
      },
      {
        heading: "Originality above all",
        copy: "A replaced dial, a service hand set or a refinished case cost far more on a Patek than on almost anything else. Collectors here pay for correctness. If a watch is untouched, that is the headline fact about it.",
      },
      {
        heading: "Discontinuation",
        copy: "The 5711/1A ended production in 2021 and the market re-rated it immediately. Discontinued references behave differently to current ones, and a piece that has just come off the catalogue is usually worth holding a conversation about rather than moving quickly.",
      },
      {
        heading: "Complication and metal",
        copy: "A perpetual calendar, a split-seconds or a minute repeater is valued on the movement first. On simpler references the metal and the dial do more of the work — a Calatrava in rose gold and the same reference in white are not the same watch to a buyer.",
      },
    ],
    models: [
      { name: "Nautilus", note: "5711, 5712, 5980 and 5990. The 5711/1A in particular is priced by the market rather than by any list." },
      { name: "Aquanaut", note: "5167 and 5168G. Strap condition and the presence of the spare strap both count." },
      { name: "Calatrava", note: "The dress reference. Valued on metal, dial and case condition — an unpolished Calatrava is a genuinely different proposition." },
      { name: "Complications & Grand Complications", note: "Annual calendars, perpetual calendars, chronographs. Send the reference and the Extract if you have it." },
      { name: "Twenty~4", note: "Both the original quartz and the automatic. A complete set matters here." },
    ],
    papers:
      "For Patek the paperwork is the Certificate of Origin, the setting pin, the outer packaging and, ideally, an Extract from the Archives. Service records from Patek's own workshops help rather than hurt — unlike some makers, a documented Patek service is read as care rather than as intervention.",
    faqs: [
      {
        question: "Where can I sell my Patek Philippe in London?",
        answer:
          "To a specialist rather than a general watch buyer. Patek's market is narrow enough that a desk without collector contacts will price defensively — it has to, because it may hold the watch for months. We are in Hatton Garden and we broker as well as buy, which means on the right piece we can go to an end buyer rather than to the trade.",
      },
      {
        question: "Should I sell my Patek outright or on consignment?",
        answer:
          "Outright is faster and certain. A private sale usually nets more on a scarce or discontinued reference, because the buyer is the person who will wear it rather than the dealer who will resell it — but it takes longer and the figure is not guaranteed on day one. We will tell you honestly which one your watch suits.",
      },
      {
        question: "Do I need an Extract from the Archives to sell?",
        answer:
          "Not to sell, but it will usually pay for itself on anything older or unusual. It confirms that the movement, case and dial left the manufacture together, which is the single question a serious Patek buyer asks first.",
      },
    ],
  },
  {
    slug: "audemars-piguet",
    name: "Audemars Piguet",
    title: "Audemars Piguet",
    intro:
      "We buy Audemars Piguet outright and take it in part-exchange, from Hatton Garden. Send the reference, the year and photographs of the case and bracelet, and you will have a no-obligation figure back the same day.",
    context:
      "Almost every AP that comes across the desk is a Royal Oak, and the Royal Oak is unusually condition-sensitive for a sports watch. The whole design rests on the contrast between brushed surfaces and polished bevels — so where a scratched Submariner is simply a scratched Submariner, a Royal Oak that has been polished flat has lost the thing it is valued for. Condition is not a deduction here so much as a category.",
    valueDrivers: [
      {
        heading: "Bevels and brushing",
        copy: "Sharp, crisp bevels on the case and bracelet links, with the brushing still directional, are worth a great deal. A well-meant polish that has softened those edges cannot be undone, and the market knows it.",
      },
      {
        heading: "Dial and reference generation",
        copy: "Grande Tapisserie versus Petite Tapisserie, and the exact blue, grey or black, all move the number. The 15202 'Jumbo' ended production in 2022 and trades on its own terms; 15400 and 15500 are separate markets again.",
      },
      {
        heading: "Bracelet integrity",
        copy: "The integrated bracelet is part of the case, and stretch across the links is both visible and expensive. Send a photograph of the bracelet held horizontally — it tells the desk more than the case photograph does.",
      },
      {
        heading: "Factory setting versus aftermarket",
        copy: "A factory diamond-set AP and an aftermarket-set AP are not comparable, and the difference is worth stating up front. We authenticate either way; an aftermarket set is simply valued as what it is.",
      },
    ],
    models: [
      { name: "Royal Oak", note: "15202, 15400, 15500, 15450 and 26331. Reference and dial colour set the market." },
      { name: "Royal Oak Offshore", note: "Valued on size, dial and strap. Complete sets with spare straps do measurably better." },
      { name: "Code 11.59", note: "A younger market and a more variable one. Bought, and priced on the individual piece." },
      { name: "Millenary", note: "The oval case. A narrower audience, so provenance and completeness matter more." },
    ],
    papers:
      "AP warranty cards and the outer packaging both count. So does an AP service invoice — the manufacture's own restoration work is documented and is read as provenance, provided the case has not been re-finished in the process. If your watch has been back to Le Brassus, send the paperwork with it.",
    faqs: [
      {
        question: "Where can I sell my Audemars Piguet in London?",
        answer:
          "Bring it to a desk that will look at the bevels rather than just the reference. We are in Hatton Garden, we authenticate in-house, and we pay by bank transfer the day an offer is accepted. A general buyer will often price a Royal Oak as a steel sports watch, which on a sharp, unpolished example leaves money on the table.",
      },
      {
        question: "Does polishing reduce what my Royal Oak is worth?",
        answer:
          "Yes, and more than on most watches. The Royal Oak's value is bound up in the contrast between its brushed tops and polished bevels, and a general polish rounds those edges permanently. If yours has never been polished, that is a selling point worth stating.",
      },
      {
        question: "Do you buy Royal Oaks without papers?",
        answer:
          "Yes. Watch-only Royal Oaks trade every week. The card and packaging move the figure rather than decide the sale, and we will show you the difference before you commit.",
      },
    ],
  },
  {
    slug: "cartier",
    name: "Cartier",
    title: "Cartier",
    intro:
      "We buy Cartier watches and Cartier jewellery — Tank, Santos, Ballon Bleu, Love bracelets, Juste un Clou and Trinity — from our counter in Hatton Garden. Send photographs and the reference or serial and we will come back with a figure the same day.",
    context:
      "Cartier is the one maker on this list where the jewellery matters as much as the watches, and both are bought here. It is also the maker most affected by counterfeiting at the accessible end, which is why authentication is done properly and in front of you rather than taken on trust. For a genuine piece, that works in your favour: a verified Love bracelet sells for what it is worth, not at the discount an unverified one attracts.",
    valueDrivers: [
      {
        heading: "Metal and gem weight",
        copy: "A great deal of Cartier's value sits in the gold itself, which puts a real floor under the number — see our live metal prices. Above that floor it is the model, the size and whether the piece is current.",
      },
      {
        heading: "Certificate and serial",
        copy: "Cartier certificates and the serial engraved on the piece are what authentication starts from. On Love bracelets the serial sits on the inside of one half; on watches it is on the caseback or between the lugs.",
      },
      {
        heading: "Screwdrivers, links and pouches",
        copy: "The small things carry real money on Cartier. A Love bracelet with both screwdrivers, the certificate and the box is a materially better sale than the bracelet alone.",
      },
      {
        heading: "Size and current production",
        copy: "Tank sizes, Santos sizes and Love bracelet sizes all have different demand. A size that is easy to wear sells faster and therefore prices better.",
      },
    ],
    models: [
      { name: "Tank", note: "Louis Cartier, Must, Française, Américaine and Solo. Metal, size and movement type all separate the markets." },
      { name: "Santos", note: "The 2018 QuickSwitch generation trades apart from the earlier Santos 100 and Galbée." },
      { name: "Ballon Bleu", note: "Priced on size and metal. The 42mm and the 33mm are different watches to a buyer." },
      { name: "Love bracelet", note: "Bought regularly. Size, metal, diamond content and whether the screwdrivers are present." },
      { name: "Juste un Clou & Trinity", note: "Both bought. Send the size and the metal." },
      { name: "Panthère & Pasha", note: "Bought. Photographs of the bracelet and clasp help most." },
    ],
    papers:
      "The Cartier certificate, the red box, the pouch and — on Love and Juste un Clou — the screwdrivers. A complete presentation genuinely changes the offer on Cartier more than on any other maker here, because the next buyer is often buying it as a gift.",
    faqs: [
      {
        question: "Do you buy Cartier jewellery as well as Cartier watches?",
        answer:
          "Yes — Love bracelets, Juste un Clou, Trinity rings, Panthère pieces and diamond-set jewellery, alongside the watches. We are a jeweller as well as a watch dealer, so a Cartier piece is valued on the stones and the gold as well as on the name.",
      },
      {
        question: "How do you authenticate a Cartier Love bracelet?",
        answer:
          "By the serial and hallmark, the screw threads and heads, the weight, the finish of the engraving and the fit of the two halves. It is done in front of you at the counter. A genuine piece verifies quickly; the check exists to protect the price a genuine piece deserves.",
      },
      {
        question: "I have lost the screwdriver for my Love bracelet. Does that matter?",
        answer:
          "It reduces the offer a little rather than preventing the sale. The screwdrivers are replaceable through Cartier, so the deduction reflects that cost and the incomplete presentation, not a doubt about the piece.",
      },
    ],
  },
  {
    slug: "omega",
    name: "Omega",
    title: "Omega",
    intro:
      "We buy Omega — Speedmaster, Seamaster, Constellation, De Ville and the Swatch collaborations — from Hatton Garden. Send the reference and a few photographs and you will have a no-obligation figure the same day, with payment by transfer once the watch is authenticated.",
    context:
      "Omega is the most accessible maker on this list and the one where sellers are most often underpaid, because the high street tends to price an Omega as a second-hand watch rather than as a specific reference. Some Speedmasters and vintage Seamasters are worth several times what a general buyer will offer for them, and the difference is entirely in knowing which is which.",
    valueDrivers: [
      {
        heading: "Calibre and generation",
        copy: "The movement is often the whole story. A hand-wound Moonwatch, a co-axial Seamaster and a quartz De Ville are three unrelated markets, and the caseback and calibre number tell the desk which one it is holding.",
      },
      {
        heading: "Vintage originality",
        copy: "On anything pre-1980 the dial is the value. An original dial with even patina is worth substantially more than a redial, and a redial is usually obvious to a specialist and invisible to everyone else.",
      },
      {
        heading: "Limited and collaboration pieces",
        copy: "Limited editions, anniversary Speedmasters and the MoonSwatch collaborations trade on their own terms rather than on Omega's general market. The edition number and the completeness of the set both count.",
      },
      {
        heading: "Bracelet and end links",
        copy: "Correct, period-appropriate bracelets and end links are scarce on vintage Omega and are worth real money. An incorrect bracelet is not a problem, but a correct one is a bonus worth mentioning.",
      },
    ],
    models: [
      { name: "Speedmaster", note: "Professional Moonwatch, Reduced, Racing and the limited editions. Calibre and caseback identify it." },
      { name: "Seamaster", note: "Diver 300M, Planet Ocean, Aqua Terra and the vintage 300. Four different markets under one name." },
      { name: "Constellation", note: "Both the modern Manhattan and the vintage pie-pan. Vintage is priced on dial originality." },
      { name: "De Ville", note: "Dress references, often gold. Metal sets the floor; the calibre sets the rest." },
      { name: "Vintage Omega", note: "1950s–70s pieces bought on originality. Send a clear, straight-on dial photograph." },
    ],
    papers:
      "Omega card or certificate, box, and any service paperwork. Omega's own Extract of the Archives is available for vintage pieces and is worth having on anything unusual — it confirms the calibre, case and date of production, which is the question every vintage buyer asks.",
    faqs: [
      {
        question: "Is my Omega worth selling to a specialist rather than a high-street jeweller?",
        answer:
          "Almost always, and Omega is the clearest case of it. A general buyer prices an Omega as a used watch; a specialist prices the reference. On Speedmasters and vintage Seamasters in particular, the two figures can be a long way apart.",
      },
      {
        question: "Do you buy vintage Omega?",
        answer:
          "Yes, and vintage is where the interesting values are. Originality is what we are looking at — the dial above everything, then the hands, the crown and the case. Send a straight-on photograph of the dial in daylight and we can tell you a great deal from it.",
      },
      {
        question: "What is my Omega Speedmaster worth?",
        answer:
          "It depends entirely on which Speedmaster it is — hand-wound Professional, Reduced, Racing or a limited edition — and on the set. The caseback and the calibre number identify it. Send those and you will have a real figure the same day.",
      },
    ],
  },
];

export function sellBrandBySlug(slug: string): SellBrand | undefined {
  return SELL_BRANDS.find((b) => b.slug === slug);
}
