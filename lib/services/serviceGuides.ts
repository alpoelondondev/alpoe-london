import { ROUTES, type Route } from "../routes";

/**
 * The workshop services, as pages.
 *
 * All three are things this bench genuinely does and none of them had a page.
 * Resizing was a paragraph buried in /hallmarking, remodelling was a card on
 * /rings, and repair existed only as an option in the /contact enquiry
 * dropdown. "Ring resizing Hatton Garden", "jewellery repairs Hatton Garden"
 * and "reset an inherited stone" are local, commercial, low-competition
 * searches arriving at a site that never says it does the work.
 *
 * Three, not four. A valuations page is deliberately absent: /sell and
 * /sell/[brand] already hold that intent with a free-valuation offer and a
 * form, and a fourth page competing with a spine that already ranks would be
 * cannibalisation rather than coverage. The distinction between an insurance
 * valuation, a probate valuation and what a dealer will pay is real and worth
 * writing about one day — but not on a page that would fight /sell for the
 * same query, and not before somebody confirms which of the three this
 * business actually issues.
 *
 * ── Sourcing rule ──
 *
 * No prices and no turnaround times. Both vary by piece and by workload, both
 * go stale, and a "5–7 days" written into a page is a promise the bench then
 * has to keep on a job it has not seen. What is here instead is the mechanism
 * — what the work involves, what can and cannot be done, and what the law
 * requires — which is stable, checkable, and the part a customer is actually
 * trying to find out before they walk in.
 *
 * The hallmarking claims are the ones to be most careful with. They restate
 * what /hallmarking already says, which was written against the Hallmarking
 * Act position: adding metal to size up is permitted within limits, removing
 * metal is an alteration, and an improperly repaired article is treated in
 * law as though it had never been hallmarked. Do not extend beyond that
 * without checking the Act.
 */

export type ServiceGuide = {
  slug: string;
  path: Route;
  /** Short name, for cards and breadcrumbs. */
  name: string;
  h1: string;
  title: string;
  description: string;
  /** One-line summary for the hub. */
  blurb: string;
  intro: string;
  /** What the job actually involves. */
  steps: { heading: string; copy: string }[];
  /** The honest limits — what cannot be done, or should not be. */
  limits: { heading: string; copy: string }[];
  faqs: { question: string; answer: string }[];
};

