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
  finance: {
    question: "Do you offer finance or payment plans?",
    answer:
      "We do. Flexible payment options are available on watches, engagement rings and bespoke jewellery alike — contact us and we'll structure a plan that suits you.",
  },
  tradeIn: {
    question: "Will you buy or part-exchange my watch?",
    answer:
      "Yes. We purchase pre-owned luxury watches and offer strong trade-in valuations. Share the details of your timepiece and we'll give you a no-obligation quote.",
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
  FAQS.finance,
  FAQS.tradeIn,
  FAQS.showroom,
];

export const WATCH_FAQS: FaqItem[] = [
  FAQS.sourcing,
  FAQS.prices,
  FAQS.tradeIn,
  FAQS.finance,
  FAQS.showroom,
];

export const JEWELLERY_FAQS: FaqItem[] = [
  FAQS.bespoke,
  FAQS.certification,
  FAQS.prices,
  FAQS.finance,
  FAQS.showroom,
];
