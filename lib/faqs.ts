export type FaqItem = { question: string; answer: string };

const FAQS = {
  prices: {
    question: "Why don't you display prices online?",
    answer:
      "Every piece we offer is unique, and market values for luxury watches, diamonds and gold move daily. Instead of fixed price tags we prepare a personalised quote, so you always receive the sharpest possible price. Send us an enquiry and we'll come back to you quickly.",
  },
  sourcing: {
    question: "Can you source a specific luxury watch for me?",
    answer:
      "Yes. Through our global network of trusted dealers we can track down virtually any reference — from a Rolex Daytona or Patek Philippe Nautilus to a Richard Mille — at competitive prices, frequently below retail.",
  },
  bespoke: {
    question: "How does a bespoke engagement ring come together?",
    answer:
      "Tell us your preferred diamond shape, setting style, metal and carat, and our Hatton Garden workshop handcrafts the ring around you. Lead times are confirmed when you enquire, and you're consulted at every stage of the build.",
  },
  certification: {
    question: "Are your diamonds certified?",
    answer:
      "Yes — we work exclusively with GIA-certified diamonds, so quality, authenticity and value are guaranteed. Full certification paperwork accompanies every stone.",
  },
  tradeIn: {
    question: "Will you buy or part-exchange my watch?",
    answer:
      "Yes. We purchase pre-owned luxury watches and offer strong trade-in valuations. Share the details of your timepiece and we'll give you a no-obligation quote.",
  },
  leadTime: {
    question: "How long does a bespoke piece take?",
    answer:
      "Most bespoke commissions take three to six weeks from approved design to finished piece, depending on the stones and the complexity of the setting. Rush timelines can often be arranged for an occasion date — tell us the deadline when you enquire.",
  },
  labGrown: {
    question: "Do you work with lab-grown as well as natural diamonds?",
    answer:
      "Both. Lab-grown diamonds are chemically and optically identical to natural stones and typically let you go significantly larger for the same budget. Natural diamonds hold their rarity and resale position. We will show you the same design in both so you can compare in person.",
  },
  designProcess: {
    question: "What happens after I send my enquiry?",
    answer:
      "A specialist comes back to you on WhatsApp, usually the same day. We talk through the occasion, the wearer, stone preference and budget, then produce a CAD design for your approval before anything is cut or set.",
  },
  valuation: {
    question: "How do you value a watch you are buying?",
    answer:
      "Valuation is based on reference, condition, year, and whether you still have the box and papers, checked against live market data. Send photos and the reference number and we will give you a no-obligation figure, usually within the hour.",
  },
  payment: {
    question: "How quickly do I get paid?",
    answer:
      "Once we have inspected and authenticated the piece, payment is made same day by bank transfer. You are welcome to wait with us in the showroom while the checks are carried out.",
  },
  shipping: {
    question: "Do you ship outside the UK?",
    answer:
      "Yes. We ship worldwide, fully insured and tracked, with all certification and paperwork included. Customs documentation is handled for you.",
  },
  showroom: {
    question: "Can I visit you in person?",
    answer:
      "Of course. Visit us in Hatton Garden, London — walk-ins are welcome, or book a private, no-pressure consultation with one of our specialists.",
  },
  mentorshipWhat: {
    question: "What is the Alpoe Mentorship?",
    answer:
      "A private group led by our Hatton Garden team for people who want to trade watches and jewellery as a business. It covers how the trade actually works day to day — where stock comes from, how margin is made, how to price, and how to build a name buyers trust.",
  },
  mentorshipWho: {
    question: "Who is it for?",
    answer:
      "People starting out with no trade contacts, resellers who already flip a few pieces and want to do it properly, and anyone building a jewellery brand who keeps getting stuck on sourcing and pricing. You do not need a shop, a licence or existing stock to join.",
  },
  mentorshipFormat: {
    question: "How is it run?",
    answer:
      "Everything happens inside a private Telegram group. You get written breakdowns, market notes as prices move, and a chat where you can put a specific deal or piece in front of us before you commit to it. Nothing is pre-recorded and left to go stale.",
  },
  mentorshipBench: {
    question: "Does it teach me to make jewellery at the bench?",
    answer:
      "No — this is the business side, not a hands-on setting or goldsmithing course. We cover sourcing, valuation, negotiation, margin, marketing and reputation. If you want bench training we are happy to point you towards the workshops that do it well.",
  },
  mentorshipCost: {
    question: "What does it cost to join?",
    answer:
      "Membership runs on a monthly basis and we go through the current terms with you directly before you join, so you know exactly what you are getting first. Message us and we will send the details over.",
  },
  mentorshipCommit: {
    question: "Am I tied into a contract?",
    answer:
      "No. It runs month to month and you can step away whenever you like. We would rather people stayed because the room is worth being in.",
  },
  mentorshipJoin: {
    question: "How do I join?",
    answer:
      "Send us a message telling us where you are up to — starting from scratch, already reselling, or building a brand. We check the room is right for you, then send the invite to the private group.",
  },
  labSimulants: {
    question: "Is a lab diamond the same as moissanite or cubic zirconia?",
    answer:
      "No. Moissanite and cubic zirconia are simulants. They are different materials that are made to look like diamond. A lab diamond is diamond. Simulants give themselves away on sparkle: cubic zirconia goes dull and can yellow with age, and moissanite throws rainbow flashes and looks hazy at larger sizes.",
  },
  labCertification: {
    question: "Are lab diamonds certified?",
    answer:
      "Yes, and you should not buy one that is not. Look for GIA or IGI. Both laser inscribe a number on the girdle that matches the certificate, readable at 50x magnification, and IGI marks lab stones as lab grown alongside it.",
  },
  labResale: {
    question: "Will a lab diamond hold its value?",
    answer:
      "Nobody knows yet. Lab stones are too new for a resale track record. Natural diamonds hold their position better because supply is finite. Worth saying plainly: any diamond, lab or natural, resells for less than you paid.",
  },
  labEthics: {
    question: "Are lab diamonds more ethical?",
    answer:
      "They remove the conflict stone question, but it depends on the producer. Some labs run on renewable energy and some do not. Natural mining uses far more land, though a well run mine supports the community around it. We will tell you where a stone came from before you buy it.",
  },
  labCarat: {
    question: "How much bigger can I go with a lab diamond?",
    answer:
      "Roughly two to three times the carat weight for the same money, at the same cut, colour and clarity grades. That is the main reason people choose lab, and it is why a budget that buys a 1ct natural will often buy a 2.5ct lab.",
  },
  labSeeBoth: {
    question: "Can I see the two side by side?",
    answer:
      "Yes, and we would rather you did. Come to the Hatton Garden counter and we will put the same design in front of you with a lab stone and a natural stone in it. Most people decide in about a minute once they are looking at both.",
  },
} satisfies Record<string, FaqItem>;

