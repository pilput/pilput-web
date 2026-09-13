import { Suspense } from "react";
import Navbar from "@/components/header/Navbar";
import HomeFeedContent from "@/components/home/HomeFeedContent";
import { postsPerPage } from "@/lib/blog-feed-data";
import type { Metadata } from "next";

/** Only reachable via the "/" rewrite in middleware.ts for logged-in visitors. */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function FeedHome() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={<div className="min-h-screen bg-background animate-pulse" />}
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
