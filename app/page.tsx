import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import Collections from "./components/Collections";
import About from "./components/About";
import Contact from "./components/Contact";
import SellForm from "./components/SellForm";
import FAQ from "./components/FAQ";
import Social from "./components/Social";
import { HOME_FAQS } from "@/lib/faqs";
import { ldJsonGraph, faqLd } from "@/lib/seo";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <Collections />
      <About />
      <Contact />
      <SellForm />
      <FAQ items={HOME_FAQS} />
      <Social />
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