export const DIAMOND_FAQS: FaqItem[] = [
  FAQS.labCarat,
  FAQS.labCertification,
  FAQS.labResale,
  FAQS.labEthics,
  FAQS.labSimulants,
  FAQS.labSeeBoth,
];

export const HOME_FAQS: FaqItem[] = [
  FAQS.prices,
  FAQS.sourcing,
  FAQS.bespoke,
  FAQS.certification,
  FAQS.tradeIn,
  FAQS.showroom,
];

export const WATCH_FAQS: FaqItem[] = [
  FAQS.sourcing,
  FAQS.prices,
  FAQS.tradeIn,
  FAQS.showroom,
];

export const JEWELLERY_FAQS: FaqItem[] = [
  FAQS.bespoke,
  FAQS.certification,
  FAQS.prices,
  FAQS.showroom,
];

export const BESPOKE_FAQS: FaqItem[] = [
  FAQS.bespoke,
  FAQS.designProcess,
  FAQS.leadTime,
  FAQS.labGrown,
  FAQS.certification,
  FAQS.prices,
  FAQS.showroom,
];

export const SELL_FAQS: FaqItem[] = [
  FAQS.tradeIn,
  FAQS.valuation,
  FAQS.payment,
  FAQS.showroom,
  FAQS.prices,
];

export const ABOUT_FAQS: FaqItem[] = [
  FAQS.showroom,
  FAQS.sourcing,
  FAQS.certification,
  FAQS.shipping,
  FAQS.prices,
];

export const MENTORSHIP_FAQS: FaqItem[] = [
  FAQS.mentorshipWhat,
  FAQS.mentorshipWho,
  FAQS.mentorshipFormat,
  FAQS.mentorshipBench,
  FAQS.mentorshipCost,
  FAQS.mentorshipCommit,
  FAQS.mentorshipJoin,
  FAQS.showroom,
];

export const CONTACT_FAQS: FaqItem[] = [
  FAQS.showroom,
  FAQS.prices,
  FAQS.sourcing,
  FAQS.shipping,
];
