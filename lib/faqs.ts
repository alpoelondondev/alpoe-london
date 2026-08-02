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
} satisfies Record<string, FaqItem>;

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

export const CONTACT_FAQS: FaqItem[] = [
  FAQS.showroom,
  FAQS.prices,
  FAQS.sourcing,
  FAQS.shipping,
];
