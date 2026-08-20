import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ScrollReveal from "../components/ScrollReveal";
import CTAStrip from "../components/CTAStrip";
import FAQ from "../components/FAQ";
import FindUs from "../components/FindUs";
import BookingFlow from "./BookingFlow";
import { APPOINTMENT_FAQS } from "@/lib/faqs";
import { APPOINTMENT_TYPES } from "@/lib/appointments";
import { pageMetadata, ldJsonGraph, faqLd, localBusinessLd } from "@/lib/seo";
import { SITE, siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Book a Hatton Garden Showroom Appointment",
  description:
    "Book a private appointment at our Hatton Garden showroom — engagement ring consultations, bespoke design and luxury watch viewings. Mon to Sat, 10am to 6pm.",
  path: "/book-appointment",
});

const INTRO = "Hi Alpoe, I'd like to book an appointment at the showroom.";

/** What actually happens either side of the visit — the part a diary can't say. */
const WHAT_TO_EXPECT = [
  {
    title: "One-to-one, behind the counter",
    copy: "You get a specialist for the whole slot — not a queue. Loupe out, stones on the pad, questions answered properly.",
  },
  {
    title: "We prepare before you arrive",
    copy: "Tell us what you're after and the right stones, references and paperwork come out of the safe ahead of time.",
  },
  {
    title: "No pressure to buy",
    copy: "Appointments are free and nothing is committed. Plenty of people come in to learn what they're looking at first.",
  },
];

export default function BookAppointmentPage() {
  const ld = ldJsonGraph([
    localBusinessLd(),
    {
      "@type": "WebPage",
      "@id": siteUrl("/book-appointment") + "#webpage",
      url: siteUrl("/book-appointment"),
      name: `Book an appointment — ${SITE.name}`,
      description:
        "Book a private appointment at the Alpoe London showroom in Hatton Garden — engagement rings, bespoke design, luxury watches or a general visit.",
      about: { "@id": `${siteUrl()}/#localbusiness` },
      potentialAction: {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: siteUrl("/book-appointment"),
          actionPlatform: [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform",
          ],
        },
        result: { "@type": "Reservation", name: "Showroom appointment" },
      },
    },
    // Breadcrumbs are emitted by the <Breadcrumbs> component this page
    // renders, which is the single source of truth for the trail. Building
    // a second BreadcrumbList here published two competing trails per
    // document — Google picks one arbitrarily, or neither.
    faqLd(APPOINTMENT_FAQS),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Book an appointment"
          title="Visit The Showroom"
          copy={`Visit our ${SITE.address.streetAddress} showroom for a private, one-on-one experience with our team.`}
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Book an appointment", href: "/book-appointment", current: true },
            ]}
          />
        </section>

        {/* The four steps, stated before the flow asks for anything — so the
            reader knows how long this is going to take before they start. */}
        <section className="border-y border-fg/10 bg-panel-soft px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <div className="grid grid-cols-3 gap-10 max-lg:grid-cols-1 max-lg:gap-8">
              {WHAT_TO_EXPECT.map((item) => (
                <div key={item.title}>
                  <h2 className="t-sub">
                    {item.title}
                  </h2>
                  <p className="mt-3 t-copy">{item.copy}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <section id="booking" className="px-[52px] py-20 max-md:px-6 max-md:py-14">
          <ScrollReveal>
            <BookingFlow />
          </ScrollReveal>
        </section>

        {/* Plain-language index of the same four types the flow opens on, so
            the page still says what's on offer to a reader who never starts
            the form — and to a crawler, which never will. */}
        <section className="border-t border-fg/10 px-[52px] py-16 max-md:px-6 max-md:py-12">
          <ScrollReveal>
            <h2 className="t-section">
              Appointments we offer
            </h2>
            <ul className="mt-8 grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {APPOINTMENT_TYPES.map((t) => (
                <li key={t.slug} className="border-t border-accent/40 pt-4">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-champagne">
                    {t.minutes} min
                  </p>
                  <p className="mt-2 font-serif text-[19px] leading-tight text-blush">{t.name}</p>
                  <p className="t-copy mt-2">{t.blurb}</p>
                </li>
              ))}
            </ul>
            <p className="mt-10 max-w-2xl t-copy">
              Open Monday to Saturday, 10am until 6pm. Sunday closed. Walk-ins are welcome
              whenever we are open — an appointment simply means a specialist is held for you
              and your pieces are out of the safe before you arrive.
            </p>
          </ScrollReveal>
        </section>

        <FindUs />
        <FAQ items={APPOINTMENT_FAQS} />
        <CTAStrip
          eyebrow="Rather just message?"
          title="Tell us when suits and we'll fit you in"
          copy={`If none of the slots work, send us a note on WhatsApp with the day you're free and we'll open the ${SITE.address.streetAddress} counter around you.`}
          whatsappMessage={INTRO}
          primaryLabel="Ask For A Time"
          secondary={{ label: "Contact Us", href: "/contact" }}
        />
      </main>
      <Footer />
      <WhatsAppButton />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
