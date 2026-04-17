import { Suspense } from "react";
import { cookies } from "next/headers";
import Navigation from "@/components/header/Navbar";
import Hero from "@/components/landing/Hero";
import Highlights from "@/components/landing/Highlights";
import Features from "@/components/landing/Features";
import CallToAction from "@/components/landing/CallToAction";
import Community from "@/components/landing/Community";
import Footer from "@/components/footer/Footer";
import HomeFeedContent from "@/components/home/HomeFeedContent";
import { Config } from "@/utils/getConfig";
import { postsPerPage } from "@/lib/blog-feed-data";

/** Cookie read per request — needed to branch guest (SSR landing) vs logged-in (client feed only) */
export const dynamic = "force-dynamic";

export default async function Home() {
  const isLoggedIn = Boolean((await cookies()).get("token")?.value);

  if (isLoggedIn) {
    return (
      <>
        <Navigation />
        <Suspense
          fallback={
            <div className="min-h-screen bg-background animate-pulse" />
          }
        >
          <HomeFeedContent
            initialPosts={[]}
            initialTotal={0}
            postsPerPage={postsPerPage}
          />
        </Suspense>
      </>
    );
  }

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
      <main id="main-content">
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
