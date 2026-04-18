import Navigation from "@/components/header/Navbar";
import AboutContent from "@/components/landing/AboutContent";
import AboutMe from "@/components/landing/AboutMe";
import MissionSection from "@/components/landing/Mission";
import Social from "@/components/landing/Social";
import Footer from "@/components/footer/Footer";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata = publicPageMetadata({
  title: "About pilput",
  description:
    "Learn more about pilput, our mission, and how we help creators publish and grow their audience.",
  canonicalPath: "/about",
  keywords: [
    "about pilput",
    "mission",
    "publishing platform",
    "content creators",
    "team",
  ],
  openGraphTitle: "About pilput - Our Mission & Story",
});

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
