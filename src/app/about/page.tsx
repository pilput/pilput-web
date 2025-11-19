import Navigation from "@/components/header/Navbar";
import AboutContent from "@/components/landing/About";
import MissionSection from "@/components/landing/Mission";
import Social from "@/components/landing/Social";
import Footer from "@/components/footer/Footer";

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <AboutContent />
      <MissionSection />
      <Social />
      <Footer />
    </>
  );
}
