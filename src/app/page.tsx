import Navigation from "@/components/header/Navbar";
import Hero from "@/components/landing/Hero";
import Highlights from "@/components/landing/Highlights";
import Features from "@/components/landing/Features";
import MissionSection from "@/components/landing/Mission";
import CallToAction from "@/components/landing/CallToAction";
import Community from "@/components/landing/Community";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main
        id="main-content"
        className="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-28"
      >
        <Hero />
        <Highlights />
        <Features />
        <MissionSection />
        <Community />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
