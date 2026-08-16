"use client";

import { useEffect, useRef, useState } from "react";
import {
  APPOINTMENT_TYPES,
  bookingDays,
  buildAppointmentMessage,
  buildAppointmentUrl,
  formatBookingDate,
  formatSlot,
  slotsFor,
  type AppointmentType,
  type BookingDay,
} from "@/lib/appointments";

/**
 * Four-step booking flow. Nothing is stored or posted: the last step composes
 * the whole booking into a WhatsApp message, shows it back to the customer
 * exactly as the counter will read it, and hands off to wa.me — the same
 * pattern as every other enquiry on the site.
 */

const STEPS = ["Type", "Date & Time", "Details", "Confirmed"] as const;

const WHATSAPP_GLYPH = (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.11a9.9 9.9 0 0 0 5.79 1.84h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02A9.87 9.87 0 0 0 12.04 2Zm0 18.07h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-2.52.66.67-2.46-.2-.31a8.18 8.18 0 0 1-1.26-4.39c0-4.53 3.69-8.22 8.22-8.22 2.2 0 4.26.86 5.82 2.41a8.19 8.19 0 0 1 2.41 5.82c0 4.53-3.69 8.22-8.22 8.22Zm4.52-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.83-.2-.48-.4-.42-.56-.42l-.48-.01a.92.92 0 0 0-.67.31c-.23.25-.88.86-.88 2.09 0 1.24.9 2.43 1.03 2.6.13.17 1.77 2.7 4.3 3.79.6.26 1.07.41 1.44.53.6.19 1.15.17 1.59.1.49-.07 1.5-.61 1.71-1.2.21-.58.21-1.08.14-1.2-.06-.12-.22-.19-.47-.31Z" />
  </svg>
);

const inputClass =
  "w-full bg-transparent border border-fg/20 px-4 py-3 text-[14px] text-fg outline-none transition focus:border-accent placeholder:text-dim/70";

