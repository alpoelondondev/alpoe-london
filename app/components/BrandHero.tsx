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
    <section className="px-[52px] pt-12 pb-14 max-md:px-6 max-md:pt-9 max-md:pb-10">
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
