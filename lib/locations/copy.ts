import { SELL_BRANDS } from "../sell/brands";

/**
 * The Birmingham pages' copy.
 *
 * ── Why this exists as data ──
 *
 * The Birmingham pages are the same *service* as the London ones, and the
 * facts that make up a valuation — what moves a Royal Oak's price, which
 * paperwork matters — are identical whichever counter you walk into. Those
 * facts stay in lib/sell/brands.ts and are read from there by both cities.
 * Copying them would create a second source of truth that drifts, and a
 * Birmingham page contradicting the London one on what a warranty card is
 * worth is worse than having no Birmingham page at all.
 *
 * What differs is genuinely local: who the seller is, where they are coming
 * from, what the alternative in their city looks like, and how the two shops
 * relate to each other. That is what lives here.
 *
 * ── The duplication risk, stated plainly ──
 *
 * A per-city page built by swapping a noun is a doorway page, and Google is
 * explicit about demoting sets of them. The protection is that every field
 * below is written about Birmingham specifically and would not read correctly
 * with the city name swapped out. If a third location is ever added by copying
 * this file and running find-and-replace on "Birmingham", that protection is
 * gone and the pages should not ship.
 */

type LocationCopy = {
  intro: string;
  context: string;
  advantages: { heading: string; copy: string }[];
  faqs: { question: string; answer: string }[];
  sellIntros: Record<string, string>;
};

export const BIRMINGHAM: LocationCopy = {
  /** The hub's opening. Answer-first: what is here and what you can do. */
  intro:
    "Alpoe has two counters: Hatton Garden in London, and Birmingham. Both buy and take luxury watches in part-exchange, both handle bespoke commissions, and both work from the same stock — a piece listed on this site can be brought to whichever is closer to you. If you are in the Midlands, you do not need to make the trip to London to get a specialist figure on a watch.",

  context:
    "Birmingham has made jewellery for two hundred years and still assays more of it than anywhere else in the country — the anchor on a British hallmark is this city's mark. What the West Midlands has less of is dedicated luxury watch buying. The result is that sellers here are routinely quoted by pawnbrokers and general dealers who price a watch on its metal and its brand rather than on its reference, which is how a Hublot or a Royal Oak ends up leaving for a fraction of what it is worth.",

  /** Why a second counter changes the offer, not just the postcode. */
  advantages: [
    {
      heading: "The reference is priced, not the brand",
      copy: "A specialist desk looks up what your exact reference has been trading at, in your exact configuration. A general buyer applies a percentage to a brand. On a Big Bang or a Royal Oak the two answers are a long way apart, and the gap is entirely the seller's to lose.",
    },
    {
      heading: "One stock, two counters",
      copy: "Everything listed on this site can be seen at either shop. If a watch you want to view is at the other counter, we move it rather than asking you to. Say which is convenient when you enquire.",
    },
    {
      heading: "No need to travel to London",
      copy: "This site used to tell Midlands sellers to come to Hatton Garden. That was true when there was one counter and it is not any more. You can have a figure by WhatsApp today and settle it in Birmingham.",
    },
    {
      heading: "Paid by transfer, no commission",
      copy: "An outright sale is settled by bank transfer once the watch is authenticated. There is no seller's commission taken off the top, which is what separates this from an auction, and no three-month wait to find out what you got.",
    },
  ],

  faqs: [
    {
      question: "Where is the Alpoe Birmingham shop?",
      answer:
        "In Birmingham. Message us on WhatsApp or call before you travel and we will confirm the address and that the right person is on the counter — watch valuations are done by a specialist rather than by whoever is in, so a call first saves you a wasted trip.",
    },
    {
      question: "Can I sell my watch in Birmingham rather than London?",
      answer:
        "Yes. The Birmingham counter buys and part-exchanges on the same terms as Hatton Garden — same desk, same references, same figures. Send the reference number, the year and a few photographs and you will have a no-obligation number back the same day, whichever counter you then use.",
    },
    {
      question: "Do I get a different price in Birmingham than in London?",
      answer:
        "No. The offer is made on the watch, not on the postcode. There is one desk pricing both counters, so you are not playing the two against each other and you do not need to.",
    },
    {
      question: "Can I see a watch listed on the site at the Birmingham shop?",
      answer:
        "Yes — tell us which piece and which counter suits you and we will have it there. Give us a day's notice if it is currently at the other shop.",
    },
    {
      question: "Do you buy from outside Birmingham?",
      answer:
        "Regularly. Solihull, Coventry, Wolverhampton and across Warwickshire and the wider West Midlands, and by insured tracked courier from anywhere in the UK. The valuation process is identical either way: reference number, year, photographs, figure the same day.",
    },
  ],

  /**
   * The per-brand framing for /birmingham/sell/[brand]. One paragraph each,
   * and each is about that brand's specific problem in this specific market —
   * not the same sentence with the brand swapped.
   */
  sellIntros: {
    rolex:
      "Rolex is the one watch every buyer in the Midlands will make an offer on, which is exactly why the offers vary so widely. A jeweller who sees one Submariner a month and a desk that prices the reference daily will not arrive at the same figure, and the reference — not the model — is what decides it.",
    "audemars-piguet":
      "Audemars Piguet is the brand Midlands sellers are most often underpaid on, and the search data says so directly: more people reach this site looking to sell a Royal Oak than any other watch. Outside a specialist desk the Royal Oak is frequently priced as a generic gold or steel sports watch, which ignores the dial, the case size and the generation — the three things that actually set its value.",
    "patek-philippe":
      "A Patek should never be sold to a general buyer, and in the West Midlands there are very few of any other kind. These are valued individually rather than against a reference market, the Extract from the Archives matters, and the difference between a considered offer and a quick one runs into five figures on the complicated pieces.",
    cartier:
      "Cartier sits awkwardly for most buyers because it is a jeweller and a watchmaker at once, so a Tank gets priced as jewellery and a Santos as a watch, often by somebody comfortable with only one of those. Both are bought here on their own terms.",
    omega:
      "Omega is where the ordinary high street gets closest to being right and still leaves money behind, because an Omega tends to be priced as a used watch rather than as a specific calibre and generation. On Speedmasters and vintage Seamasters that gap is the whole point of coming to a specialist.",
    hublot:
      "Hublot is the reason this page exists. More people search for Hublot against Birmingham than any other watch-and-city combination that reaches this site, and a good share of them are searching the word “pawn” — which means they are about to be quoted against the gold content by somebody who will not look at the reference. Bring it here first.",
  },
};

/** The sell brands that have Birmingham framing written for them. */
export const birminghamSellBrands = () =>
  SELL_BRANDS.filter((b) => b.slug in BIRMINGHAM.sellIntros);