export const SERVICE_GUIDES: ServiceGuide[] = [
  {
    slug: "ring-resizing",
    path: ROUTES.serviceRingResizing,
    name: "Ring resizing",
    h1: "Ring Resizing in Hatton Garden",
    title: "Ring Resizing in Hatton Garden",
    description:
      "How a ring is sized up and down, which rings cannot be resized at all, and why a resize on a hallmarked ring has to go back through the assay office.",
    blurb:
      "How sizing up and sizing down actually differ, which rings cannot be resized, and why a hallmarked ring goes back through the assay office.",
    intro:
      "Most rings can be resized, most of the time, by a size or two in either direction. The two directions are not the same job, though, and the difference matters more than people expect — sizing up adds metal, sizing down removes it, and UK hallmarking law treats those two things quite differently.",
    steps: [
      {
        heading: "Sizing up",
        copy:
          "The shank is cut and a piece of matching metal is let in, then soldered, filed back and re-polished so the join disappears. On a plain band this is straightforward. The alternative for very small adjustments is stretching, which puts no new metal in but thins the shank slightly and only works for a fraction of a size — it is not a substitute for a proper size-up.",
      },
      {
        heading: "Sizing down",
        copy:
          "A section is removed from the shank and the two ends are brought together and soldered. The ring is then trued back to round, because a soldered joint pulls slightly as it cools, and re-polished. A ring sized down more than a little may also need the shank thickened, since removing metal from a band that is already worn thin leaves it weaker than it started.",
      },
      {
        heading: "The assay office step",
        copy:
          "Adding metal to size a ring up is permitted within set limits. Removing metal counts as an alteration, and an article that has been improperly repaired is treated in law as though it had never been hallmarked at all. We put resizes through the London Assay Office as a matter of course rather than leaving that to chance — the counter is on Greville Street, inside the quarter, which is why it is a walk rather than a wait.",
      },
      {
        heading: "Get measured rather than guess",
        copy:
          "A resize should be done once. Have the finger measured on a normal day at a normal temperature rather than working from a size somebody remembers, because fingers change with heat, salt and time of day, and a ring resized to a figure taken on a hot afternoon will be loose in January.",
      },
    ],
    limits: [
      {
        heading: "Full eternity rings cannot be resized",
        copy:
          "The stones run the entire circumference, so there is nowhere to add or remove metal without disturbing the setting. Half and three-quarter eternity rings usually can be, because the plain section at the back is exactly the part a jeweller needs. If a full eternity ring does not fit, the options are having it remade to size or wearing it on a different finger — no bench can size it, and one that says otherwise is planning to damage it.",
      },
      {
        heading: "Tension settings",
        copy:
          "A tension-set stone is held by the spring of the metal itself. Altering the shank changes that spring, which is the whole mechanism holding the stone in. Most tension settings cannot be resized at all, and the few that can need the maker rather than a general bench.",
      },
      {
        heading: "Full-band engraving, milgrain and pavé",
        copy:
          "Anything patterned the whole way round has the same problem an eternity ring has, in a milder form: the pattern will not meet across a join. A skilled hand can sometimes hide it on milgrain, rarely on engraving. Ask to see how the join will fall before agreeing to it.",
      },
      {
        heading: "How many times is too many",
        copy:
          "Every resize works the metal and takes a little from the shank. Two or three over a lifetime is unremarkable; a ring that has been up and down repeatedly will eventually want a new shank instead, which is a bigger job and worth planning for rather than discovering.",
      },
    ],
    faqs: [
      {
        question: "How much can a ring be resized?",
        answer:
          "Comfortably by one or two sizes in either direction on most plain and partly set rings. Beyond that it is still possible but starts to distort the proportions — the setting sits differently, and any pattern or stone spacing near the join stops looking right. A change of more than about two sizes is usually better handled by replacing the shank.",
      },
      {
        question: "Can an eternity ring be resized?",
        answer:
          "A full eternity ring cannot, because the diamonds run the whole way round and there is no plain metal to cut into or add to. Half and three-quarter eternity rings usually can be, as the plain back section is precisely where the work happens. If a full eternity ring does not fit, it has to be remade rather than altered.",
      },
      {
        question: "Does resizing a ring damage the hallmark?",
        answer:
          "It can if it is done carelessly, which is the reason the law takes an interest. Adding metal to size up is permitted within limits; removing metal is an alteration, and an improperly repaired article is treated in law as though it had never been hallmarked. We put resizes through the London Assay Office as a matter of course, so the mark on the ring still means what it says afterwards.",
      },
      {
        question: "Can you resize a ring bought somewhere else?",
        answer:
          "Yes. It does not need to be a piece we made, and there is no obligation attached to bringing one in. Bring the ring rather than a photograph — the shank thickness, the setting and how much wear it already carries all change what is sensible to do, and none of that is visible in an image.",
      },
    ],
  },

  {
    slug: "jewellery-repairs",
    path: ROUTES.serviceJewelleryRepairs,
    name: "Jewellery repairs",
    h1: "Jewellery Repairs in Hatton Garden",
    title: "Jewellery Repairs in Hatton Garden",
    description:
      "Claw re-tipping, worn shanks, broken chains, clasps and rhodium replating — what each repair involves, and the one check that stops you losing a stone.",
    blurb:
      "Claw re-tipping, worn shanks, chains and clasps, and the annual check that prevents most lost stones.",
    intro:
      "Most jewellery that fails does not fail suddenly. Claws wear thin over years, a shank gets thinner every time it is polished, a clasp loosens by degrees — and then one day something is gone. Almost all of it is visible beforehand to somebody who looks, which is why the most valuable thing on this page is not a repair at all but a check.",
    steps: [
      {
        heading: "Claw re-tipping — the one that matters most",
        copy:
          "The tips of the claws holding a stone wear down against everything a hand touches. Once they are thin enough, a knock is all it takes. Re-tipping adds metal back to the tip and reshapes it, and it is a small job done in time and an expensive one done afterwards. If you have a ring you wear daily and have never had the claws looked at, that is the thing to book.",
      },
      {
        heading: "Shank replacement",
        copy:
          "The underside of a ring thins with wear and with each polish, and eventually it goes out of round or splits. A new shank is soldered in and shaped to match — the ring keeps its head, its stones and its character, and gets a fresh band. On a ring worn for decades this is normal maintenance rather than a repair.",
      },
      {
        heading: "Chains, clasps and catches",
        copy:
          "A broken link is soldered and re-polished. A worn clasp is replaced, and it is worth replacing with something stronger than the original if the piece has grown heavier — a bracelet or a pendant that has been added to often outgrows the catch it came with. Safety chains can be fitted to anything that matters.",
      },
      {
        heading: "Rhodium replating",
        copy:
          "White gold is plated with rhodium to make it properly white, and the plating wears through in roughly one to three years of daily wear, usually showing first on the underside of the shank. Replating cleans, polishes and re-coats the piece and it comes back looking new. Platinum and yellow and rose gold never need this.",
      },
    ],
    limits: [
      {
        heading: "Some things are not worth repairing, and we will say so",
        copy:
          "Hollow chain links that have crushed or split are the clearest example: the repair costs more than the chain is worth and the next failure is already forming somewhere else along it. The same is true of very thin, heavily worn mass-produced settings. An honest assessment before the work is more use to you than a quote.",
      },
      {
        heading: "Repairs on a hallmarked piece",
        copy:
          "An article that has been improperly repaired is treated in law as though it had never been hallmarked. Any work that adds or removes significant metal needs to be handled with that in mind, which is a reason to be careful about who does it rather than a reason to avoid the work.",
      },
      {
        heading: "Polishing is not free",
        copy:
          "Every polish removes a little metal. It is why a much-polished ring has soft, rounded edges where a cared-for one has crisp ones, and why we would rather clean a piece than polish it when cleaning will do. If you want a ring to last generations, ask for it to be polished less often, not more.",
      },
    ],
    faqs: [
      {
        question: "How often should I have my engagement ring checked?",
        answer:
          "Once a year for a ring worn every day. It takes a few minutes: the claws are checked under magnification for wear, the stones are tested for movement, and the shank is looked at for thinning. Nearly every lost stone we hear about was preventable at a check that never happened.",
      },
      {
        question: "Can you repair jewellery you did not make?",
        answer:
          "Yes, and most of what comes across the bench was made elsewhere. Bring the piece in rather than sending a photograph — what is wrong with a piece of jewellery and what it will take to put right are things you establish with it in front of you and a loupe on it.",
      },
      {
        question: "My white gold ring has gone yellow. Can it be fixed?",
        answer:
          "Yes, and nothing is actually wrong with it. The rhodium plating has worn through and you are seeing the gold alloy underneath, which every white gold ring does eventually. It is cleaned, polished and re-plated and comes back white. Expect to repeat it every year or few, or move to platinum, which is naturally white and never needs it.",
      },
      {
        question: "Can a stone be replaced if I lose one?",
        answer:
          "Usually. Small accent stones are matched and reset routinely. A lost centre stone is a larger conversation, because matching an existing setting means matching the size and often the cut and colour of what was there. Bring the ring and any certificate you have for the original stone — the certificate makes matching far easier.",
      },
    ],
  },

  {
    slug: "ring-remodelling",
    path: ROUTES.serviceRingRemodelling,
    name: "Remodelling",
    h1: "Remodelling Inherited Jewellery in Hatton Garden",
    title: "Remodelling & Resetting Inherited Jewellery",
    description:
      "Resetting an inherited stone into something you will wear, what can be reused and what genuinely cannot, and why old gold is usually worth more as credit than melted.",
    blurb:
      "Resetting an inherited stone into something worn rather than kept in a drawer — and an honest view of what is worth reusing.",
    intro:
      "Most inherited jewellery is not worn. It sits in a drawer because it is not to the owner's taste, or does not fit, or is too precious to risk — and a piece nobody wears is doing nothing for anybody. Remodelling takes what matters from it, usually the stones, and builds something that gets worn. The part worth being clear about before you start is that not everything in the old piece is worth carrying into the new one, and a jeweller who tells you otherwise is selling you sentiment.",
    steps: [
      {
        heading: "The assessment comes first",
        copy:
          "Before anything is agreed, the piece is looked at properly: what the stones are, what condition they are in, whether they will survive being unset, and what the metal actually is. Some pieces should not be remodelled at all — a period piece with real collector value is worth more intact than reset, and we will say so rather than take the commission.",
      },
      {
        heading: "The stones almost always carry over",
        copy:
          "Diamonds and most hard gemstones come out of an old setting and go into a new one without difficulty. Softer stones — opal, emerald, pearl, anything with existing fractures — carry real risk in unsetting, and that risk is worth stating out loud before the work starts rather than discovering afterwards. Old cuts are worth keeping as they are: an antique cushion or old European cut has a character a modern brilliant does not, and recutting it to modern proportions destroys exactly what makes it interesting.",
      },
      {
        heading: "The metal usually does not",
        copy:
          "This is the part people are surprised by. Melting down old gold sounds thrifty and it is usually the wrong call — mixed alloys of unknown composition produce porous, unpredictable metal that is a poor foundation for a piece meant to last. The better arrangement is almost always to have the old gold weighed and credited against the new commission, so its value goes into the ring without its metal going into the ring.",
      },
      {
        heading: "Designing the new piece",
        copy:
          "From there it is a normal commission: what you want, drawn and agreed before anything is cut. If a single inherited stone is going into a ring, the setting is designed around that stone's actual dimensions rather than a standard size, which is one of the reasons this work has to be done from the piece rather than from a photograph.",
      },
    ],
    limits: [
      {
        heading: "Sentimental value is not resale value, and both are real",
        copy:
          "A ring can be worth very little as metal and stones and be the most important object somebody owns. Those are different questions and it helps to keep them apart: what a piece is worth decides whether remodelling makes financial sense, and what it means decides whether that matters. Plenty of remodelling is worth doing on pieces that are worth almost nothing.",
      },
      {
        heading: "Some pieces are worth more left alone",
        copy:
          "Signed period jewellery, anything with a maker's mark that collectors follow, and unusual antique cuts in original settings can all be worth considerably more intact. If a piece looks like it might be one of those, it is worth having it looked at by somebody who values that market before a bench takes it apart. Remodelling is not reversible.",
      },
      {
        heading: "One stone, one piece",
        copy:
          "Splitting a piece between several family members sounds fair and often ends badly — the stones are rarely equivalent, and dividing a set destroys whatever the set was. It can be done, and it is worth thinking hard about first.",
      },
    ],
    faqs: [
      {
        question: "Can you reset a diamond from an inherited ring?",
        answer:
          "Yes, and it is a large part of what this bench does. A diamond comes out of an old setting and into a new one without difficulty in almost every case. Bring the ring in and we will tell you honestly what the stone is, what condition it is in, and whether resetting it is worth doing — before you commit to anything.",
      },
      {
        question: "Should I melt down old gold to make a new ring?",
        answer:
          "Usually not. Old gold of unknown alloy melts unpredictably and can leave porosity in the new piece, which is a poor foundation for something meant to last decades. The better route is nearly always to have the old gold weighed and credited against the commission — the value of the gold goes into the new ring even though the metal itself does not.",
      },
      {
        question: "Can an old-cut diamond be recut to look more modern?",
        answer:
          "It can, and we would usually advise against it. Recutting loses weight and, more importantly, loses the character that makes an old European or old mine cut worth having — the larger facets and softer fire that a modern brilliant does not produce. An old cut set into a modern setting keeps its character and looks contemporary anyway.",
      },
      {
        question: "What if the inherited piece is not worth remodelling?",
        answer:
          "We will tell you. Sometimes the stones are too damaged to reset safely, sometimes the piece is worth more intact than reworked, and sometimes the sensible answer is to leave it alone. An honest assessment before any work starts is worth more to you than a commission, and it costs nothing to have the conversation.",
      },
    ],
  },
];

export function serviceGuideBySlug(slug: string): ServiceGuide | undefined {
  return SERVICE_GUIDES.find((s) => s.slug === slug);
}
