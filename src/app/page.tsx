import Navigation from "@/components/header/Navbar";
import Hero from "@/components/landing/Hero";
import Highlights from "@/components/landing/Highlights";
import Features from "@/components/landing/Features";
import MissionSection from "@/components/landing/Mission";
import CallToAction from "@/components/landing/CallToAction";
import Community from "@/components/landing/Community";
import Footer from "@/components/footer/Footer";
import { Config } from "@/utils/getConfig";

export default function Home() {
  const baseUrl = Config.mainbaseurl;

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "pilput",
    url: baseUrl,
    description:
      "PILPUT is an open publishing platform where anyone can write and share articles with ease. Experience a clean space to express your thoughts and reach readers worldwide.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/blog?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "pilput",
    url: baseUrl,
    logo: `${baseUrl}/pilput.png`,
    description:
      "Open publishing platform for creators. Write and share articles with ease.",
    sameAs: ["https://twitter.com/pilput_dev"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Navigation />
      <main
        id="main-content"
        className="space-y-24 sm:space-y-32 md:space-y-40 lg:space-y-48"
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
