import Navigation from "@/components/header/Navbar";
import AboutContent from "@/components/landing/About";
import AboutMe from "@/components/landing/AboutMe";
import MissionSection from "@/components/landing/Mission";
import Social from "@/components/landing/Social";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about pilput, our mission, and how we help creators publish and grow their audience.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <AboutContent />
      <AboutMe />
      <MissionSection />
      <Social />
      <Footer />
    </>
  );
}
