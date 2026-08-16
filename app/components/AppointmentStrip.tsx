import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { APPOINTMENT_TYPES } from "@/lib/appointments";

/**
 * Booking band — the site's one standing invitation to come to the counter.
 *
 * It carries the four appointment types rather than a bare button, because the
 * question that stops people booking is not "where" but "what would I even
 * say" — seeing a 30-minute no-commitment visit on the list answers it.
 *
 * Raised panel with a rose hairline along the top: the same elevation language
 * as the rest of the page, and the rule ties it to the CTA it ends on.
 */
export default function AppointmentStrip() {
  return (
    <section
      id="book"
      aria-label="Book an appointment"
      className="border-t border-accent/40 bg-panel px-[52px] py-20 max-md:px-6 max-md:py-14"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-14 max-lg:grid-cols-1 max-lg:gap-10">
        <ScrollReveal>
          <p className="section-label flex items-center gap-[18px] text-[11px] tracking-[0.2em] uppercase text-champagne">
            Book an appointment
          </p>
          <h2 className="mt-6 font-serif text-[clamp(30px,4.2vw,56px)] leading-[0.98] text-blush">
            One Hour, One Counter,
            <br />
            Just You
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-[1.8] text-fg/70">
            Visit our Hatton Garden showroom for a private, one-on-one experience with our
            team. Pick the type of appointment, choose a time, and send it over on WhatsApp —
            we confirm the slot the same day.
          </p>
          <Link
            href="/book-appointment"
            className="mt-8 inline-flex items-center justify-center bg-accent px-9 py-4 font-serif text-[18px] uppercase tracking-[0.08em] text-bg transition hover:bg-accent-deep"
          >
            Book An Appointment
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ul className="grid grid-cols-2 gap-x-10 gap-y-8 max-sm:grid-cols-1">
            {APPOINTMENT_TYPES.map((t) => (
              <li key={t.slug} className="border-t border-fg/15 pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-serif text-[19px] leading-tight text-fg">{t.name}</p>
                  <span className="shrink-0 text-[10px] tracking-[0.16em] uppercase text-champagne">
                    {t.minutes} min
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-fg/60">{t.blurb}</p>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
