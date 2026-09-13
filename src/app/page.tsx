import Navbar from "@/components/header/Navbar";
import SkipToContent from "@/components/a11y/SkipToContent";
import Hero from "@/components/landing/Hero";
import Highlights from "@/components/landing/Highlights";
import Features from "@/components/landing/Features";
import LandingMotionObserver from "@/components/landing/LandingMotionObserver";
import CallToAction from "@/components/landing/CallToAction";
import Community from "@/components/landing/Community";
import Footer from "@/components/footer/Footer";
import { Config } from "@/utils/getConfig";
import { toSafeJsonLd } from "@/utils/sanitize";

/**
 * Guest landing page only — logged-in visitors are rewritten (URL stays "/")
 * to /feed-home by middleware.ts before this ever renders. That keeps this
 * route fully static/cacheable for crawlers and anonymous traffic.
 */
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
        dangerouslySetInnerHTML={{ __html: toSafeJsonLd(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toSafeJsonLd(organizationJsonLd) }}
      />
      <SkipToContent />
      <Navbar />
      <main id="main-content">
        <LandingMotionObserver />
        <Hero />
        <Highlights />
        <Features />
        <Community />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
