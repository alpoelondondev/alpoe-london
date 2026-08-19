import type { ReactNode } from "react";

/**
 * A band of film across the page.
 *
 * Two shapes. With a `title` it is a cover: the page opens on it and the
 * heading sits over the footage. Without one it is a strip: a band of motion
 * between two sections, carrying no text and taking no part in the document
 * outline.
 *
 * Hero itself could not be reused. It is the home page's identity: the live
 * monogram, the wordmark, the two calls to action, and an `sr-only` h1 naming
 * the whole business. Dropping that on a section page gives it a second h1 and
 * says "Alpoe London" where it should say what the page is.
 *
 * So the treatment is shared and the content is not. Same clip, same poster,
 * same two overlays — a flat wash to hold the type against, and a gradient that
 * lands the top and bottom edges on the page ground so the band does not end in
 * a hard cut of video.
 *
 * Shorter than the home page's, deliberately. That one is the whole first
 * screen because it is the whole first impression. This is a cover: it has to
 * say where you are and then get out of the way of what you came for.
 */
export default function PageCover({
  eyebrow,
  title,
  strip = false,
  video = "/alpoe-london-hero.mp4",
  poster = "/alpoe-london-hero.jpg",
  children,
}: {
  eyebrow?: string;
  /** Omitted on a strip, which carries no heading. */
  title?: string;
  /**
   * A band rather than an opening: shorter, no text, and no gradient reaching
   * for a heading that is not there. Use where the page already has a header
   * and the film is punctuation rather than the introduction.
   */
  strip?: boolean;
  /**
   * The film, without its extension assumed. Defaults to the house hero, which
   * is right for a page about the business and wrong for a page about a
   * product: the rings pages take the oval three stone footage, which is the
   * same piece the home page's own Engagement & Wedding Rings card uses, so
   * clicking that card lands on the shot it just showed.
   */
  video?: string;
  /** Shown until the film has buffered, so the band is never empty. */
  poster?: string;
  /** Anything under the title — a sentence, a link, a control. */
  children?: ReactNode;
}) {
  return (
    <section
      className={`relative w-full overflow-hidden bg-bg ${
        strip
          ? "h-[30svh] min-h-[200px] max-h-[320px]"
          : "flex h-[46svh] min-h-[320px] items-end"
      }`}
      aria-hidden={strip || undefined}
    >
      {/* Muted and playsInline are what a browser asks for in return for
          autoplay, and both are set. `loop` keeps it running: a cover that
          plays once and freezes reads as a broken video rather than a still. */}
      <video
        key={video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45"
      >
        <source src={video} type="video/mp4" />
      </video>

      <div aria-hidden className="pointer-events-none absolute inset-0 bg-bg/55" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"
      />

      {!strip && (
        <div className="relative z-10 w-full px-[52px] pb-12 max-md:px-6 max-md:pb-9">
          {eyebrow && (
            <p className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
              {eyebrow}
            </p>
          )}
          {title && <h1 className="t-page">{title}</h1>}
          {children && <div className="mt-5 max-w-[58ch]">{children}</div>}
        </div>
      )}
    </section>
  );
}
