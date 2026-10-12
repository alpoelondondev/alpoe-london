import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  title: "Privacy — How We Record Visits",
  description:
    "What Alpoe London records when you visit this website: pages viewed, session recordings, your IP address and approximate location, and how to contact us about it.",
  path: ROUTES.privacy,
});

const SECTIONS: { title: string; copy: string[] }[] = [
  {
    title: "Every visit is recorded",
    copy: [
      "This website records every visit from the first page you open. We do not ask first, and there is no setting on the site to switch it off.",
      "We use PostHog to do this. It records the pages you view, the order you view them in, and a session recording of how you browse: where you click, how you scroll and how you move between pages.",
    ],
  },
  {
    title: "What is collected",
    copy: [
      "Your IP address, and the approximate country, region and city it points to. This is an estimate, not your exact location.",
      "Your device type, browser, screen size, the site that referred you, and the date and time of your visit.",
      "PostHog and Google Analytics both place cookies on your device to tell one visit from another. Vercel Web Analytics also counts page views, without cookies.",
    ],
  },
  {
    title: "What is hidden",
    copy: [
      "Anything you type into a form on this site is masked in session recordings, and your booking confirmation, including its message and contact details, is blocked from them.",
      "Enquiry, selling and booking forms are not stored by this website. They open WhatsApp with your message, and nothing reaches us until you send it there.",
    ],
  },
  {
    title: "Why we collect it",
    copy: [
      "To see how the site is used, which pages are useful, where visitors come from and where they get stuck, so we can improve it.",
    ],
  },
  {
    title: "Where it goes and how long it is kept",
    copy: [
      "Visit data and session recordings are held by PostHog on servers in the United States. Session recordings are kept for 30 days. Google and Vercel hold the page-view statistics they collect for us.",
      "We do not sell this information.",
    ],
  },
  {
    title: "Your choices",
    copy: [
      "You can block cookies in your browser settings, or use a browser or extension that blocks tracking scripts, and the site will still work.",
      "You can ask us what we hold about your visits, ask us to delete it, or object to it being collected. If you are unhappy with how we respond, you can complain to the Information Commissioner's Office at ico.org.uk.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          title="Privacy"
          copy="This website records every visit. This page says plainly what is recorded, why, and what you can do about it."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Privacy", href: ROUTES.privacy, current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-20 max-md:px-6">
          <div className="max-w-3xl">
            {SECTIONS.map((s) => (
              <div key={s.title} className="mb-12">
                <h2 className="t-sub">{s.title}</h2>
                {s.copy.map((p) => (
                  <p key={p} className="mt-4 t-copy">
                    {p}
                  </p>
                ))}
              </div>
            ))}

            <h2 className="t-sub">Contact</h2>
            <p className="mt-4 t-copy">
              {SITE.name}, {SITE.address.streetAddress},{" "}
              {SITE.address.addressLocality}. Email{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="text-accent hover:text-blush"
              >
                {SITE.email}
              </a>
              .
            </p>
            <p className="mt-10 t-copy">Last updated 12 October 2026.</p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
