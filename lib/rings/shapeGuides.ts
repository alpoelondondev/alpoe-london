import type { ShapeId } from "@/lib/ring/shapes";

/**
 * A page per diamond shape, at /rings/{slug}.
 *
 * ── Why these exist ──
 *
 * Every jeweller Alpoe competes with runs shape pages and Alpoe ran none. More
 * usefully, `{shape} engagement rings hatton garden` is a live Google
 * autocomplete pattern for round, oval, elongated cushion, emerald, pear,
 * radiant, marquise and princess — a local commercial query, per shape, that
 * nothing on this site addressed. The queries in each page's FAQ are harvested
 * from Google and Bing autocomplete and from competitors' own FAQ blocks, not
 * invented.
 *
 * ── The rule this file is written under ──
 *
 * Everything here is either sourced to GIA or marked as trade convention in
 * the copy itself. That constraint threw a lot away, and the discipline is the
 * point: a wrong gemmological claim on a jeweller's website is worse than a
 * missing one, because the people most likely to catch it are the people most
 * likely to buy.
 *
 * Three traps specifically, all of which competitor pages fall into:
 *
 * 1. **Facet counts.** GIA states plainly that most fancy shapes have no
 *    standard facet count — ovals, pears, marquises and hearts vary between
 *    cutters, and GIA's own lab data shows ovals running from eight to twelve
 *    bezels. So a number appears below only for round (57/58), Asscher (58)
 *    and radiant (70), which are the three GIA gives directly. Everywhere else
 *    the field is absent rather than guessed.
 *
 * 2. **Face-up size.** No GIA source quantifies how much larger an elongated
 *    stone looks, so no percentage appears anywhere here. Only the four
 *    qualitative comparisons GIA actually makes are stated: marquise and oval
 *    look larger than a round of the same weight, cushion and princess look
 *    smaller. Emerald, radiant, heart and Asscher get no size claim at all,
 *    because GIA makes none.
 *
 * 3. **Length-to-width ratios.** GIA contradicts itself on pear — 1.30–1.40 in
 *    one guide, 1.50–1.75 in two others — so ratios are given as a preferred
 *    range and a wider "actually cut" range rather than as one ideal number.
 *
 * The marquise's Madame de Pompadour story is written as legend, because GIA
 * calls it legend. The Cullinan stones are described as cut *by* the Asscher
 * brothers, which is true, rather than as Asscher-cut stones, which is not.
 * The heart has no history paragraph because no verifiable origin was found.
 */

export type ShapeGuide = {
  /** URL segment under /rings. The exact phrase people search. */
  slug: string;
  /** Ties the page to lib/ring/shapes.ts and to the builder deep link. */
  shape: ShapeId;
  /** "Oval", "Emerald cut" — as the trade writes it mid-sentence. */
  name: string;
  h1: string;
  title: string;
  description: string;
  /** Answer-first. What this shape is, and its one distinguishing quality. */
  intro: string;
  /** Brilliant, step or mixed — and what that does to the stone. */
  cutStyle: { label: string; copy: string };
  /** Only where GIA gives a number. Absent otherwise, deliberately. */
  facets?: string;
  ratio: { headline: string; copy: string };
  /** The 4Cs, for this shape specifically. */
  grading: { heading: string; copy: string }[];
  /** The thing to look at that is unique to this shape. */
  watchFor?: { heading: string; copy: string };
  /** Durability and the settings that answer it. */
  setting: string;
  /** Wedding band pairing. Written as our own workshop's view, not gemmology. */
  band: string;
  /** One sentence. Omitted where nothing could be verified. */
  history?: string;
  faqs: { question: string; answer: string }[];
};

const GIA_SHAPES =
  "https://4cs.gia.edu/en-us/blog/guide-diamond-shapes-engagement-rings/";

/** Cited on every page, in the Article's `citation` and in a visible list. */
export const SHAPE_SOURCES: { label: string; href: string }[] = [
  { label: "GIA — Guide to Diamond Shapes for Engagement Rings", href: GIA_SHAPES },
  {
    label: "GIA — Purchasing Fancy Shaped Diamonds",
    href: "https://4cs.gia.edu/en-us/blog/purchasing-fancy-shaped-diamonds-holiday-buying-guide/",
  },
  {
    label: "GIA Gems & Gemology — Fancy-Shaped Diamonds (Fall 2024)",
    href: "https://www.gia.edu/gems-gemology/fall-2024-fancy-shaped-diamonds",
  },
];

