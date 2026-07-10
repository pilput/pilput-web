import Navbar from "@/components/header/Navbar";
import AboutContent from "@/components/about/AboutContent";
import AboutMe from "@/components/about/AboutMe";
import MissionSection from "@/components/about/Mission";
import Social from "@/components/about/Social";
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
      <Navbar />
      <AboutContent />
      <AboutMe />
      <MissionSection />
      <Social />
      <Footer />
    </>
  );
}
