import Link from "next/link";
import DragCarousel from "../components/DragCarousel";
import { hasPhotography, productUrl } from "@/lib/products";
import type { Product } from "@/lib/types";
import type { CollectionPiece } from "@/lib/rings/collection";
import { styleHref, styleImage, styleSubtitle, styleTitle, type RingStyle } from "@/lib/rings/styles";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

/**
 * The card and rail markup shared by the four ring pages.
 *
 * Extracted when /rings stopped being one page with three anchors and became a
 * hub with three children. The anchors were the wrong shape: engagement rings,
 * wedding bands and stock pieces are three different searches by three
 * different people, and a fragment cannot carry its own title, description or
 * position in a results page. Sub-pages can.
 *
 * What must not follow from that split is three copies of a card that drift
 * apart, so the markup lives here once.
 */

/** The mark on the Customise control, in both its forms. */
export function Sparkle() {
  return (
    <svg viewBox="0 0 12 12" width="8" height="8" aria-hidden>
      <path
        d="M6 0l1.6 4.4L12 6l-4.4 1.6L6 12l-1.6-4.4L0 6l4.4-1.6z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * One ring style, linking into the builder on exactly the ring pictured.
 *
 * The 1.26 fill matches the builder's viewer: a fifth of every render is white
 * sweep. Done by layout rather than `transform` so the browser resamples the
 * source once at the size it paints, which is the difference between a sharp
 * facet and a soft one. See ZoomView for the measurement.
 */
export function StyleCard({ style }: { style: RingStyle }) {
  const image = styleImage(style);
  return (
    <Link href={styleHref(style)} data-haptic className="group block" title={style.description}>
      <span className="relative block aspect-square w-full overflow-hidden bg-render-ground">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- see lib/ring/renders.ts
          <img
            src={image}
            width={900}
            height={900}
            alt={`${styleTitle(style)} with a ${style.showcase.shape} diamond`}
            loading="lazy"
            decoding="async"
            className="absolute left-[-14.3%] top-[-10.5%] h-[126%] w-[126%] max-w-none object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <span className="block h-[38%] w-[38%] rounded-full border border-sheet-line" />
          </span>
        )}

        {/* Desktop only. Two across on a phone means a card about 170px wide,
            where a pill legible over the photograph covers a third of the ring
            it is inviting you to look at. */}
        <span className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-sheet-ink px-5 py-2.5 text-[11px] font-semibold tracking-[0.16em] whitespace-nowrap text-white uppercase shadow-[0_2px_10px_rgba(23,19,18,0.18)] transition group-hover:bg-sheet-ink/85 max-md:hidden">
          <Sparkle />
          Customise
        </span>
      </span>

      <h2 className="t-card mt-4 leading-snug max-md:mt-3">{styleTitle(style)}</h2>
      <p className="t-eyebrow mt-1.5 !tracking-[0.12em] text-sheet-dim">
        {styleSubtitle(style)}
      </p>
      <p className="t-eyebrow mt-2 hidden items-center gap-1.5 font-semibold !text-sheet-ink max-md:flex">
        <Sparkle />
        Customise
      </p>
    </Link>
  );
}

/** The fifteen styles, two across. */
export function StyleGrid({ styles }: { styles: RingStyle[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-8 gap-y-12 max-md:gap-x-4 max-md:gap-y-8">
      {styles.map((style) => (
        <li key={style.id}>
          <StyleCard style={style} />
        </li>
      ))}
    </ul>
  );
}

/** A piece we hold. The action is an enquiry, because it already exists. */
export function ReadyToShipCard({ piece }: { piece: CollectionPiece }) {
  return (
    <a
      href={buildGeneralWhatsAppUrl(
        `Hello, I am interested in the ${piece.label} ring from your ready to ship pieces.`,
      )}
      target="_blank"
      rel="noopener noreferrer"
      data-haptic
      className="group block"
      title={piece.description}
    >
      <span className="relative block aspect-square w-full overflow-hidden bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element -- local, already sized */}
        <img
          src={piece.image}
          alt={`${piece.label} engagement ring`}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </span>
      <h2 className="t-card mt-3 leading-snug">{piece.label}</h2>
      <p className="t-eyebrow mt-1 !tracking-[0.12em] text-sheet-dim">Enquire</p>
    </a>
  );
}

/** A stocked wedding band, linking to its own product page. */
export function ProductRingCard({ product }: { product: Product }) {
  return (
    <Link href={productUrl(product)} data-haptic className="group block">
      <span className="relative block aspect-square w-full overflow-hidden bg-white">
        {hasPhotography(product) ? (
          // eslint-disable-next-line @next/next/no-img-element -- matches the cards above
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <span className="block h-[38%] w-[38%] rounded-full border border-sheet-line" />
          </span>
        )}
      </span>
      <h2 className="t-card mt-3 leading-snug">{product.title}</h2>
      {product.materials && (
        <p className="t-eyebrow mt-1 !tracking-[0.12em] text-sheet-dim">
          {product.materials}
        </p>
      )}
    </Link>
  );
}

/**
 * A rail of cards, for the pages where the set is small.
 *
 * A grid of two or three items reads as a page that has run out; a rail reads
 * as a selection. Above about eight the grid is the better shape, which is why
 * the styles use one.
 */
export function CardRail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <DragCarousel
      ariaLabel={label}
      className="gap-5 px-[52px] py-1 max-md:gap-4 max-md:px-6"
    >
      {children}
    </DragCarousel>
  );
}

/** One rail item's width, shared so the three rails match. */
export const RAIL_ITEM = "w-[232px] shrink-0 snap-start max-md:w-[176px]";
