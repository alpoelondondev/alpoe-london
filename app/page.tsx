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
import Social from "./components/Social";
import FindUs from "./components/FindUs";
import { HOME_FAQS } from "@/lib/faqs";
import { ldJsonGraph, faqLd } from "@/lib/seo";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

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
      <Social />
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