export const SHAPE_GUIDES: ShapeGuide[] = [
  {
    slug: "oval-engagement-rings",
    shape: "oval",
    name: "Oval",
    h1: "Oval Engagement Rings",
    title: "Oval Engagement Rings, Hatton Garden",
    description:
      "Oval engagement rings made to order in Hatton Garden. The ratio to ask for, what a bow tie is, and how to choose colour and clarity for an oval.",
    intro:
      "An oval is a brilliant cut stretched along one axis, and that single change does two things at once: it covers more of the finger than a round diamond of the same weight, and it lengthens the hand. It is the shape we are asked for most, and the one with the most to get right.",
    cutStyle: {
      label: "Brilliant cut",
      copy: "Faceted like a round brilliant — GIA describes ovals as typically carrying 57 or 58 facets, most commonly eight bezels on the crown against eight mains on the pavilion. The busy facet pattern is forgiving: it breaks light up finely enough to disguise small inclusions and a little warmth of colour.",
    },
    ratio: {
      headline: "1.30 to 1.50 for most people",
      copy: "GIA sets out the effect of each band: 1.20 to 1.29 reads shorter and rounder, close to a rounded cushion; 1.30 to 1.40 is a gentle elongation that suits most fingers; 1.41 to 1.50 is chosen for a slimming effect or a more dramatic stone. Beyond 1.50 is rare, because it is impractical to cut from the rough. In the lab GIA sees ovals cut anywhere from about 1.2 to 1.7 — so treat 1.30 to 1.50 as the range to ask for rather than a rule.",
    },
    grading: [
      {
        heading: "Colour matters more here",
        copy: "An elongated stone concentrates colour at the tips. GIA recommends staying within G to H so the diamond still reads as white to the eye.",
      },
      {
        heading: "Clarity is forgiving",
        copy: "The brilliant faceting hides a good deal, particularly near the edges and under facets. GIA points at VS2 or SI1 as the best balance of value and appearance.",
      },
      {
        heading: "No official cut grade",
        copy: "Round brilliants are the only shape GIA awards a cut grade. An oval's report carries polish and symmetry, and everything else is the cutter's judgement — which is why the stone in front of you matters more than the paper.",
      },
    ],
    watchFor: {
      heading: "The bow tie",
      copy: "A dark band across the middle of an elongated brilliant. GIA's explanation is unusually satisfying: the light it is blocking is you — your own head and shoulders, reflected back — so the closer your face gets, the more pronounced it looks. Some degree of it is always present, and a subtle one adds depth. Worth knowing that the trade has quietly designed it out: GIA's lab saw more than half of ovals cut with pavilion mains across the belly before 2014, and by 2023 nearly ninety per cent had none. Never accept a promise of a bow-tie-free oval; ask to see the stone tilted instead.",
    },
    setting:
      "Rounded edges rather than points make an oval one of the harder shapes to chip — GIA rates it less prone than a princess or a marquise. The caveat is a very thin girdle, which is worth checking. Four claws show the outline; six hold a longer stone flatter.",
    band:
      "Straightforward, with one design decision. A straight band meets the setting cleanly on most ovals, but a low-profile setting can leave a hairline gap where the curve of the stone passes over it. We make a shaped band where that happens, cut to the ring rather than ordered from a drawer.",
    history:
      "The modern oval brilliant was developed in 1957 by the diamond cutter Lazare Kaplan, with 58 facets.",
    faqs: [
      {
        question: "Do oval diamonds sparkle as much as round diamonds?",
        answer:
          "Close, but not identically. An oval is faceted in the brilliant style like a round, so it sparkles in the same way — what differs is that the elongation spreads the pattern out and introduces the bow tie. A well-cut oval is a very bright stone. A poorly cut one is dark through the middle, which is why this is a shape to see in person.",
      },
      {
        question: "Do oval diamonds look bigger than round diamonds?",
        answer:
          "Yes. GIA states that an oval's elongated shape gives it a larger surface area than a round diamond of the same carat weight, so it reads as a bigger stone face-up. Anyone quoting you a precise percentage is estimating — GIA does not publish one, and the real figure varies with how the individual stone is cut.",
      },
      {
        question: "What is the best ratio for an oval diamond?",
        answer:
          "Between 1.30 and 1.50 for most people. Below 1.30 the stone starts to read as round; above 1.50 is rare because it is hard to cut from the rough. Within that band it is genuinely preference: 1.30 to 1.40 is the classic gentle oval, 1.41 to 1.50 is longer and more dramatic on the finger.",
      },
      {
        question: "Do all oval diamonds have a bow tie?",
        answer:
          "Some degree of one, yes — GIA is explicit that it is always present to an extent, and that a subtle bow tie adds character rather than detracting. What you are avoiding is a heavy one. Modern cutting has reduced it substantially: nearly ninety per cent of ovals GIA saw in 2023 were cut without pavilion mains across the belly, the arrangement that causes the worst of it.",
      },
      {
        question: "Why are oval diamonds cheaper than round diamonds?",
        answer:
          "Because cutting an oval wastes less of the rough crystal. A round brilliant discards a great deal of the original stone to reach its shape; an elongated brilliant keeps more of it. You are paying for less wasted carat weight, not for a lesser diamond.",
      },
      {
        question: "How much does an oval engagement ring cost in the UK?",
        answer:
          "It depends almost entirely on the stone — carat weight first, then colour, clarity and how well it is cut, and whether it is natural or laboratory-grown. The setting is a much smaller part of the total than most people expect. Tell us a budget and we will show you what it buys in an oval rather than starting from a ring and working back.",
      },
    ],
  },

  {
    slug: "radiant-cut-engagement-rings",
    shape: "radiant",
    name: "Radiant cut",
    h1: "Radiant Cut Engagement Rings",
    title: "Radiant Cut Engagement Rings, London",
    description:
      "Radiant cut engagement rings made to order in Hatton Garden. What a mixed cut is, why it forgives colour and clarity, and how it differs from an emerald cut.",
    intro:
      "A radiant is the shape people reach for when they want the outline of an emerald cut and the fire of a brilliant. It is the only cut here that is genuinely both — step-cut facets on the crown, brilliant facets underneath — and that hybrid is why it behaves so differently from the square and rectangular stones it sits beside.",
    cutStyle: {
      label: "Mixed cut",
      copy: "Not simply a brilliant, which is where most descriptions of this shape go wrong. GIA describes the radiant as a mix of step-cut facets on the crown and brilliant-cut facets on the pavilion. The result is often called a crushed-ice look: light broken into many small flashes rather than the broad flat planes of an emerald cut.",
    },
    facets: "70 facets — one of the few shapes GIA gives a definite count for.",
    ratio: {
      headline: "Square around 1.00 to 1.05, rectangular around 1.10 to 1.30",
      copy: "GIA publishes no ratio for the radiant, and the trade does not agree on one either — published guides contradict each other, sometimes on the same page. So this is stated as what is commonly cut rather than as an ideal. A square radiant sits at 1.00 to 1.05; rectangular radiants generally run between 1.10 and 1.30, and the longer end lengthens the finger the way an emerald cut does.",
    },
    grading: [
      {
        heading: "The most forgiving of the rectangular shapes",
        copy: "GIA is direct about this: the radiant's facet pattern masks inclusions and warm colour, and is more forgiving than step cuts such as the emerald or Asscher. That makes it the shape where a lower clarity or colour grade goes furthest.",
      },
      {
        heading: "It can change how colour reads",
        copy: "GIA documents a stone graded W–X as a round being recut into a 4.61ct radiant and grading Fancy yellow. Cutters sometimes recut into a radiant specifically to improve face-up colour — a genuinely unusual property.",
      },
      {
        heading: "Value per carat",
        copy: "GIA notes radiants tend to cost less per carat than round brilliants while offering comparable sparkle.",
      },
    ],
    setting:
      "Cropped corners rather than points, which GIA notes help prevent chipping — a practical shape for wearing every day. Four claws sit naturally on the corners; a rubover suits a square radiant particularly well.",
    band:
      "One of the easiest. Straight edges and cropped corners mean a plain band sits flush against the setting with no gap to design around.",
    history:
      "Patented in the late 1970s by Henry Grossbard; others have cut the style since the patent lapsed.",
    faqs: [
      {
        question: "What is the difference between a radiant cut and an emerald cut?",
        answer:
          "They share an outline and almost nothing else. An emerald cut is a step cut — long parallel facets that give a hall-of-mirrors gleam and show every inclusion. A radiant is a mixed cut, with brilliant facets on the pavilion, so it sparkles in small bright flashes and hides inclusions and warm colour far better. If you love the shape but not the idea of paying for high clarity, the radiant is the answer.",
      },
      {
        question: "Are radiant cut diamonds cheaper than round diamonds?",
        answer:
          "Per carat, generally yes — GIA says radiants tend to cost less per carat than round brilliants while offering similar sparkle. Two reasons: the cut wastes less rough, and the facet pattern lets a lower colour and clarity grade look excellent, so the same budget reaches a larger or better-looking stone.",
      },
      {
        question: "Is a radiant cut the same as an elongated cushion?",
        answer:
          "No, though they can look alike at a glance and both are often described as crushed ice. The radiant has cropped, straight corners and step-cut facets on the crown. An elongated cushion has rounded corners and a softer outline throughout. Put them side by side and the corners tell you immediately.",
      },
      {
        question: "How many facets does a radiant cut diamond have?",
        answer:
          "70. It is one of only a handful of shapes with a settled count — GIA states it directly. Most fancy shapes have no standard number at all, which is why you should be sceptical of confident facet counts for ovals, pears and marquises.",
      },
      {
        question: "Are radiant cut diamonds sparkly?",
        answer:
          "Very. The brilliant-cut pavilion is what generates the sparkle, and GIA calls the radiant one of the most brilliant of the rectangular shapes. It is a different character of sparkle from a round — smaller, busier flashes rather than large flashes of white and colour.",
      },
    ],
  },

  {
    slug: "marquise-engagement-rings",
    shape: "marquise",
    name: "Marquise",
    h1: "Marquise Engagement Rings",
    title: "Marquise Engagement Rings, Hatton Garden",
    description:
      "Marquise engagement rings made to order in Hatton Garden. Why a marquise looks larger than any other shape, the ratio to ask for, and how to set the points safely.",
    intro:
      "If you want the largest-looking stone your budget will buy, this is it. GIA states plainly that a marquise looks larger face-up than a round diamond of the same weight — the strongest such claim it makes for any shape. It is also the shape most often written off as dated, which is exactly why it is worth looking at now.",
    cutStyle: {
      label: "Brilliant cut",
      copy: "Faceted for sparkle, in an outline the trade also calls a navette — old French for 'little ship'. Like most fancy shapes it has no standard facet count: GIA's lab sees marquises with six or eight bezels against four, six or eight pavilion mains, so anyone quoting you a single number is repeating a convention rather than a fact.",
    },
    ratio: {
      headline: "1.75 to 2.25, with 2:1 the classic",
      copy: "This is the one shape where GIA's sources agree. The classic marquise is about twice as long as it is wide; GIA's buying guide recommends 1.75 to 2.25, and stones submitted to its laboratory most commonly fall between 1.6 and 2.2. There is a practical limit: GIA warns that a marquise cut too long starts to affect its own durability.",
    },
    grading: [
      {
        heading: "Clarity hides well at the ends",
        copy: "GIA notes that marquise cuts conceal small inclusions quite well at either end — though the points themselves should be examined, since that is where damage starts.",
      },
      {
        heading: "Colour concentrates at the tips",
        copy: "Like the pear and the heart, a marquise holds more colour than a round brilliant. Aim higher up the scale than you would for a round.",
      },
      {
        heading: "Symmetry is everything",
        copy: "GIA names the faults to look for by name: flat wings, bulged wings, uneven wings and undefined points. On a shape this elongated, a small asymmetry is visible from across a room.",
      },
    ],
    watchFor: {
      heading: "The bow tie, and why you want a little of one",
      copy: "GIA's position on the marquise is more pointed than for any other shape: marquises typically show some degree of bow tie, and those without one usually lack brightness and tend to be dull. So the goal is not to eliminate it but to keep it from becoming distracting. It is worst in stones cut with very shallow or very deep pavilions.",
    },
    setting:
      "The points are the vulnerability. GIA is unambiguous that V-claws are essential, and notes that some cutters use French tips — replacing the large bezel facet at each end with modified star and upper girdle facets — specifically to increase durability. It also notes that slightly greater girdle thickness at the points is acceptable on a marquise, for the same reason.",
    band:
      "One of the two hardest to pair, along with the pear. The points reach past the setting, so a straight band leaves a visible gap at the tip. A shaped or open band solves it, and we cut those to the individual ring rather than fitting a standard curve.",
    history:
      "Developed in France in the 1740s. Legend — and GIA is careful to call it legend — has it that the shape was named for the Marquise de Pompadour, a favourite of Louis XV, because its outline resembled her mouth.",
    faqs: [
      {
        question: "Are marquise diamonds out of style?",
        answer:
          "They were, and they are not now. GIA records the marquise as a favourite of the Edwardians, popular again in 1970s bridal jewellery, then losing ground to the princess cut by the start of this century. That cycle is precisely why it feels distinctive again: it is a shape with real history that has not been worn to death in the last decade.",
      },
      {
        question: "Do marquise diamonds look bigger?",
        answer:
          "Yes, and more so than any other shape. GIA states outright that a marquise will look larger face-up than a round diamond of the same weight. If the face-up size of the stone is what matters most to you, this is the shape that delivers it.",
      },
      {
        question: "Do marquise diamonds break easily?",
        answer:
          "The points are the risk, not the stone. A diamond is the hardest natural material there is, but hardness is not toughness — a sharp point can chip against a hard knock. It is a solved problem: V-claws at each end, and on some stones French tips cut into the ends specifically to add durability. Set properly, a marquise is an everyday ring.",
      },
      {
        question: "What is the best ratio for a marquise diamond?",
        answer:
          "Between 1.75 and 2.25, with the classic marquise at about 2:1. Shorter than that and it loses the elongation that makes the shape; longer and GIA warns the durability of the stone itself starts to suffer.",
      },
      {
        question: "What wedding band goes with a marquise engagement ring?",
        answer:
          "Almost always a shaped one. The points of a marquise sit proud of the setting, so a straight band meets it at the widest part and leaves a gap at the tips. A band cut to follow the ring closes it, and a plain band worn slightly apart is a legitimate look in its own right. We make these to the individual ring, because the gap is different on every one.",
      },
    ],
  },

  {
    slug: "emerald-cut-engagement-rings",
    shape: "emerald",
    name: "Emerald cut",
    h1: "Emerald Cut Engagement Rings",
    title: "Emerald Cut Engagement Rings, London",
    description:
      "Emerald cut engagement rings made to order in Hatton Garden. Why a step cut gleams rather than sparkles, and the clarity grade this shape genuinely needs.",
    intro:
      "An emerald cut does not sparkle, and that is the point. Long parallel facets create what the trade calls a hall of mirrors — broad flashes of light and shadow rather than scintillation. It is the most architectural of the shapes and the least forgiving, because those same wide facets show you everything inside the stone.",
    cutStyle: {
      label: "Step cut",
      copy: "GIA describes step cuts as concentric trapezoidal facets producing an elegant gleam rather than brilliance. The facets are large and few, which is what creates the effect — and what makes colour and clarity so much more visible than in a brilliant cut.",
    },
    ratio: {
      headline: "Commonly 1.30 to 1.50, around 1.40 most often",
      copy: "GIA publishes no ratio for the emerald cut, so this is trade convention rather than gemmological law. Most emerald cuts are cut between 1.30 and 1.50, with 1.40 the most common. Longer stones lengthen the finger further; squarer ones start to approach the Asscher.",
    },
    grading: [
      {
        heading: "Clarity is not optional here",
        copy: "GIA is specific: the long rectangular facets make inclusions more easily visible than in other cuts, and it recommends VS2 clarity and G colour or better — with higher grades again for stones of two to three carats and above. This is the shape where paying for clarity is genuinely worth it.",
      },
      {
        heading: "Colour shows too",
        copy: "Because a step cut produces less scintillation than a brilliant, GIA notes the stone's body colour becomes more prominent. There is less sparkle to distract the eye from a warm tint.",
      },
      {
        heading: "Where the money goes",
        copy: "On an emerald cut, more of your budget should go into clarity and colour and less into carat weight than you would spend on a brilliant cut of the same size. A large emerald cut with visible inclusions is a worse ring than a smaller clean one.",
      },
    ],
    setting:
      "GIA notes that the smoothly bevelled corners both add visual appeal and give the claws a secure place to sit. Four claws on the corners is the classic. A rubover suits the geometry particularly well and protects the corners completely.",
    band:
      "The easiest of all. Straight edges mean a plain band sits flush against the setting with no gap, which is why emerald cuts pair so naturally with a plain flat band or a channel-set eternity ring.",
    history:
      "The name describes the cutting style, not the stone. It was developed for emeralds — a far more brittle material than diamond — to reduce pressure during cutting and stop the gem chipping.",
    faqs: [
      {
        question: "Why do emerald cut diamonds not sparkle?",
        answer:
          "Because they are cut to do something else. An emerald cut is a step cut: long parallel facets that reflect light in broad flashes rather than breaking it into small ones. GIA calls the effect a hall of mirrors and describes step cuts as having an elegant gleam rather than brilliance. It is not a defect in the stone — it is the entire design intention, and it is why the shape reads as restrained where a brilliant reads as showy.",
      },
      {
        question: "What clarity should I choose for an emerald cut diamond?",
        answer:
          "Higher than you would for a brilliant. GIA recommends VS2 and G colour or better for emerald cuts, and higher grades again above two to three carats — because the long open facets make inclusions much easier to see. On this shape, spending on clarity does visible work.",
      },
      {
        question: "Why is it called an emerald cut?",
        answer:
          "Because it was invented for emeralds. Emerald is far more brittle than diamond, and the step-cut design with its bevelled corners reduces the pressure on the stone during cutting and helps prevent chipping. It was later applied to diamonds, where the same geometry produces the hall-of-mirrors effect.",
      },
      {
        question: "Do emerald cut diamonds look bigger?",
        answer:
          "They lengthen the finger, which is a slightly different thing. GIA describes emerald cuts as creating the illusion of longer, more slender fingers, but it makes no claim that they face up larger than a round diamond of the same weight — so we will not make one either. What is true is that the flat open table gives the eye a lot of stone to look at.",
      },
      {
        question: "Is an emerald cut a good choice for an engagement ring?",
        answer:
          "It is, if you understand the trade. You are exchanging sparkle for clarity of form, and accepting that you need a cleaner, whiter stone to carry it off. People who choose an emerald cut almost never change their mind about it — it is a decisive shape rather than a compromise one.",
      },
    ],
  },

  {
    slug: "cushion-cut-engagement-rings",
    shape: "cushion",
    name: "Cushion cut",
    h1: "Cushion Cut Engagement Rings",
    title: "Cushion Cut Engagement Rings, London",
    description:
      "Cushion cut engagement rings made to order in Hatton Garden. Chunky versus crushed ice, elongated cushions, and why a cushion faces up smaller than you expect.",
    intro:
      "A cushion is a square or rectangle with its corners rounded off — the shape that sat on almost every Victorian ring before the round brilliant existed. Modern cushions split into two quite different families, and knowing which one you are looking at matters more than any other decision on this shape.",
    cutStyle: {
      label: "Brilliant, in two families",
      copy: "GIA distinguishes brilliant cushions, with larger facets and a softer sparkle that emphasises clarity, from modified cushions, whose extra facets maximise brilliance and produce what the trade calls a crushed-ice effect. Neither is better. GIA's own observer research found opinion widely split on crushed ice, with evidence of both personal and regional preference — so this is genuinely a matter of taste, and anyone telling you otherwise is selling their stock.",
    },
    ratio: {
      headline: "Square about 1.00 to 1.05, elongated about 1.10 to 1.30",
      copy: "GIA gives no ratio for cushions, so this is trade convention. Square cushions sit at 1.00 to 1.05. Elongated cushions — the ones now competing directly with the oval — are generally cut between 1.10 and 1.30, though they stretch to 1.60 and beyond.",
    },
    grading: [
      {
        heading: "Colour shows more than you would expect",
        copy: "Cushions show greater colour saturation than round brilliants and than many other shapes, so this is a shape to spend on colour grade rather than to economise on it.",
      },
      {
        heading: "It faces up smaller",
        copy: "The counter-intuitive one. GIA notes that a cushion's slightly deeper proportions can make it appear smaller than other shapes of the same carat weight — so you may want more carat than you would for an oval to reach the same visual size.",
      },
      {
        heading: "Expect a different sparkle",
        copy: "GIA puts it plainly: do not expect the sparkle of a round brilliant or a princess cut. A cushion has a different pattern of sparkle, and is no less beautiful for it.",
      },
    ],
    watchFor: {
      heading: "Chunky or crushed ice",
      copy: "Hold two cushions side by side and this is the difference you will see first. A chunky cushion returns light in large distinct flashes; a crushed-ice cushion breaks it into many small glittering points. GIA's research found buyers split on which they prefer, which makes this the single thing to decide in person rather than from a certificate — the grading report will not tell you which one you are getting.",
    },
    setting:
      "GIA notes that a cushion's girdle is typically thicker at the corners than between them, and that a very thin girdle there can be vulnerable to chipping — which is why it suggests considering a rubover rather than claws on some stones. Four claws on the corners is the usual answer, and a halo suits the soft outline.",
    band:
      "Rounded corners generally sit reasonably with a straight band, and an elongated cushion behaves much like an oval. We will show you both against the ring before deciding.",
    history:
      "The modern cushion descends from the old mine cut, which dates to the 1700s and was the most common diamond cut until the late nineteenth century — named for the Brazilian diamond mines.",
    faqs: [
      {
        question: "What is the difference between a chunky and a crushed ice cushion?",
        answer:
          "How the stone breaks up light. A chunky cushion has larger facets and returns light in big distinct flashes. A crushed-ice cushion is a modified cut with extra facets that scatter light into many small glittering points. GIA's own observer research found preferences genuinely split between the two, with regional differences — so there is no correct answer, only the one you prefer when you see them together.",
      },
      {
        question: "Do cushion cut diamonds look smaller?",
        answer:
          "Slightly, yes, and it surprises people. GIA notes that a cushion's deeper proportions can make it appear smaller than other shapes of the same carat weight. It is worth budgeting for a little more carat weight on a cushion than you would on an oval to reach the same face-up size.",
      },
      {
        question: "Are cushion cut and old mine cut diamonds the same?",
        answer:
          "Related, not identical. The modern cushion descends directly from the old mine cut, which was the dominant diamond cut from the 1700s until the late nineteenth century. Old mine cuts were cut by eye for candlelight — smaller tables, higher crowns, a large open culet. A modern cushion keeps the outline and is cut for electric light.",
      },
      {
        question: "What is an elongated cushion cut?",
        answer:
          "A cushion cut longer than it is wide, usually around 1.10 to 1.30. It is the shape currently competing hardest with the oval: it has the soft rounded corners of a cushion with much of the finger-lengthening effect of an oval, and it tends to be easier to find than a comparable oval.",
      },
      {
        question: "Why are cushion cut diamonds cheaper than round diamonds?",
        answer:
          "Less of the rough is thrown away. A round brilliant discards a great deal of the original crystal to reach a circle; a cushion keeps far more of it, so the same rough yields a heavier finished stone. That is a difference in cutting economics, not in the quality of the diamond.",
      },
    ],
  },

  {
    slug: "pear-shaped-engagement-rings",
    shape: "pear",
    name: "Pear",
    h1: "Pear Shaped Engagement Rings",
    title: "Pear Shaped Engagement Rings, London",
    description:
      "Pear shaped engagement rings made to order in Hatton Garden. Which way to wear one, what a bow tie is, and how to protect the point.",
    intro:
      "A pear is half brilliant, half marquise — round at one end, pointed at the other — and it is the shape that most rewards a good cutter. Get the symmetry right and it is the most elegant thing on the tray. Get it wrong and the eye catches on it immediately.",
    cutStyle: {
      label: "Brilliant cut",
      copy: "Faceted for maximum sparkle, like a round brilliant. The trade has names for every part of it — point, wings, shoulders, belly, keel line — and those names exist because each is somewhere the cutting can go wrong.",
    },
    ratio: {
      headline: "Preferred 1.50 to 1.75, cut in practice from about 1.30 to 1.80",
      copy: "GIA is not internally consistent on the pear, and it is worth being honest about that: two GIA guides put the preferred range at 1.50 to 1.75, while its newest shapes guide says most fall between 1.30 and 1.40, and its research paper reports pears usually cut between 1.3 and 1.8. Take 1.50 to 1.75 as the classic proportion and the wider band as what actually exists — then choose by eye.",
    },
    grading: [
      {
        heading: "Check the point",
        copy: "GIA advises examining the point specifically, both for inclusions and for concentration of colour. It is the most sensitive part of the stone in both senses.",
      },
      {
        heading: "Colour concentrates at the tip",
        copy: "Like the marquise and the heart, a pear holds more colour than a round brilliant, so GIA recommends choosing high on the colour scale — or going the other way entirely and choosing a fancy colour.",
      },
      {
        heading: "Symmetry faults to name",
        copy: "GIA lists them: high shoulders, flat wings, bulged wings, undefined points, an off-centre culet, an off-centre table. Ask to see the stone face-up and unmounted.",
      },
    ],
    watchFor: {
      heading: "The bow tie",
      copy: "As with the oval and the marquise, a dark band across the width. GIA's mechanism is specific: the bow tie darkens as the difference between length and width grows and as pavilion angle variations become more extreme. So a longer pear tends to show more of one — which means the honest answer to 'which ratio has no bow tie' is that none is guaranteed to, and you judge it with the stone in your hand.",
    },
    setting:
      "The point is the vulnerability. GIA's answer is a V-claw on the point or a rubover around the whole stone, and it notes that French tips — modified star and upper girdle facets in place of a large bezel facet — are used on pears for exactly this reason.",
    band:
      "Along with the marquise, the hardest to pair. The point sits proud of the setting and a straight band leaves a gap beneath it. A shaped band cut to the ring is the usual answer; some people prefer to wear a plain band spaced slightly apart and let the gap be deliberate.",
    history:
      "The pear outline goes back to the 1400s, with the brilliant faceting style added in the 1700s.",
    faqs: [
      {
        question: "Which way do you wear a pear shaped engagement ring?",
        answer:
          "Point outwards, away from you, toward the fingertips. That is the traditional orientation and the one the trade generally recommends, because it draws the eye down the finger and makes the hand look more slender. There is no rule against wearing it the other way — some people prefer the point toward the wrist — but if you are asking, point out is the answer.",
      },
      {
        question: "Do all pear shaped diamonds have a bow tie?",
        answer:
          "Most show one to some degree, and a slight one is normal in any elongated brilliant. GIA explains that the effect gets darker as the difference between the stone's length and width increases and as the pavilion angles vary more — so longer pears tend to show more. No ratio guarantees you a pear without one; look at the stone tilted under a light instead.",
      },
      {
        question: "What is the best ratio for a pear shaped diamond?",
        answer:
          "GIA's own guides disagree, which is worth knowing. Two of them put the preferred range at 1.50 to 1.75; the newest says most pears fall between 1.30 and 1.40. Its research finds pears cut anywhere from about 1.3 to 1.8. Treat 1.50 to 1.75 as the classic and judge the rest by eye — a shorter pear is rounder and softer, a longer one more dramatic.",
      },
      {
        question: "Is a pear shaped diamond the same as a teardrop?",
        answer:
          "Yes. Teardrop is the everyday name for the same shape; pear is what the trade and every grading report call it. If you have been searching for a teardrop engagement ring, this is the page you wanted.",
      },
      {
        question: "What wedding band goes with a pear shaped engagement ring?",
        answer:
          "Usually a shaped one. The point reaches past the setting, so a straight band leaves a visible gap underneath it. We cut a band to follow the individual ring, which closes it completely. The alternative — a plain band worn with a deliberate gap — is a perfectly good look and costs less.",
      },
    ],
  },

  {
    slug: "princess-cut-engagement-rings",
    shape: "princess",
    name: "Princess cut",
    h1: "Princess Cut Engagement Rings",
    title: "Princess Cut Engagement Rings, London",
    description:
      "Princess cut engagement rings made to order in Hatton Garden. Whether the shape is dated, why it hides inclusions, and how to set the corners safely.",
    intro:
      "A princess cut is a square brilliant — sharp corners, a deep pavilion, and a great deal of sparkle for the money. GIA's reports describe it as a square modified brilliant, which distinguishes it from square step cuts like the Asscher. It went out of fashion, and it is quietly coming back.",
    cutStyle: {
      label: "Square modified brilliant",
      copy: "Faceted for sparkle rather than for the flat planes of a step cut. GIA is explicit that the number of facets and the arrangement on both crown and pavilion vary widely between cutters, which produces a real range of scintillation between one princess cut and the next — and is why no honest facet count appears here.",
    },
    ratio: {
      headline: "1.00 to 1.05 for a square stone",
      copy: "GIA sets a square princess cut at a length-to-width ratio not exceeding 1.05. Above that the stone starts to read as rectangular, which some people want and most do not.",
    },
    grading: [
      {
        heading: "Clarity is genuinely forgiving",
        copy: "One of the most useful facts about this shape: GIA notes the sharp pointed corners are good at hiding inclusions, so you can take a somewhat lower clarity grade — particularly if the inclusions sit in the corners — and put the money elsewhere.",
      },
      {
        heading: "It faces up smaller",
        copy: "GIA describes a princess cut as being like an upside-down pyramid with much of its weight in the pavilion, so the face-up size can appear smaller than another shape of similar carat weight. It also notes it may look slightly smaller than an Asscher.",
      },
      {
        heading: "Better value per carat",
        copy: "GIA notes princess cuts are more affordable per carat than round brilliants because they preserve more of the original rough crystal.",
      },
    ],
    watchFor: {
      heading: "Pavilion bulge",
      copy: "GIA names this one specifically: if the pavilion slope is too steep it creates a bulge, which makes the stone look dark and adds weight you are paying for without seeing. Worth asking about on any princess cut.",
    },
    setting:
      "Two separate risks, both solved the same way. The corners need protecting — GIA recommends V-claws, or a rubover for maximum protection. Less well known is the second: a princess cut usually has no culet facet, which leaves the pavilion point susceptible to chipping. A setting that covers both is not optional on this shape.",
    band:
      "Straightforward. Square, straight-edged, and a plain band sits flush. Princess cuts also pair naturally with channel-set bands, where the square stones echo the centre.",
    history: "Created in 1981 by Betzalel Ambar and Israel Itskowitz.",
    faqs: [
      {
        question: "Are princess cut diamonds out of style?",
        answer:
          "They fell out of favour, and they are coming back. The princess cut dominated the 2000s so thoroughly that it came to date a ring, and buyers moved to ovals and cushions. That is exactly the cycle that makes a shape interesting again — and the underlying value argument never changed: it is more affordable per carat than a round brilliant and it hides inclusions well. If you like it, the fact that fewer people are buying it is an argument in its favour rather than against.",
      },
      {
        question: "Are princess cut diamonds cheaper than round diamonds?",
        answer:
          "Per carat, yes. GIA's explanation is that a princess cut preserves more of the original rough crystal than a round brilliant, which discards a great deal of it. Add the fact that you can take a slightly lower clarity grade — the sharp corners hide inclusions well — and the same budget goes noticeably further.",
      },
      {
        question: "Do princess cut diamonds look smaller?",
        answer:
          "A little, yes. GIA describes the shape as an upside-down pyramid with much of its weight in the pavilion, so more of the carat weight is below the girdle where you cannot see it. Its face-up size can appear smaller than another shape of similar weight, and slightly smaller than an Asscher.",
      },
      {
        question: "Do princess cut diamonds chip easily?",
        answer:
          "The corners are the risk, and there is a second one people rarely mention. Sharp corners can chip against a hard knock, which is why GIA recommends V-claws or a rubover. Less known: a princess cut usually has no culet facet, leaving the pavilion point vulnerable too. Both are entirely solved by setting it properly — which we would do regardless.",
      },
      {
        question: "What is the difference between a princess cut and a brilliant cut?",
        answer:
          "A princess cut is a brilliant cut. 'Brilliant' describes the faceting style — many small kite and triangular facets cut for sparkle — not a shape. GIA's grading reports call the princess a square modified brilliant. What people usually mean by 'brilliant cut' is the round brilliant, which is the circular version of the same idea.",
      },
    ],
  },

  {
    slug: "round-brilliant-engagement-rings",
    shape: "round",
    name: "Round brilliant",
    h1: "Round Brilliant Engagement Rings",
    title: "Round Brilliant Engagement Rings, London",
    description:
      "Round brilliant engagement rings made to order in Hatton Garden. The only shape GIA awards a cut grade, why it forgives colour and clarity, and what you pay for.",
    intro:
      "The round brilliant is the most sparkling diamond shape there is, and it is the only one GIA awards an actual cut grade. That single fact is why it is both the safest shape to buy and the most expensive per carat: you can verify how well it was cut, and cutting it wastes more of the rough than any other shape.",
    cutStyle: {
      label: "Brilliant cut",
      copy: "GIA describes brilliant cuts as characterised by numerous small kite-shaped and triangular facets — a busier pattern with smaller facets, which helps mask inclusions and colour and makes them more forgiving of imperfection than step cuts.",
    },
    facets:
      "57 or 58 facets — 58 with a culet facet, 57 with a pointed culet. Eight bezels, eight stars and sixteen upper halves on the crown; sixteen lower halves, eight mains and an optional culet below.",
    ratio: {
      headline: "Not applicable",
      copy: "A round brilliant is circular, so there is no length-to-width ratio to choose. What replaces it is the cut grade — and it is the only shape that has one.",
    },
    grading: [
      {
        heading: "The only shape with a GIA cut grade",
        copy: "Excellent through to Poor, awarded by GIA to round brilliants alone. Every fancy shape on a report carries polish and symmetry only. This is the most under-explained fact in diamond buying and it is the main reason a round is the safest shape to buy at distance.",
      },
      {
        heading: "Forgiving of colour and clarity",
        copy: "GIA notes the round brilliant's large number of facets and brilliance can hide some inclusions and yellow or brown colour, more so than step cuts. It is the baseline every other shape is compared against.",
      },
      {
        heading: "The most expensive per carat",
        copy: "For a straightforward reason: reaching a circle throws away more of the original rough crystal than any other outline. You are paying for what was cut away.",
      },
    ],
    setting:
      "The most forgiving shape to set — no points, no corners. GIA does note protecting the pointed tip at the bottom of the stone with the setting, or choosing a stone with a culet facet, which helps prevent chipping. Four claws show the most stone; six hold it most securely.",
    band:
      "The easiest of all, and the benchmark for the others. A straight band sits flush against almost any round setting.",
    history:
      "The angles behind the modern round brilliant were first proposed by Henry Morse of Boston in the 1860s and refined by Marcel Tolkowsky in 1919. GIA introduced a scientific system for assessing round brilliant cut quality in 2005.",
    faqs: [
      {
        question: "Why are round diamonds more expensive than other shapes?",
        answer:
          "Because cutting one wastes the most rough. Reaching a circle from an octahedral crystal discards far more of the original stone than reaching an oval, a cushion or a princess cut — so a one carat round costs more than a one carat fancy shape of the same grades. You are paying for the material that ended up as dust.",
      },
      {
        question: "Are round diamonds out of style?",
        answer:
          "No, and they are the one shape that never really goes out. Roughly speaking, fashions move around the round brilliant rather than replacing it — ovals, cushions and now elongated cushions rise and fall, while the round stays the default. If you want a ring that will not date, this is it.",
      },
      {
        question: "Do round diamonds have bow ties?",
        answer:
          "No. A bow tie is a feature of elongated brilliant cuts — ovals, pears and marquises — where the stone's length blocks light across its middle. A round brilliant is symmetrical in every direction, so there is nothing for the effect to form in. A round can look dark if it is badly cut, but that is a cut problem, not a bow tie.",
      },
      {
        question: "Which diamond shape sparkles the most?",
        answer:
          "The round brilliant, and it is not particularly close. Its 57 or 58 facets are arranged specifically to return the maximum amount of light to the eye, and it is the only shape whose cut quality GIA grades — so you can actually verify that a given stone achieves it. Fancy shapes sparkle differently and sometimes very beautifully, but none is engineered for it as precisely.",
      },
      {
        question: "How many facets does a round brilliant diamond have?",
        answer:
          "57 or 58 — 58 when there is a culet facet at the bottom point, 57 when the culet comes to a point instead. That breaks down as eight bezels, eight stars and sixteen upper halves on the crown, and sixteen lower halves plus eight mains below. It is one of the few shapes with a genuinely fixed count; most fancy shapes vary between cutters.",
      },
    ],
  },

  {
    slug: "asscher-cut-engagement-rings",
    shape: "asscher",
    name: "Asscher cut",
    h1: "Asscher Cut Engagement Rings",
    title: "Asscher Cut Engagement Rings, London",
    description:
      "Asscher cut engagement rings made to order in Hatton Garden. The 1902 original, how it differs from a square emerald cut, and the clarity it needs.",
    intro:
      "An Asscher is a square step cut with a high crown and a small table, and it produces the deepest hall-of-mirrors effect of any shape. Look into one face-up and you will often see a distinct X pattern in the facets. It is the most Art Deco thing you can put on a hand.",
    cutStyle: {
      label: "Step cut",
      copy: "Square, with step-cut facets in three rows on the crown and three below — GIA describes the stone as nearly octagonal, with facets that are larger and more widely set than a brilliant's. The same geometry as an emerald cut, compacted into a square.",
    },
    facets: "58 facets — one of the few shapes GIA gives a definite count for.",
    ratio: {
      headline: "1.00, and up to about 1.05",
      copy: "GIA describes the Asscher as square rather than rectangular but gives no figure. Trade convention puts the ideal at 1.00, with no visible difference up to about 1.05; beyond that the outline starts to read as rectangular.",
    },
    grading: [
      {
        heading: "Clarity and colour both matter",
        copy: "GIA is specific: the large open facets show inclusions and body colour more readily than brilliant cuts, and it recommends VS2 clarity and G colour or better — particularly above two to three carats. Budget for the stone rather than the size.",
      },
      {
        heading: "The X pattern",
        copy: "Many Asschers show a distinctive X when viewed face-up. It is a feature of the facet arrangement rather than a flaw, and it is one of the pleasures of the shape.",
      },
      {
        heading: "It faces up larger than a princess",
        copy: "GIA notes princess cuts may appear slightly smaller than other square shapes such as Asschers, because of their deep pavilions. GIA makes no comparison to a round, so neither will we.",
      },
    ],
    watchFor: {
      heading: "Asscher or Royal Asscher",
      copy: "Two different stones with similar names. The original Asscher has 58 facets. The Royal Asscher adds two more rows of eight facets to the pavilion — 74 in total — and is protected by an international patent, so only the Royal Asscher Company may cut one. If a seller uses the two names interchangeably, they are either careless or hoping you are.",
    },
    setting:
      "Bevelled corners give the claws a secure seat, as on an emerald cut. GIA notes that for larger stones — three carats and above — double claws are often used at the corners: each is finer than a single claw, but together they hold the stone even if one fails.",
    band:
      "Easy. Square and straight-edged, so a plain band sits flush. Asschers also take a channel-set or baguette band particularly well, since the geometry matches.",
    history:
      "First developed in 1902 by Joseph Asscher, who saw a way to use rough crystals better and retain more weight. It became a signature of Art Deco, and was redesigned and revived around 2002. The Asscher brothers also cut the Cullinan I and Cullinan II from the 3,105 carat Cullinan rough — though those stones are a pear and a cushion, not Asscher cuts.",
    faqs: [
      {
        question: "What is the difference between an Asscher and an emerald cut?",
        answer:
          "The outline, mostly. Both are step cuts with the same hall-of-mirrors character and the same bevelled corners. An emerald cut is rectangular; an Asscher is square, with a higher crown and a smaller table, which deepens the effect and often produces a visible X pattern face-up. A square emerald cut and an Asscher are very close relatives and are frequently confused — the Asscher's higher crown is the tell.",
      },
      {
        question: "What is the difference between an Asscher and a Royal Asscher?",
        answer:
          "Sixteen facets and a patent. The original Asscher cut has 58 facets. The Royal Asscher, redesigned by Edward Asscher, adds two further rows of eight facets to the pavilion for 74 in total, and is protected by an international patent — only the Royal Asscher Company is permitted to cut one. They are not interchangeable terms.",
      },
      {
        question: "Do Asscher cut diamonds sparkle?",
        answer:
          "Not in the way a brilliant does, and that is deliberate. A step cut returns light in broad flashes from large flat facets rather than scattering it — the hall of mirrors rather than scintillation. What an Asscher gives you instead is depth and geometry. If sparkle is what you want, this is the wrong shape and there is no setting that will fix that.",
      },
      {
        question: "Why are Asscher cut diamonds more expensive?",
        answer:
          "Usually because of the stone rather than the cut. Those large open facets show inclusions and colour, so an Asscher needs a higher clarity and colour grade to look right — GIA recommends VS2 and G or better. You are paying for a cleaner, whiter diamond than the same money would buy in a brilliant cut, which is a real cost rather than a premium on the shape.",
      },
      {
        question: "Are Asscher cut diamonds rare?",
        answer:
          "Less common than the mainstream shapes, certainly. It is a shape that asks something of the buyer — a cleaner stone, and a taste for geometry over sparkle — so fewer are cut. Practically, that means fewer to choose from and a slightly longer search to find a good one, which is the sort of thing a bespoke workshop is for.",
      },
    ],
  },

  {
    slug: "heart-shaped-engagement-rings",
    shape: "heart",
    name: "Heart",
    h1: "Heart Shaped Engagement Rings",
    title: "Heart Shaped Engagement Rings, London",
    description:
      "Heart shaped engagement rings made to order in Hatton Garden. Why the shape needs half a carat to work, what to check in the cleft, and how to set the point.",
    intro:
      "A heart is the most demanding shape to cut and the least forgiving to buy badly, and it comes with a floor: GIA advises that it works best at half a carat and above, because below that the outline stops reading as a heart at all. Chosen well it is unmistakable. Chosen carelessly it is the shape people mean when they say a ring looks cheap.",
    cutStyle: {
      label: "Brilliant cut",
      copy: "A heart brilliant, faceted for sparkle. Like most fancy shapes it has no standard facet count — established jewellers put it at roughly 56 to 58 with the number of main pavilion facets varying between six, seven and eight, and GIA gives no figure at all.",
    },
    ratio: {
      headline: "1.00, or up to about 1.20",
      copy: "GIA gives 1:1 to 1:1.2 in its heart guide and approximately 1.00 in its fancy shape buying guide, noting that most hearts sold in the United States are 1:1 while some cultures prefer elongated ones. It also notes it is not unusual for a heart to be wider than it is long.",
    },
    grading: [
      {
        heading: "Half a carat is the floor",
        copy: "Three separate GIA sources agree: the shape works best at 0.50ct and above, and below that it can be difficult to perceive the heart at all. This is the one shape where going smaller does not simply mean a smaller version of the same thing.",
      },
      {
        heading: "Clarity shows",
        copy: "GIA notes clarity characteristics are easier to spot in heart shapes, and warns against eye-visible inclusions — which can affect durability and value as well as looks. Check the point in particular.",
      },
      {
        heading: "Colour concentrates",
        copy: "Grouped by GIA with the pear and marquise as shapes that hold more colour than a round brilliant. Aim higher up the scale.",
      },
    ],
    watchFor: {
      heading: "The cleft and the lobes",
      copy: "The vocabulary is worth having: the lobes are the two rounded upper curves, the cleft is the V-shaped notch between them. GIA names the faults by name — pointed lobes, very flat wings that leave an outline more like an arrowhead, high shoulders, an undefined point. A heart lives or dies on symmetry, and it is the shape where a photograph tells you least.",
    },
    setting:
      "Shield the point, which is the most vulnerable part. GIA recommends claws set on the lobes rather than in the cleft, so the shape reads clearly, and a rubover or three-claw setting for smaller stones. It also notes that a halo takes a larger heart to carry off.",
    band:
      "Not the easiest. Both the cleft and the point interrupt the line a straight band wants to follow, so we will usually shape one to the ring. Worth seeing both against the finished setting before deciding.",
    faqs: [
      {
        question: "Are heart shaped diamonds tacky?",
        answer:
          "A badly cut one, at a small size, in a cheap setting — yes, and that is where the reputation comes from. The shape has a floor that no other shape has: GIA advises half a carat and above, because below that the outline stops reading as a heart. Above that size, cut with proper symmetry between the lobes and a clean cleft, it is a genuinely beautiful and unusual stone. The shape is not the problem; the execution usually is.",
      },
      {
        question: "Are heart shaped diamonds rare?",
        answer:
          "Relatively uncommon in engagement rings, yes — GIA says so directly. They also tend to cost less per carat than round brilliants, but because fewer are cut, high-quality examples are harder to find. In practice that means the search takes longer rather than the stone costing more.",
      },
      {
        question: "How big does a heart shaped diamond need to be?",
        answer:
          "Half a carat is the practical minimum. GIA states across three separate guides that the shape works best at 0.50ct and above, and that below that it can be difficult to perceive the heart at all. If the budget will not reach half a carat in a heart, another shape will serve you better at that size.",
      },
      {
        question: "How do you wear a heart shaped engagement ring?",
        answer:
          "Point toward the fingertips, the same orientation as a pear, so the shape reads the right way up to somebody looking at your hand. Worn the other way it reads upside down to everyone except you — which some people prefer, and there is no rule about it.",
      },
      {
        question: "Do heart shaped diamonds sparkle?",
        answer:
          "Yes — it is a brilliant cut, faceted the same way a round is. Like the oval, pear and marquise it can show a bow tie across the middle, and like all of them the answer is to look at the stone tilted under a light rather than at the certificate.",
      },
    ],
  },
];

export function shapeGuideBySlug(slug: string): ShapeGuide | undefined {
  return SHAPE_GUIDES.find((g) => g.slug === slug);
}
