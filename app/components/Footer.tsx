import Link from "next/link";
import LockupMark from "./LockupMark";
import { WATCH_BRANDS, JEWELLERY_CATEGORIES } from "@/lib/taxonomy";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

const SHOP_LINKS = [
  { label: "All Watches", href: "/watches" },
  { label: "All Jewellery", href: "/jewellery" },
  { label: "Search", href: "/search" },
];

/*
 * The footer is the site's most reliable crawl path — it is a server
 * component, it renders identically on every route, and until the nav panel
 * was fixed it was the *only* set of links a crawler could see. Two pages that
 * belong here were missing: /rings, which nothing but its own two children
 * linked to, and the lab-grown diamonds guide, which had exactly one crawlable
 * inbound link on the whole site despite being the strongest piece of writing
 * on it.
 */
const HOUSE_LINKS = [
  { label: "Book an Appointment", href: "/book-appointment" },
  { label: "Engagement & Wedding Rings", href: "/rings/engagement-and-wedding-rings" },
  { label: "Ready to Ship Rings", href: "/rings/ready-to-ship" },
  { label: "All Rings", href: "/rings" },
  { label: "Ring Size Guide", href: "/ring-size-guide" },
  { label: "Ring Builder", href: "/ring-builder" },
  { label: "Guides", href: "/guides" },
  { label: "Natural vs Lab-Grown Diamonds", href: "/guides/natural-vs-lab-grown-diamonds" },
  { label: "Bespoke Jewellery", href: "/bespoke" },
  { label: "Sell & Trade", href: "/sell" },
  { label: "Metal Prices", href: "/metal-prices" },
  { label: "Mentorship", href: "/mentorship" },
  { label: "About", href: "/about" },
  { label: "Hallmarking", href: "/hallmarking" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const featuredBrands = WATCH_BRANDS.slice(0, 6);
  const featuredCategories = JEWELLERY_CATEGORIES.slice(0, 6);
  const whatsappUrl = buildGeneralWhatsAppUrl();

  return (
    // Sits on the page ground rather than a panel, so a hairline is the only
    // thing separating it from the section above — hence the explicit border.
    <footer className="border-t border-fg/10 bg-bg text-fg">
      <div className="px-[52px] pt-20 pb-14 max-md:px-6 max-md:pt-14 max-md:pb-10">
        <div className="grid grid-cols-2 gap-12 max-lg:grid-cols-1 max-lg:gap-10">
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              aria-label="Alpoe London — Home"
              className="inline-block"
            >
              {/* Inline rather than the .svg file: that asset is hard-filled
                  near-black and would disappear against this ground. Painted
                  in the house rose to match the monogram in the bar, so the
                  mark reads the same at both ends of the page. */}
              <LockupMark width="min(112px, 38vw)" fill="var(--color-accent)" />
            </Link>
            <p className="t-copy max-w-sm">
              A Hatton Garden dealership sourcing authenticated luxury
              timepieces and bespoke jewellery for collectors worldwide.
            </p>
            <div className="flex items-center gap-5 mt-2">
              <a
                href="https://www.instagram.com/alpoe/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-fg/50 transition hover:text-blush"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@alpoelondon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-fg/50 transition hover:text-blush"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
                </svg>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-fg/50 transition hover:text-[#25D366]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-x-6 gap-y-10 max-sm:grid-cols-2">
          <div>
            <h2 className="t-eyebrow mb-5">
              Watches
            </h2>
            <ul className="flex flex-col gap-3">
              {featuredBrands.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/watches/${b.slug}`}
                    className="text-[13px] text-fg/55 hover:text-blush transition-colors"
                  >
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="t-eyebrow mb-5">
              Jewellery
            </h2>
            <ul className="flex flex-col gap-3">
              {featuredCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={c.href ?? `/jewellery/${c.slug}`}
                    className="text-[13px] text-fg/55 hover:text-blush transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Widest of the three so its links sit two-across without wrapping */}
          <div className="col-span-2 max-sm:col-span-2">
            <h2 className="t-eyebrow mb-5">
              House
            </h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
              {SHOP_LINKS.concat(HOUSE_LINKS).map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-fg/55 hover:text-blush transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 text-[13px] text-fg/55">
              <span className="text-fg/80">Hatton Garden, London</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:text-[#1ebe5d] transition-colors border-b border-[#25D366]/30 pb-[2px] self-start"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div className="px-[52px] py-7 flex justify-between items-center border-t border-fg/10 text-[11px] tracking-[0.1em] uppercase text-fg/45 max-md:px-6 max-md:flex-col max-md:gap-3 max-md:text-center">
        <span>&copy; 2026 Alpoe London</span>
        <span>All references and trademarks are property of their respective owners.</span>
        <span>Hatton Garden, London, UK</span>
      </div>

      <div className="px-[52px] py-4 flex justify-center items-center border-t border-fg/10 text-[11px] tracking-[0.1em] uppercase text-fg/45 max-md:px-6">
        <span>
          Made by{" "}
          <a
            href="https://j0e.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff7a1a] hover:text-[#ff944d] transition-colors"
          >
            J0E.DEV
          </a>
        </span>
      </div>
    </footer>
  );
}
