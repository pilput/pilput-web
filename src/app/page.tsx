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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "pilput",
    url: Config.mainbaseurl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${Config.mainbaseurl}/blog?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
