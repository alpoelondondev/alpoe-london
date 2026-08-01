import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import Collections from "./components/Collections";
import About from "./components/About";
import Contact from "./components/Contact";
import SellForm from "./components/SellForm";
import Social from "./components/Social";
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
      <Social />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
