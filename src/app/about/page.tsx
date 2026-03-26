import Navigation from "@/components/header/Navbar";
import AboutContent from "@/components/landing/AboutContent";
import AboutMe from "@/components/landing/AboutMe";
import MissionSection from "@/components/landing/Mission";
import Social from "@/components/landing/Social";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import { Config } from "@/utils/getConfig";

const siteUrl = Config.mainbaseurl;

export const metadata: Metadata = {
  title: "About pilput",
  description:
    "Learn more about pilput, our mission, and how we help creators publish and grow their audience.",
  keywords: ["about pilput", "mission", "publishing platform", "content creators", "team"],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteUrl}/about`,
    title: "About pilput - Our Mission & Story",
    description:
      "Learn more about pilput, our mission, and how we help creators publish and grow their audience.",
    siteName: "pilput",
    images: [
      {
        url: "/pilput.png",
        width: 512,
        height: 512,
        alt: "About pilput",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About pilput - Our Mission & Story",
    description:
      "Learn more about pilput, our mission, and how we help creators publish and grow their audience.",
    images: ["/pilput.png"],
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
