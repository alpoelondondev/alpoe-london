import type { Metadata } from "next";
import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Collections from "./components/Collections";
import CategoryGrid from "./components/CategoryGrid";
import About from "./components/About";
import FeatureCards from "./components/FeatureCards";
import MentorshipStrip from "./components/MentorshipStrip";
import MerchandiseStrip from "./components/MerchandiseStrip";
import Contact from "./components/Contact";
import SellForm from "./components/SellForm";
import FAQ from "./components/FAQ";
import FindUs from "./components/FindUs";
import { HOME_FAQS } from "@/lib/faqs";
import { ldJsonGraph, faqLd, pageMetadata } from "@/lib/seo";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

/**
 * The homepage was the one route on the site with no metadata of its own. It
 * fell back to the layout defaults, which meant its description was the
 * 75-character brand tagline — no location, no product, nothing a search
 * result could use to argue for the click, and comfortably short of the ~155
 * characters Google will happily show. Everything the business actually sells
 * was absent from the one snippet most people see first.
 *
 * The brand is written into the title by hand here. The layout's
 * "%s | Alpoe London" template applies to child segments and not to the root
 * page, so a bare title on the homepage — the one page where the brand most
 * needs to appear — would have shipped without it. Location first: "Hatton
 * Garden" is the strongest term this business can claim, and leading with a
 * name nobody is searching for yet spends the best position in the tag on
 * nothing. 60 characters exactly.
 */
export const metadata: Metadata = pageMetadata({
  title: "Hatton Garden Bespoke Jeweller & Watch Dealer | Alpoe London",
  description:
    "Bespoke engagement rings, wedding rings and diamond jewellery made to order in Hatton Garden, plus authenticated Rolex, Patek Philippe and Audemars Piguet.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <Marquee />
      <Collections />
      <CategoryGrid />
      <About />
      <FeatureCards />
      <MentorshipStrip />
      <Contact />
      <SellForm />
      <FAQ items={HOME_FAQS} />
      <MerchandiseStrip />
      <FindUs />
      <Footer />
      <WhatsAppButton />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ldJsonGraph([faqLd(HOME_FAQS)])),
        }}
      />
    </>
  );
}
