import type { Metadata, Viewport } from "next";
import { Open_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
// Splash screen temporarily disabled — re-enable by uncommenting this import
// and the <Loader /> below. Hero detects the missing #loader and reveals
// itself on mount, so nothing else needs changing either way.
// import Loader from "./components/Loader";
import CustomCursor from "./components/CustomCursor";
import SiteLDJSON from "./components/SiteLDJSON";
import { SITE, siteUrl } from "@/lib/site";

/**
 * Open Sans carries the whole site — body, headings, labels, everything.
 *
 * It previously ran alongside Bebas Neue for display and DM Sans for body, and
 * both of those are now gone: nothing outside the logo is set in anything else,
 * so loading them would be two font families downloaded for no one. The
 * upside of the consolidation is that this is now the only UI font on the page.
 *
 * It needs the full range that the two retired faces covered between them —
 * 300 for body copy, which `body` sets as its default, up through 700 for
 * headings that used to lean on a condensed display face for their weight.
 */
const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-open-sans",
});

// The logo is the one exception. Its artwork is set in Playfair, and only
// eleven letters are, so it stays pinned to the single weight the lockup uses
// rather than loading a range.
const playfairDisplay = Playfair_Display({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name} — Luxury Watches & Bespoke Jewellery, Hatton Garden`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.tagline,
  applicationName: SITE.name,
  keywords: [
    "luxury watches London",
    "Rolex Hatton Garden",
    "Patek Philippe dealer",
    "Audemars Piguet London",
    "bespoke engagement rings",
    "Hatton Garden jeweller",
    "diamond pendants London",
  ],
  alternates: { canonical: siteUrl() },
  icons: {
    icon: "/alpoe-london-logo-transparent.svg",
    shortcut: "/alpoe-london-logo-transparent.svg",
    apple: "/alpoe-london-logo-transparent.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl(),
    siteName: SITE.name,
    title: `${SITE.name} — Luxury Watches & Bespoke Jewellery`,
    description: SITE.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Luxury Watches & Bespoke Jewellery`,
    description: SITE.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#131010",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${openSans.variable} ${playfairDisplay.variable}`}
    >
      {/*
        Browser extensions write attributes onto <body> before React hydrates —
        ColorZilla adds `cz-shortcut-listen`, password managers and grammar
        tools do similar — and React then reports a hydration mismatch it can
        never reconcile, because the markup genuinely differs from what the
        server sent. In development that surfaces as a full-screen error
        overlay, which makes the page look broken when nothing is wrong with it.

        `suppressHydrationWarning` is scoped to this element's own attributes
        and does not extend to its children, so our own markup is still checked
        as strictly as before. This is the case the flag exists for.
      */}
      <body suppressHydrationWarning>
        <SiteLDJSON />
        <CustomCursor />
        {/* <Loader /> */}
        {children}
      </body>
    </html>
  );
}
