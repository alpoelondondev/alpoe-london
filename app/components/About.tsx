import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

export default function About() {
  return (
    <section
      id="about"
      // Off-black band — the house colour at full strength. Heading in the
      // palest rose and body in page cream so both clear it comfortably.
      className="bg-panel px-[52px] pt-20 pb-20 max-md:px-6 max-md:pt-14 max-md:pb-14"
    >
      <ScrollReveal>
        <h2 className="font-serif text-[clamp(34px,4.5vw,60px)] tracking-[0.02em] leading-none text-blush text-center mb-10 max-md:mb-8">
          About Alpoe London
        </h2>
      </ScrollReveal>
      <ScrollReveal>
        <p className="max-w-2xl mx-auto text-center text-[15px] leading-[1.85] text-fg/75">
          Alpoe London delivers a true end-to-end luxury experience — from
          bespoke diamond pieces hand-set to your exact specification, to the
          world&apos;s most sought-after timepieces sourced directly for our
          clients.
          <br />
          <br />
          We serve clients of every calibre, from first-time buyers to a
          discreet roster of high-profile and high-net-worth collectors. Every
          relationship is handled with the same VIP service: private
          consultations, personal sourcing, and white-glove delivery. London
          based, worldwide shipped.
        </p>
      </ScrollReveal>
      {/* The private consultation the copy just promised, made bookable on the
          spot — the homepage's only route to the showroom diary. */}
      <ScrollReveal delay={0.08}>
        <div className="mt-10 flex justify-center max-md:mt-8">
          <Link
            href="/book-appointment"
            className="inline-flex items-center justify-center bg-accent px-9 py-4 font-serif text-[18px] uppercase tracking-[0.08em] text-bg transition hover:bg-accent-deep"
          >
            Book An Appointment
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
