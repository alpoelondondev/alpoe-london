import Image from "next/image";
import Link from "next/link";

/**
 * The two things people arrive for, given a full-bleed pair directly under the
 * About band.
 *
 * Edge to edge and gapless on purpose: the rest of the homepage is a gridded
 * page with gutters, so a pair that runs into the viewport's own edges reads
 * as a break in that rhythm rather than another row of tiles. On a phone they
 * stack, each still full width.
 */
const CARDS: {
  title: string;
  /** One line under the title — a description, not a paragraph. */
  copy: string;
  href: string;
  image: string;
  /** Per-photograph framing: crop, zoom and how far it sits back. */
  imageClass?: string;
  /**
   * Written as a plain transform rather than utilities because the order
   * matters here: scale first, then translate, so the shift is measured in
   * the enlarged frame. Tailwind composes them the other way round.
   */
  imageTransform?: string;
  /** Draws the ground in from the left, for a subject that sits right. */
  sideFade?: boolean;
}[] = [
  {
    title: "Engagement & Wedding Rings",
    copy: "Bespoke settings and bands, made to your specification.",
    href: "/jewellery/engagement-rings",
    image: "/alpoe-oval-three-stone-diamond-ring-hatton-garden.jpg",
  },
  {
    title: "Preowned Watches",
    copy: "Authenticated timepieces, sourced and traded.",
    href: "/watches",
    image: "/buss-down-ap.jpg",
    // Shot square-on in its box, and at the card's own 4:3 — so object-cover
    // crops nothing and object-position has nothing to move. The framing has
    // to come from the transform instead: enlarged past the box edges, pushed
    // right so the watch clears the type, and lifted so the copy does not cut
    // the case in half.
    // Enlarged again so the watch is legible as a watch rather than a texture
    // — at 1.5 the case read as pavé and nothing else.
    imageTransform: "scale(1.8) translate(9%, -4%)",
    imageClass: "opacity-95",
    sideFade: true,
  },
];

export default function FeatureCards() {
  return (
    <section aria-label="Engagement rings and preowned watches">
      {/* gap-0 said out loud: these two are meant to meet. No reveal wrapper
          either — sliding each card up 40px on a stagger opened a visible seam
          between them while they animated, worst on a phone where they stack
          and the second card's travel reads as a gap under the first. */}
      <ul className="grid grid-cols-2 gap-0 max-md:grid-cols-1">
        {CARDS.map((card) => (
          <li key={card.href} className="flex">
            <Link
                href={card.href}
                className="group relative flex w-full aspect-[4/3] items-center overflow-hidden max-lg:aspect-square max-md:aspect-[16/10]"
              >
                {/* The hover zoom lives on the wrapper rather than the image
                    so it composes with each photograph's own scale instead of
                    overriding it — otherwise a card framed at 1.5 would
                    shrink the moment you pointed at it. */}
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover ${card.imageClass ?? ""}`}
                    style={
                      card.imageTransform
                        ? { transform: card.imageTransform }
                        : undefined
                    }
                  />
                </div>
                {/* Weighted to the foot rather than washed over the whole
                    frame, so the photograph keeps its top half and the type
                    still has ground to sit on. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-bg/25"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-transparent"
                />
                {/* Second wash, drawn in from the left: where the subject sits
                    out to the right, this is what the type reads against.
                    Kept narrow and light on purpose — at full strength across
                    a third of the card it read as a black column between the
                    two photographs, which looked like a gap between the cards
                    even though they touch. */}
                {card.sideFade ? (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-r from-bg/85 from-0% via-bg/25 via-16% to-transparent to-42%"
                  />
                ) : null}
                {/* Sits on the card's middle line rather than its foot, and
                    flush left on both cards so the pair reads as one row
                    rather than two separate treatments. */}
                <div className="relative w-full px-10 text-left max-md:px-6">
                  <h3 className="t-section">
                    {card.title}
                  </h3>
                  {/* Held to one line's worth: the photograph is doing the
                      selling here, and the card is a door rather than a page. */}
                  <p className="t-copy mt-2 max-w-sm">{card.copy}</p>
                </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
