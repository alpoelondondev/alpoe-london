import ScrollReveal from "./ScrollReveal";

export default function About() {
  return (
    <section
      id="about"
      // Oxblood band in the Alpoe London wordmark colour; heading in champagne
      // and body in page cream so both clear the background comfortably.
      className="bg-accent px-[52px] pt-20 pb-20 max-md:px-6 max-md:pt-14 max-md:pb-14"
    >
      <ScrollReveal>
        <h2 className="font-serif text-[clamp(34px,4.5vw,60px)] tracking-[0.02em] leading-none text-champagne text-center mb-10 max-md:mb-8">
          About Alpoe London
        </h2>
      </ScrollReveal>
      <ScrollReveal>
        <p className="max-w-2xl mx-auto text-center text-[15px] leading-[1.85] text-[rgba(244,242,238,0.78)]">
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
    </section>
  );
}
