import ScrollReveal from "./ScrollReveal";

export default function BrandHero({
  eyebrow,
  title,
  copy,
}: {
  /** Omit to open straight on the headline, rule and all. */
  eyebrow?: string;
  title: string;
  /** Omit to let the headline stand on its own. */
  copy?: string;
}) {
  return (
    <section className="px-[52px] pt-52 pb-14 max-md:px-6 max-md:pt-48 max-md:pb-10">
      {eyebrow ? (
        <ScrollReveal>
          <p className="section-label text-[11px] tracking-[0.2em] uppercase text-accent mb-6 flex items-center gap-[18px]">
            {eyebrow}
          </p>
        </ScrollReveal>
      ) : null}
      <ScrollReveal>
        <h1 className="t-page max-w-4xl">
          {title}
        </h1>
      </ScrollReveal>
      {copy ? (
        <ScrollReveal>
          <p className="mt-6 max-w-2xl t-copy font-light">
            {copy}
          </p>
        </ScrollReveal>
      ) : null}
    </section>
  );
}
