import type { Metadata, Viewport } from "next";
import {
  Bebas_Neue,
  DM_Sans,
  Open_Sans,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
// Splash screen temporarily disabled — re-enable by uncommenting this import
// and the <Loader /> below. Hero detects the missing #loader and reveals
// itself on mount, so nothing else needs changing either way.
// import Loader from "./components/Loader";
import CustomCursor from "./components/CustomCursor";
import SiteLDJSON from "./components/SiteLDJSON";
import { SITE, siteUrl } from "@/lib/site";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const dmSans = DM_Sans({
  // 500 carries the hero's scrambling eyebrow, which is rose on off-black at
  // around 12px on a phone — too little contrast to read at the body's 300.
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

// The two faces of the hero lockup. Only eleven letters are set in them, so
// both are pinned to the single weight the artwork uses rather than loading a
// range.
const playfairDisplay = Playfair_Display({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const openSans = Open_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-open-sans",
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
      className={`${bebasNeue.variable} ${dmSans.variable} ${playfairDisplay.variable} ${openSans.variable}`}
    >
      <body>
        <SiteLDJSON />
        <CustomCursor />
        {/* <Loader /> */}
        {children}
      </body>
    </html>
  );
}
