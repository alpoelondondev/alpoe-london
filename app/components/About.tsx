import ScrollReveal from "./ScrollReveal";

export default function About() {
  return (
    <section
      id="about"
      className="px-[52px] pt-14 pb-14 max-md:px-6 max-md:pt-10 max-md:pb-10"
    >
      <ScrollReveal>
        <p className="max-w-2xl mx-auto text-center text-[15px] leading-[1.85] text-dim">
          <strong className="text-fg font-normal">Alpoe London</strong>{" "}
          delivers a true end-to-end luxury experience — from bespoke diamond
          pieces hand-set to your exact specification, to the world&apos;s most
          sought-after timepieces sourced directly for our clients.
          <br />
          <br />
          We serve clients of every calibre, from first-time buyers to a
          discreet roster of high-profile and high-net-worth collectors. Every
          relationship is handled with the same VIP service: private
          consultations, personal sourcing, and white-glove delivery.{" "}
          <strong className="text-fg font-normal">
            London based, worldwide shipped.
          </strong>
        </p>
      </ScrollReveal>
    </section>
  );
}
