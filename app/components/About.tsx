import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

export default function About() {
  return (
    <section
      id="about"
      // Off-black band — the house colour at full strength. Heading in the
      // palest rose and body in page cream so both clear it comfortably.
      // Half the depth it used to run at: this is a placement line on the way
      // down the page, not a chapter, so it carries one paragraph and the
      // booking route and gets out of the way. The bottom margin is the band's
      // own: it ends on page ground rather than running straight into the
      // cards below, so the two read as separate things.
      className="relative overflow-hidden bg-panel px-[52px] pt-10 pb-10 mb-10 max-md:px-6 max-md:pt-8 max-md:pb-8 max-md:mb-8"
    >
      {/* The presentation plate, blurred so it never competes with the copy
          for focus, and kept clear of the band's own lockup — the photograph
          carries an embroidered ALPOE mark of its own, and two marks stacked
          on one line read as a printing error. Opacity and wash have to be
          read together: at 0.14 under a 55% wash it came out around 6% and
          could not be seen at all. Scaled past the edges because the blur
          would otherwise pull the frame's own soft border in from each side.
          Cropped to the plate's rose gold rim rather than its middle: the
          embroidery in the centre of the frame is the mark again, and it was
          landing directly under the lockup.
      */}
      {/* One layer across the whole band, faded in with a mask rather than
          started partway down: a layer that begins at 42% has a top edge, and
          a blurred photograph against flat panel colour shows that edge as a
          line straight across the band. The mask has no edge to show — the
          photograph is simply absent behind the lockup and arrives by the
          time the copy starts. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 26%, rgba(0,0,0,0.55) 46%, #000 72%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 26%, rgba(0,0,0,0.55) 46%, #000 72%)",
        }}
      >
        <Image
          src="/appointment-plate-AP.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover object-[50%_88%] opacity-[0.78] blur-[2px]"
        />
        {/* Panel colour held at the left and right edges so the band still
            ends on its own ground rather than on a photograph. */}
        <div className="absolute inset-0 bg-gradient-to-r from-panel from-0% via-panel/10 via-32% to-panel to-100%" />
      </div>
      {/* The lockup itself is the heading. The words stay in the document for
          anything that reads rather than looks — a screen reader, a crawler —
          while the band shows the mark. */}
      <ScrollReveal className="relative">
        <h2 className="mb-5 flex justify-center max-md:mb-4">
          <span className="sr-only">About Alpoe London</span>
          <Image
            src="/alpoe-london-logo-full-rosegold.svg"
            alt=""
            width={2187}
            height={1260}
            priority={false}
            className="h-[76px] w-auto max-md:h-[58px]"
          />
        </h2>
      </ScrollReveal>
      <ScrollReveal className="relative">
        {/* Still opens on Hatton Garden — the trade address is the
            credential, and it is what the band was asked to carry. The rest is
            the line as written: what we sell, then how we sell it. */}
        {/* The photograph is bright enough now to read through cream text at
            its own weight, so the copy carries a soft shadow rather than the
            band carrying a heavier wash — the picture stays visible and the
            words stay legible. */}
        <p
          className="t-copy max-w-xl mx-auto text-center !text-fg/85"
          style={{ textShadow: "0 1px 12px rgba(19, 16, 16, 0.85)" }}
        >
          Hatton Garden. Bespoke wedding rings, engagement rings, luxury
          timepieces. Private consultation, VIP personal service.
        </p>
      </ScrollReveal>
      {/* The private consultation the copy just promised, made bookable on the
          spot — the homepage's only route to the showroom diary. Worded as the
          person you reach rather than the diary you open: on this band the
          promise is the advisor, and the appointment is what follows. Every
          other route to the same page keeps the booking wording. */}
      <ScrollReveal delay={0.08} className="relative">
        <div className="mt-5 flex justify-center max-md:mt-4">
          <Link
            href="/book-appointment"
            className="inline-flex items-center justify-center bg-accent px-5 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-bg transition hover:bg-accent-deep"
          >
            Speak To A Client Advisor
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
