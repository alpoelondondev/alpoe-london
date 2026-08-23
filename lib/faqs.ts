export type FaqItem = {
  question: string;
  answer: string;
  /**
   * A guide this answer is the short version of.
   *
   * The answer text stays complete on its own — it is what the FAQ schema
   * carries, and a schema answer that ends in "read more" answers nothing. The
   * link is an extra affordance under it for the reader who wants the long
   * form, which is how the ring pages send people to the size chart and the
   * laboratory-grown comparison without a second row of promo cards.
   */
  href?: string;
  /** What the link calls itself. Defaults to "Read the full guide". */
  linkLabel?: string;
};

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
    question: "Do you work with laboratory-grown as well as natural diamonds?",
    answer:
      "Both. Laboratory-grown diamonds have essentially the same properties as natural stones and typically let you go significantly larger for the same budget. Natural diamonds hold their rarity and resale position. We will show you the same design in both so you can compare in person.",
    href: "/guides/natural-vs-lab-grown-diamonds",
    linkLabel: "Laboratory-grown vs natural diamonds",
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
      "Yes, and you should not buy one that is not. Look for GIA or IGI. Both laser inscribe a number on the girdle that matches the certificate, readable at 50x magnification, and IGI marks lab stones as laboratory-grown alongside it.",
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
  ringSize: {
    question: "How do I find out my ring size?",
    answer:
      "Measure the finger it will actually be worn on, at the end of the day when hands are largest, and measure the same finger twice on different days. UK sizes run A to Z, so a number from an American or European chart has to be converted rather than used as it stands. Our size guide has the full UK chart in millimetres, three ways to measure at home, the average UK sizes for men and women, and four ways to work out somebody else's size without asking them.",
    href: "/ring-size-guide",
    linkLabel: "Ring size guide and UK size chart",
  },
  ringResize: {
    question: "Can a ring be resized later?",
    answer:
      "Most can, usually a size or two either way, and we will tell you what is involved before you commission anything. The exception is a full eternity band: the stones run the whole way round, so the spacing cannot be altered and the ring cannot be sized. That is exactly why the measurement matters most on the rings that are hardest to change.",
  },
  ringWeddingBand: {
    question: "Which wedding band goes with my engagement ring?",
    answer:
      "It depends on the shape of the engagement ring. Many take a plain straight band beside them, and a few settings will not sit flush against one at all, so the band is cut to fit around the ring instead. Bring the engagement ring in, or start from our pairing guide, which covers the profile, the width and the metal to choose beside a stone you already own.",
    href: "/guides/wedding-bands",
    linkLabel: "What wedding band goes with your ring",
  },
  ringHallmark: {
    question: "Are your rings hallmarked?",
    answer:
      "Yes. Every ring is struck at the London Assay Office, whose counter is on Greville Street, a few doors from our own. The hallmark is independent of us: it certifies the fineness of the metal, who sponsored the piece and where it was tested, which is why it is worth understanding before you buy anything in precious metal.",
    href: "/hallmarking",
    linkLabel: "What a British hallmark certifies",
  },
  ringReadyNow: {
    question: "Do you have rings that are ready now?",
    answer:
      "Yes. Alongside the made-to-order styles we hold a set of finished engagement rings, which only need sizing before they go out — far sooner than a commission. Ask about any of them and we will confirm what is available in your size.",
    href: "/rings/ready-to-ship",
    linkLabel: "See the ready to ship rings",
  },
  ringDesignOnline: {
    question: "Can I design the ring myself?",
    answer:
      "Yes. The ring builder takes you through the band style, the diamond and its shape, the setting, the metal and the UK size, and shows the ring as you change it. Whatever you land on comes to us as a starting point rather than a finished order — we model the exact ring in CAD and send it back to you with the price before anything is cast.",
    href: "/ring-builder",
    linkLabel: "Open the ring builder",
  },
  appointmentNeeded: {
    question: "Do I need an appointment to visit?",
    answer:
      "No — walk-ins are welcome during opening hours. Booking simply guarantees a specialist is free for you, and lets us have the right stones, references or paperwork out of the safe before you arrive.",
  },
  appointmentConfirm: {
    question: "How is my appointment confirmed?",
    answer:
      "The booking form writes your request into a WhatsApp message that you send us. We reply in the same thread to confirm the slot, usually the same day, and that reply is your confirmation.",
  },
  appointmentCost: {
    question: "Does an appointment cost anything?",
    answer:
      "Nothing at all, and there is no obligation to buy. Plenty of people come in to learn what they are looking at before they spend anything.",
  },
  appointmentChange: {
    question: "Can I move or cancel my appointment?",
    answer:
      "Yes. Message us on the same WhatsApp thread and we will move it — no notice period and no charge. We would rather rearrange than have you rush.",
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

export const RING_FAQS: FaqItem[] = [
  FAQS.ringSize,
  FAQS.labGrown,
  FAQS.ringWeddingBand,
  FAQS.ringResize,
  FAQS.ringReadyNow,
  FAQS.ringDesignOnline,
  FAQS.ringHallmark,
  FAQS.prices,
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

export const APPOINTMENT_FAQS: FaqItem[] = [
  FAQS.appointmentNeeded,
  FAQS.appointmentConfirm,
  FAQS.appointmentCost,
  FAQS.appointmentChange,
  FAQS.prices,
  FAQS.sourcing,
];

export const CONTACT_FAQS: FaqItem[] = [
  FAQS.showroom,
  FAQS.prices,
  FAQS.sourcing,
  FAQS.shipping,
];
