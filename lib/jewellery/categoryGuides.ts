import type { JewelleryCategorySlug } from "../types";

/**
 * Editorial content for /jewellery/[category].
 *
 * The same gap the watch brand pages had, on the higher-value half of the
 * business: a hero, a line of heritage copy, a film reel and a product grid,
 * with no prose and no FAQ block anywhere on any of them. Search Console
 * already has /jewellery/earrings at position 7.7 and the onyx signet listing
 * at position 5 — these pages rank when they are found, they are simply thin,
 * and thin is what keeps a page from being found for anything but its own
 * name.
 *
 * Four categories, not seven. Engagement rings and wedding rings both redirect
 * to the ring builder (see JEWELLERY_CATEGORIES.href), and /jewellery/rings is
 * a hub above them, so none of the three is a page that needs its own buying
 * guide — /rings, /rings/[shape] and /guides/wedding-bands already carry that
 * material and would be competing with themselves. What is left is four
 * genuinely different products: what you check on a pair of earrings is not
 * what you check on a Cuban chain, and the content below is written to show
 * that rather than to fill four slots.
 *
 * No prices and no carat weights presented as stock. Both move, and the
 * catalogue is the place that knows them.
 */

export type CategoryGuide = {
  /** Answer-first opening: what actually decides quality here. */
  intro: string;
  /** The choices a buyer has to make, and what each one changes. */
  choices: { heading: string; copy: string }[];
  faqs: { question: string; answer: string }[];
};

export const CATEGORY_GUIDES: Partial<
  Record<JewelleryCategorySlug, CategoryGuide>
