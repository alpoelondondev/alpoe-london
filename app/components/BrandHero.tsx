import ScrollReveal from "./ScrollReveal";

export default function BrandHero({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <section className="px-[52px] pt-36 pb-14 max-md:px-6 max-md:pt-28 max-md:pb-10">
      <ScrollReveal>
        <p className="section-label text-[11px] tracking-[0.2em] uppercase text-accent mb-6 flex items-center gap-[18px]">
          {eyebrow}
        </p>
      </ScrollReveal>
      <ScrollReveal>
        <h1 className="font-serif text-[clamp(40px,6vw,88px)] tracking-[0.02em] leading-[0.95] max-w-4xl">
          {title}
        </h1>
      </ScrollReveal>
      <ScrollReveal>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-fg/70 font-light">
          {copy}
        </p>
      </ScrollReveal>
    </section>
  );
}
