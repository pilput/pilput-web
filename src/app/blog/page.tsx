import { Suspense } from "react";
import BlogContent from "@/components/blog/BlogContent";
import Navigation from "@/components/header/Navbar";

export default function BlogPage() {
  return (
    <>
      <Navigation />
      <Suspense
        fallback={<div className="min-h-screen bg-background animate-pulse" />}
      >
        <BlogContent />
      </Suspense>
    </>
  );
}