> = {
  earrings: {
    intro:
      "Two things decide what a pair of diamond earrings costs, and neither is obvious from a listing. The first is that carat weight is almost always quoted for the pair rather than for each stone — a pair advertised at one carat is usually two half-carat diamonds, which is a completely different object from two one-carat diamonds. The second is that the two stones have to match each other for colour, clarity and cut, and a matched pair is meaningfully harder to assemble than two unrelated stones. That is why a good pair costs more than twice a good single.",
    choices: [
      {
        heading: "Studs, hoops or drops",
        copy: "Studs sit on the lobe and are the everyday choice; they can be worn asleep, under a helmet, through airport security, forever. Hoops read as jewellery from across a room and the diameter changes the whole character — small huggies are an everyday piece, anything past an inch is an outfit. Drops move, which is what makes them dressy, and they are the only one of the three that needs thinking about alongside a neckline.",
      },
      {
        heading: "The setting, and what it does to the stone",
        copy: "A four-claw setting lifts the diamond and lets light in from the sides, which makes it look larger and brighter. A three-claw does the same with less metal in the way. A rubover — a rim of metal all the way round, also called a bezel — protects the girdle completely and is the setting to choose for someone who is hard on jewellery or works with their hands, at the cost of the stone reading slightly smaller.",
      },
      {
        heading: "The back matters more than people expect",
        copy: "This is where earrings are actually lost. A butterfly back is the standard push-on fitting and it works loose over a day. A screw-back threads onto the post and is very secure but slow to put on. An alpha or lever back sits between the two — it clicks shut and stays shut. For anything valuable, ask for screw or alpha backs rather than accepting butterflies by default; it is a small cost against losing one of a pair.",
      },
      {
        heading: "Weight, if you wear them daily",
        copy: "A heavy drop worn every day will stretch a piercing over years. It is a real consideration rather than a sales one, and it is the reason substantial earrings are often made in white gold or platinum over a lighter framework rather than solid throughout. Ask what a pair weighs before committing to wearing them constantly.",
      },
    ],
    faqs: [
      {
        question: "Is diamond earring carat weight per stone or per pair?",
        answer:
          "Almost always the pair. A pair described as one carat is normally two diamonds of roughly half a carat each. It is the single most common misunderstanding in earrings, and it is worth confirming in writing before comparing two prices — a pair of one-carat stones and a one-carat total-weight pair are very different pieces at very different prices.",
      },
      {
        question: "Why do diamond earrings cost more than twice a single diamond?",
        answer:
          "Because the two stones have to match. A pair needs diamonds of the same colour, clarity, cut and proportion so they look identical on either side of a face, and finding a true match is harder than finding either stone on its own. That matching is a real part of the value, and it is why a well-matched pair holds its worth better than two mismatched stones of the same total weight.",
      },
      {
        question: "Which earring backs are the most secure?",
        answer:
          "Screw backs are the most secure — the post is threaded and the back winds on, so it cannot be knocked off. Alpha or lever backs are nearly as secure and much faster to fasten. Butterfly backs are the common push-on fitting and are the least secure of the three; they loosen through the day and are how most earrings are lost. We can fit screw or alpha backs to any pair.",
      },
      {
        question: "Can I have earrings made to match a ring I already own?",
        answer:
          "Yes, and it is a large part of what we do. Bring the ring in so the setting style, metal colour and stone character can be matched properly at the bench — photographs are not enough to match a metal tone or a claw profile. We can work to a pair of stones you already have, or source stones matched to the ring.",
      },
    ],
  },

  bracelets: {
    intro:
      "A bracelet is the piece of jewellery most likely to be damaged and most likely to be lost, because it is on the part of the body that hits things. That single fact should drive the buying decision more than it usually does: on a tennis bracelet the clasp and the safety catch matter more than the carat weight, and on a chain bracelet whether the links are solid or hollow matters more than the gram price.",
    choices: [
      {
        heading: "Tennis bracelets: the clasp is the product",
        copy: "A line of diamonds is only as good as the thing holding it on a wrist. Look for a box clasp with a figure-of-eight safety catch, or a double catch on anything substantial — a single push clasp on a bracelet worth thousands is an accident waiting to happen. The name, incidentally, comes from Chris Evert losing hers mid-match at the 1987 US Open and stopping play to find it, which tells you everything about why the catch matters.",
      },
      {
        heading: "Solid or hollow, on a chain bracelet",
        copy: "Cuban and curb links are made either solid or hollow, they look near enough identical when new, and they are entirely different purchases. Hollow links are lighter and cheaper and dent, crush and split with wear; solid links can be repaired almost indefinitely. Gram weight is the honest signal here — ask for it, because two bracelets of the same length and width can differ severalfold in gold content and price.",
      },
      {
        heading: "Sizing, which is not one-size",
        copy: "Measure the wrist snugly and add roughly a centimetre and a half for a comfortable bracelet, or a little less for one meant to sit close. A tennis bracelet that is too long rotates so the stones face downward and wears through faster on the underside; too short and it will not sit flat. Links can be added or removed at the bench, and it is worth doing rather than living with it.",
      },
      {
        heading: "The hallmark",
        copy: "Any gold bracelet over one gram sold in the UK must be hallmarked, and a bracelet is easily heavy enough to qualify. It is the independent check that the metal is what it is described as, tested by an assay office rather than asserted by a seller.",
      },
    ],
    faqs: [
      {
        question: "What size tennis bracelet should I buy?",
        answer:
          "Measure the wrist with a tape snugly, then add about 1.5cm for a comfortable fit that moves a little, or about 1cm for one that sits close. Seven inches is the most common women's size and eight the most common men's, but wrists vary enough that measuring is worth the minute it takes. Length can be adjusted at the bench by adding or removing links.",
      },
      {
        question: "What is the difference between a solid and a hollow gold bracelet?",
        answer:
          "Hollow links are formed from a thin shell of gold around a void. They look the same as solid links when new, cost considerably less and weigh a fraction as much — and they dent, crush and split with normal wear, after which they are difficult and often uneconomic to repair. Solid links can be repaired, resized and re-polished more or less indefinitely. Always ask for the gram weight rather than just the width and length.",
      },
      {
        question: "How do I stop a tennis bracelet falling off?",
        answer:
          "Insist on a proper box clasp with a figure-of-eight safety catch, and on anything substantial a double safety catch. Check the catch closes with a definite click rather than a soft push, and have it inspected once a year — clasps wear before anything else on a bracelet does. We will fit a stronger catch to an existing bracelet if the one on it is not up to the job.",
      },
    ],
  },

  "necklaces-pendants": {
    intro:
      "Most problems with a necklace are problems of proportion rather than quality. A chain too light for its pendant will wear through at the bail and eventually part; a chain too heavy overwhelms the piece it is carrying; and length changes where a pendant sits on the body more than any other decision. Get those three right and the rest is a matter of taste.",
    choices: [
      {
        heading: "Length, and where it actually sits",
        copy: "On most adults, 16 inches sits at the base of the neck, 18 inches on the collarbone, 20 inches just below it, and 22 to 24 inches at or near the sternum. Eighteen is the default for a reason — it works over almost any neckline. If a pendant is going to be worn with open collars, 20 or 22 gives it room to be seen. Men's chains are usually 20 to 24.",
      },
      {
        heading: "Match the chain to the pendant, not to the budget",
        copy: "The bail — the loop the chain passes through — sets the maximum chain width, and a chain that only just fits will chafe. Equally, a heavy pendant on a fine chain concentrates all its weight on two points and is the most common way a necklace fails. Bring the pendant when choosing a chain, or buy them together and have the pairing checked.",
      },
      {
        heading: "Solid or hollow, again",
        copy: "As with bracelets, and it matters more here because a neck chain flexes constantly. Hollow rope and Cuban chains kink and split; solid ones can be soldered and repaired. The gram weight tells you which you are being offered far more reliably than the description does.",
      },
      {
        heading: "Rivière or tennis",
        copy: "A rivière is a line of graduated stones, largest at the centre, tapering toward the clasp — it is designed to be seen against skin and sits as the focal point of an outfit. A tennis necklace runs the same size stone the whole way round. Both are lines of diamonds; the rivière is the dressier and more traditional of the two, and the tennis the more modern and more wearable day to day.",
      },
    ],
    faqs: [
      {
        question: "What length necklace should I buy?",
        answer:
          "Eighteen inches is the safest default for a woman and sits on the collarbone. Sixteen sits at the base of the neck, 20 just below the collarbone, and 22 to 24 at or near the sternum, which suits a larger pendant or an open neckline. Men's chains are typically 20 to 24 inches. If it is a gift and you cannot measure, 18 inches with an extender chain is the forgiving choice.",
      },
      {
        question: "What chain do I need for a heavy pendant?",
        answer:
          "One rated for the weight, with a link gauge that fills the bail rather than rattling through it. A heavy pendant on a fine chain puts all its load on the two links either side of the bail, which is exactly where necklaces break. Bring the pendant in and we will pair it properly — it takes a few minutes and it is the difference between a piece that lasts and one that is lost.",
      },
      {
        question: "What is the difference between a rivière and a tennis necklace?",
        answer:
          "A rivière uses graduated stones, largest at the front and tapering toward the clasp, so it reads as a single sweeping line and sits as the centrepiece of an outfit. A tennis necklace uses the same stone size the whole way round and is more uniform and more casual. Both are continuous lines of diamonds; the rivière is the more formal of the two.",
      },
    ],
  },

  "mens-jewellery": {
    intro:
      "Men's jewellery is bought on weight and finish far more than on stone quality, and that makes it unusually easy to compare honestly — if you can get the gram weight and the metal fineness, you know most of what you need to know. The two places it goes wrong are hollow chains sold at solid-chain prices, and signet rings ordered without thinking through the engraving, which cannot be undone.",
    choices: [
      {
        heading: "Signet rings: seal or decorative",
        copy: "A true seal signet is engraved in reverse and intaglio — cut into the face — so that it leaves a raised impression in wax. A decorative signet is engraved the right way round to be read on the hand. They are different jobs and different prices, and you have to decide which you want before it is cut, because there is no changing it afterwards. Traditionally worn on the little finger of the non-dominant hand, though that is convention rather than rule.",
      },
      {
        heading: "Stone-set signets",
        copy: "Onyx is the classic face — black, opaque, and it takes a high polish that sets off yellow gold particularly well. It is also relatively soft, so it wants a rubover setting where the metal protects the edges rather than claws that leave the stone exposed. Bloodstone, lapis and carnelian are the other traditional choices. Any of them can be engraved, though onyx is the one that reads most cleanly.",
      },
      {
        heading: "Cuban chains: get the gram weight",
        copy: "The single most useful question is what it weighs. A solid 18ct Cuban and a hollow one of identical width and length look the same in a photograph and differ by a multiple in gold content, in price and in how long they last. Hollow links crush and split under normal wear and are rarely worth repairing. Solid links last a lifetime and can be shortened, lengthened and re-polished.",
      },
      {
        heading: "Metal fineness, and the hallmark that proves it",
        copy: "Nine carat is 37.5% gold and harder-wearing; 18ct is 75% gold, richer in colour and softer. Neither is better in the abstract — 9ct makes sense for a chain worn constantly, 18ct for a piece where the colour is the point. Anything gold over one gram must carry a UK hallmark, which is the independent test of that fineness rather than the seller's word for it.",
      },
    ],
    faqs: [
      {
        question: "Which finger does a signet ring go on?",
        answer:
          "Traditionally the little finger of the non-dominant hand — the left for most people. That convention comes from the ring's origin as a seal, worn where it could be pressed into wax without getting in the way. Plenty of people now wear one on the ring finger or index instead, and there is no rule about it. What matters practically is that little fingers are usually a much smaller size than people assume, so have it measured rather than guessed.",
      },
      {
        question: "Can a signet ring be engraved after it is made?",
        answer:
          "Yes, provided the face is thick enough to take the cut — which is why it is worth saying at the point of ordering that engraving is planned, so the head is made with enough metal in it. Decide early whether you want a seal engraving, cut in reverse so it stamps a raised impression in wax, or a decorative one cut to be read on the hand. The two cannot be converted into one another.",
      },
      {
        question: "How can I tell if a gold chain is solid or hollow?",
        answer:
          "Ask for the weight in grams. There is no reliable way to tell by eye — a hollow Cuban and a solid one of the same width and length look identical — but they differ by a multiple in gold content, so the weight settles it immediately. A seller who will not give you a gram weight for a gold chain is telling you something. Hollow links crush and split with wear and are rarely economic to repair.",
      },
      {
        question: "Is 9ct or 18ct gold better for a men's chain?",
        answer:
          "Neither is better outright. Nine carat is 37.5% gold, harder and more resistant to scratching and bending, and considerably cheaper — a sensible choice for a heavy chain worn every day. Eighteen carat is 75% gold, noticeably richer in colour and softer, and it is what to choose when the colour is the point. Both are hallmarked at the assay office, which is what independently proves the fineness.",
      },
    ],
  },
};

export function categoryGuide(slug: string): CategoryGuide | undefined {
  return CATEGORY_GUIDES[slug as JewelleryCategorySlug];
}
