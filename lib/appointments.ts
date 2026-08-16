import { buildGeneralWhatsAppUrl } from "./whatsapp";

/**
 * The showroom diary, as far as the website is concerned.
 *
 * Nothing here talks to a real calendar — the booking flow composes a written
 * request and hands it to WhatsApp, the same way every other enquiry on the
 * site travels. So the slot grid is an *offer*, not availability: it keeps the
 * customer's request inside hours we can actually honour, and the team confirms
 * the slot in the thread.
 */

export type AppointmentType = {
  slug: string;
  name: string;
  blurb: string;
  minutes: number;
};

export const APPOINTMENT_TYPES: AppointmentType[] = [
  {
    slug: "engagement-ring",
    name: "Engagement Ring Consultation",
    blurb:
      "Browse diamonds, try settings, and design your dream ring with our experts.",
    minutes: 60,
  },
  {
    slug: "bespoke",
    name: "Bespoke / Custom Design",
    blurb: "Bring your ideas — we'll sketch, source stones, and craft your vision.",
    minutes: 90,
  },
  {
    slug: "watches",
    name: "Luxury Watch Consultation",
    blurb: "View our curated collection of Rolex, AP, Patek Philippe and more.",
    minutes: 45,
  },
  {
    slug: "showroom",
    name: "General Showroom Visit",
    blurb: "Explore our jewellery, bullion, and collections with no commitment.",
    minutes: 30,
  },
];

export function appointmentType(slug: string | null | undefined) {
  return APPOINTMENT_TYPES.find((t) => t.slug === slug) ?? null;
}

/** Counter hours the grid is cut from: Monday–Saturday, 10:00 to 18:00. */
const OPEN_MINUTES = 10 * 60;
const CLOSE_MINUTES = 18 * 60;
/** Slots start on the half hour. */
const SLOT_STEP = 30;
/** Same-day requests need enough notice for someone to see the message. */
const LEAD_MINUTES = 120;
/** How far ahead the picker offers dates. */
const HORIZON_DAYS = 28;

export type BookingDay = {
  /** YYYY-MM-DD, the value the rest of the flow passes around. */
  iso: string;
  weekday: string;
  day: string;
  month: string;
};

function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/** Midday, so a timezone shift can never roll the date onto its neighbour. */
function fromIso(iso: string) {
  return new Date(`${iso}T12:00:00`);
}

/**
 * Start times that fit a visit of `minutes` inside the day, newest constraint
 * first: the appointment has to finish before we close, and a slot today has to
 * be far enough out that the team can still answer.
 */
export function slotsFor(minutes: number, dayIso: string, now: Date = new Date()): string[] {
  const last = CLOSE_MINUTES - minutes;
  const isToday = dayIso === toIso(now);
  const earliest = isToday
    ? Math.max(OPEN_MINUTES, now.getHours() * 60 + now.getMinutes() + LEAD_MINUTES)
    : OPEN_MINUTES;

  const out: string[] = [];
  for (let m = OPEN_MINUTES; m <= last; m += SLOT_STEP) {
    if (m < earliest) continue;
    out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return out;
}

/**
 * The next four weeks of openable days for a given appointment length. Sundays
 * are closed, and a day with nothing left in it (today, late on) drops out
 * rather than showing an empty slot grid.
 */
export function bookingDays(minutes: number, from: Date = new Date()): BookingDay[] {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const out: BookingDay[] = [];

  for (let i = 0; i < HORIZON_DAYS; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d.getDay() === 0) continue; // Sunday — closed
    const iso = toIso(d);
    if (!slotsFor(minutes, iso, from).length) continue;
    out.push({
      iso,
      weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
      day: String(d.getDate()),
      month: d.toLocaleDateString("en-GB", { month: "short" }),
    });
  }
  return out;
}

/** "14:30" → "2:30pm" */
export function formatSlot(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h < 12 ? "am" : "pm";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")}${period}`;
}

/** "2026-08-18" → "Tuesday 18 August 2026" */
export function formatBookingDate(iso: string) {
  return fromIso(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export type BookingRequest = {
  type: AppointmentType;
  dateIso: string;
  time: string;
  name: string;
  contact: string;
  guests?: string;
  budget?: string;
  notes?: string;
};

/**
 * The message the customer sends. Written as labelled lines rather than prose
 * so the counter can read the whole booking at a glance and paste it straight
 * into the diary.
 */
export function buildAppointmentMessage(b: BookingRequest): string {
  const lines = [
    "Hi Alpoe, I'd like to book an appointment.",
    "",
    `Appointment: ${b.type.name}`,
    `Length: ${b.type.minutes} min`,
    `Date: ${formatBookingDate(b.dateIso)}`,
    `Time: ${formatSlot(b.time)}`,
    `Name: ${b.name.trim()}`,
    `Contact: ${b.contact.trim()}`,
  ];
  if (b.guests?.trim()) lines.push(`Visitors: ${b.guests.trim()}`);
  if (b.budget?.trim()) lines.push(`Budget: ${b.budget.trim()}`);
  if (b.notes?.trim()) lines.push(`Notes: ${b.notes.trim()}`);
  lines.push("", "Please confirm this slot works and I'll see you at the showroom.");
  return lines.join("\n");
}

export function buildAppointmentUrl(b: BookingRequest): string {
  return buildGeneralWhatsAppUrl(buildAppointmentMessage(b));
}
