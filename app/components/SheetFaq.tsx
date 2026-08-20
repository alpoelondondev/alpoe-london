import ScrollReveal from "./ScrollReveal";

export type SheetFaqItem = { question: string; answer: string };

/**
 * The FAQ block for the light "sheet" pages — guides, size charts, reference.
 *
 * Two reasons it exists rather than reusing <FAQ>. The obvious one is the
 * palette: <FAQ> is built for the dark sections and its borders and fills
 * disappear on white. The one that matters more is that this is a server
 * component built on <details>, so every question and every answer is in the
 * HTML as text with no JavaScript involved and no state to hydrate.
 *
 * That distinction is the reason this component was written at all. The ring
 * size guide was publishing FAQPage structured data for six questions that
 * appeared nowhere on the page — which is not a technicality but a direct
 * breach of Google's structured data policy ("content must be visible to
 * users"), the kind that earns a manual action rather than a warning. Marking
 * up an answer obliges you to show it. This shows it.
 *
 * Open by default: these are short, they are the answers people arrived for,
 * and a page that hides its substance behind six clicks reads as thinner than
 * it is to a reader skimming for the number they came to find.
 */
export default function SheetFaq({
  items,
  heading = "Common questions",
  id = "faq",
}: {
  items: SheetFaqItem[];
  heading?: string;
  id?: string;
}) {
  return (
    <ScrollReveal>
      <section id={id} className="border-t border-sheet-line pt-8 mt-10">
        <h2 className="t-sub">{heading}</h2>
        <div className="mt-5 divide-y divide-sheet-line border-y border-sheet-line">
          {items.map((item, i) => (
            <details key={item.question} open={i < 2} className="group py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[15px] font-medium text-sheet-ink marker:hidden">
                <h3 className="text-[15px] font-medium leading-snug">
                  {item.question}
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-accent-deep transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[70ch] t-copy">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