function Timeline({
  step,
  maxStep,
  onJump,
}: {
  step: number;
  /** Furthest step the answers so far actually support. */
  maxStep: number;
  onJump: (i: number) => void;
}) {
  return (
    <ol className="flex items-start justify-between gap-2">
      {STEPS.map((label, i) => {
        const done = i < step;
        const current = i === step;
        const reachable = i <= maxStep;
        return (
          <li key={label} className="relative flex flex-1 flex-col items-center text-center">
            {/* The connector runs from this node's centre to the next one's,
                so it tracks the nodes at any width rather than being spaced
                by hand. Hidden on the last node, which has nothing to join. */}
            {i < STEPS.length - 1 ? (
              <span
                aria-hidden="true"
                className={`absolute left-1/2 top-[17px] h-px w-full transition-colors duration-500 ${
                  done ? "bg-accent" : "bg-fg/15"
                }`}
              />
            ) : null}
            <button
              type="button"
              onClick={() => reachable && onJump(i)}
              disabled={!reachable}
              aria-current={current ? "step" : undefined}
              className={`relative z-10 flex h-[35px] w-[35px] items-center justify-center rounded-full border font-serif text-[17px] leading-none transition duration-300 ${
                current
                  ? "border-accent bg-accent text-bg"
                  : done
                    ? "border-accent bg-bg text-accent hover:bg-accent/10 cursor-pointer"
                    : "border-fg/20 bg-bg text-dim"
              } ${reachable && !current ? "cursor-pointer" : ""} ${
                reachable ? "" : "cursor-default"
              }`}
            >
              {done ? "✓" : i + 1}
            </button>
            <span
              className={`mt-3 text-[10px] tracking-[0.18em] uppercase transition-colors duration-300 max-md:text-[9px] max-md:tracking-[0.12em] ${
                current ? "text-blush" : done ? "text-accent" : "text-dim"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function BookingFlow() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<AppointmentType | null>(null);
  const [days, setDays] = useState<BookingDay[]>([]);
  const [dateIso, setDateIso] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  const top = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  // The diary is built from the visitor's own clock, so it can only be worked
  // out after mount — computing it during render would have the server and the
  // client disagree about which days are still open.
  useEffect(() => {
    if (!type) return;
    const next = bookingDays(type.minutes);
    setDays(next);
    // A slot chosen for a shorter appointment may no longer fit a longer one.
    setDateIso((d) => (d && next.some((x) => x.iso === d) ? d : null));
    setTime(null);
  }, [type]);

  // Move the flow back under the reader's eye on every step change, but not on
  // the first paint — the page should open where the page opens.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const slots = type && dateIso ? slotsFor(type.minutes, dateIso) : [];
  const detailsReady = name.trim().length > 0 && contact.trim().length > 0;
  const booking =
    type && dateIso && time && detailsReady
      ? { type, dateIso, time, name, contact, guests, budget, notes }
      : null;

  /**
   * Read off the answers rather than off how far the visitor has been: picking
   * a longer appointment after reviewing can invalidate the chosen slot, and a
   * step you can no longer satisfy must not stay clickable.
   */
  const maxStep = !type ? 0 : !(dateIso && time) ? 1 : !detailsReady ? 2 : 3;

  // Anything that invalidates a later answer drops the visitor back to the
  // step that has to be answered again.
  useEffect(() => {
    setStep((s) => Math.min(s, maxStep));
  }, [maxStep]);

  function go(next: number) {
    setStep(Math.min(next, maxStep + 1));
  }

  return (
    <div ref={top} className="scroll-mt-28">
      <div className="mx-auto mb-14 max-w-2xl max-md:mb-10">
        <Timeline step={step} maxStep={maxStep} onJump={go} />
      </div>

      {/* ---------------------------------------------------------------- 1 */}
      {step === 0 ? (
        <div>
          <h2 className="text-center font-serif text-[clamp(24px,3.2vw,40px)] leading-tight text-blush">
            What would you like to discuss?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-[14px] leading-relaxed text-dim">
            Choose the type of appointment that suits you.
          </p>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 max-md:grid-cols-1">
            {APPOINTMENT_TYPES.map((t) => {
              const active = type?.slug === t.slug;
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => {
                    setType(t);
                    go(1);
                  }}
                  className={`group flex h-full flex-col items-start border p-6 text-left transition duration-300 cursor-pointer ${
                    active
                      ? "border-accent bg-accent/[0.07]"
                      : "border-fg/15 hover:border-accent/60 hover:bg-fg/[0.03]"
                  }`}
                >
                  <span className="font-serif text-[22px] leading-tight text-blush">
                    {t.name}
                  </span>
                  <span className="mt-3 text-[14px] leading-relaxed text-fg/70">
                    {t.blurb}
                  </span>
                  <span className="mt-6 inline-flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-champagne">
                    <span className="h-px w-6 bg-champagne/60" />
                    {t.minutes} min
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- 2 */}
      {step === 1 && type ? (
        <div>
          <h2 className="text-center font-serif text-[clamp(24px,3.2vw,40px)] leading-tight text-blush">
            Pick a date and time
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-[14px] leading-relaxed text-dim">
            {type.name} · {type.minutes} min. We are open Monday to Saturday, 10am until 6pm.
          </p>

          <div className="mx-auto mt-10 max-w-3xl">
            <p className="text-[10px] tracking-[0.18em] uppercase text-dim">Date</p>
            <div className="scrollbar-none mt-4 flex gap-3 overflow-x-auto pb-2">
              {days.length ? (
                days.map((d) => {
                  const active = d.iso === dateIso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => {
                        setDateIso(d.iso);
                        setTime(null);
                      }}
                      className={`flex w-[72px] shrink-0 flex-col items-center gap-1 border py-3 transition duration-300 cursor-pointer ${
                        active
                          ? "border-accent bg-accent text-bg"
                          : "border-fg/15 text-fg hover:border-accent/60"
                      }`}
                    >
                      <span className="text-[10px] tracking-[0.14em] uppercase opacity-70">
                        {d.weekday}
                      </span>
                      <span className="font-serif text-[24px] leading-none">{d.day}</span>
                      <span className="text-[10px] tracking-[0.14em] uppercase opacity-70">
                        {d.month}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="text-[14px] text-dim">Loading the diary…</p>
              )}
            </div>

            <p className="mt-10 text-[10px] tracking-[0.18em] uppercase text-dim">Time</p>
            {dateIso ? (
              <div className="mt-4 grid grid-cols-6 gap-2 max-md:grid-cols-3">
                {slots.map((s) => {
                  const active = s === time;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTime(s)}
                      className={`border py-3 text-[13px] tracking-[0.06em] transition duration-300 cursor-pointer ${
                        active
                          ? "border-accent bg-accent text-bg"
                          : "border-fg/15 text-fg hover:border-accent/60"
                      }`}
                    >
                      {formatSlot(s)}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-[14px] text-dim">Choose a date to see the times.</p>
            )}

            <div className="mt-12 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => go(0)}
                className="text-[11px] tracking-[0.18em] uppercase text-dim transition hover:text-fg cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={!time}
                onClick={() => go(2)}
                className="border border-accent bg-accent px-8 py-3.5 font-serif text-[17px] uppercase tracking-[0.08em] text-bg transition hover:bg-accent-deep hover:border-accent-deep disabled:cursor-not-allowed disabled:border-fg/15 disabled:bg-transparent disabled:text-dim cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- 3 */}
      {step === 2 && type && dateIso && time ? (
        <div>
          <h2 className="text-center font-serif text-[clamp(24px,3.2vw,40px)] leading-tight text-blush">
            Who are we expecting?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-[14px] leading-relaxed text-dim">
            {formatBookingDate(dateIso)} at {formatSlot(time)}.
          </p>

          <form
            className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 max-md:grid-cols-1"
            onSubmit={(e) => {
              e.preventDefault();
              go(3);
            }}
          >
            <label className="flex flex-col gap-2">
              <span className="text-[10px] tracking-[0.18em] uppercase text-dim">Name *</span>
              <input
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[10px] tracking-[0.18em] uppercase text-dim">
                Phone or Email *
              </span>
              <input
                name="contact"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="How we reach you"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[10px] tracking-[0.18em] uppercase text-dim">
                How many visiting?
              </span>
              <select
                name="guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className={inputClass}
              >
                <option value="" className="bg-bg">
                  Just me
                </option>
                <option value="2 people" className="bg-bg">
                  2 people
                </option>
                <option value="3 people" className="bg-bg">
                  3 people
                </option>
                <option value="4 or more" className="bg-bg">
                  4 or more
                </option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[10px] tracking-[0.18em] uppercase text-dim">
                Budget (optional)
              </span>
              <input
                name="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. £5,000–£10,000"
                className={inputClass}
              />
            </label>
            <label className="col-span-2 flex flex-col gap-2 max-md:col-span-1">
              <span className="text-[10px] tracking-[0.18em] uppercase text-dim">
                Anything we should have ready?
              </span>
              <textarea
                name="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="A reference you're hunting, a stone shape you love, a photo you'd like us to look at…"
                className={`${inputClass} resize-y`}
              />
            </label>

            <div className="col-span-2 mt-6 flex items-center justify-between gap-4 max-md:col-span-1">
              <button
                type="button"
                onClick={() => go(1)}
                className="text-[11px] tracking-[0.18em] uppercase text-dim transition hover:text-fg cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={!detailsReady}
                className="border border-accent bg-accent px-8 py-3.5 font-serif text-[17px] uppercase tracking-[0.08em] text-bg transition hover:bg-accent-deep hover:border-accent-deep disabled:cursor-not-allowed disabled:border-fg/15 disabled:bg-transparent disabled:text-dim cursor-pointer"
              >
                Review Booking
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- 4 */}
      {step === 3 && booking ? (
        <div>
          <h2 className="text-center font-serif text-[clamp(24px,3.2vw,40px)] leading-tight text-blush">
            Send it to the showroom
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-[14px] leading-relaxed text-dim">
            This is your booking, written out. Press send in WhatsApp and we will confirm the
            slot in the thread — usually the same day.
          </p>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="border border-fg/15 bg-panel">
              <div className="flex items-center justify-between gap-4 border-b border-fg/10 px-6 py-4">
                <p className="text-[10px] tracking-[0.18em] uppercase text-champagne">
                  Your appointment
                </p>
                <button
                  type="button"
                  onClick={() => go(0)}
                  className="text-[10px] tracking-[0.18em] uppercase text-dim transition hover:text-accent cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <dl className="grid grid-cols-2 gap-x-8 gap-y-6 px-6 py-7 max-md:grid-cols-1">
                {[
                  ["Appointment", booking.type.name],
                  ["Length", `${booking.type.minutes} min`],
                  ["Date", formatBookingDate(booking.dateIso)],
                  ["Time", formatSlot(booking.time)],
                  ["Name", booking.name],
                  ["Contact", booking.contact],
                  ["Visitors", booking.guests || "Just me"],
                  ["Where", "The Garden, Hatton Garden, London EC1N"],
                  ...(booking.budget.trim()
                    ? [["Budget", booking.budget.trim()] as const]
                    : []),
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[10px] tracking-[0.18em] uppercase text-dim">{label}</dt>
                    <dd className="mt-1.5 text-[15px] leading-snug text-fg">{value}</dd>
                  </div>
                ))}
                {booking.notes.trim() ? (
                  <div className="col-span-2 max-md:col-span-1">
                    <dt className="text-[10px] tracking-[0.18em] uppercase text-dim">Notes</dt>
                    <dd className="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed text-fg">
                      {booking.notes.trim()}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <p className="mt-10 text-[10px] tracking-[0.18em] uppercase text-dim">
              The message we&apos;ll open for you
            </p>
            <pre className="mt-3 whitespace-pre-wrap border border-fg/15 bg-fg/[0.03] px-6 py-5 font-sans text-[14px] leading-[1.75] text-fg/80">
              {buildAppointmentMessage(booking)}
            </pre>

            <div className="mt-10 flex flex-col items-center gap-4">
              <a
                href={buildAppointmentUrl(booking)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSent(true)}
                className="inline-flex items-center justify-center gap-3 bg-accent px-10 py-4 font-serif text-[18px] uppercase tracking-[0.08em] text-bg transition hover:bg-accent-deep"
              >
                {WHATSAPP_GLYPH}
                Send On WhatsApp
              </a>
              <p className="text-[11px] tracking-[0.14em] uppercase text-dim" aria-live="polite">
                {sent
                  ? "Opened in WhatsApp — press send to confirm."
                  : "Nothing is booked until you press send."}
              </p>
              <button
                type="button"
                onClick={() => go(2)}
                className="text-[11px] tracking-[0.18em] uppercase text-dim transition hover:text-fg cursor-pointer"
              >
                ← Back to details
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
