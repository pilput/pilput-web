import { Suspense } from "react";
import BlogContent from "@/components/blog/BlogContent";
import Navigation from "@/components/header/Navbar";
import { apiClient } from "@/utils/fetch";
import { postsPerPage } from "@/lib/blog-feed-data";
import type { Post } from "@/types/post";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog - Latest Articles and Stories",
  description:
    "Explore latest articles, thoughts, tutorials, and discussions written by the pilput community.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | pilput",
    description:
      "Explore latest articles, thoughts, tutorials, and discussions written by the pilput community.",
    url: "/blog",
  },
};

async function getInitialBlogData(): Promise<{
  posts: Post[];
  total: number;
  tags: string[];
}> {
  try {
    const [postsRes, tagsRes] = await Promise.allSettled([
      apiClient.get<{ data?: Post[]; meta?: { total_items?: number }; total?: number }>(
        "/api/posts",
        {
          params: { limit: postsPerPage, offset: 0 },
        }
      ),
      apiClient.get<{ data?: Array<{ name: string }> }>("/api/tags/trending"),
    ]);

    let posts: Post[] = [];
    let total = 0;
    let tags: string[] = [];

    if (postsRes.status === "fulfilled" && postsRes.value.data?.data) {
      posts = postsRes.value.data.data;
      total =
        postsRes.value.data.meta?.total_items ??
        postsRes.value.data.total ??
        posts.length;
    }

    if (tagsRes.status === "fulfilled" && tagsRes.value.data?.data) {
      tags = tagsRes.value.data.data.map((t) => t.name);
    }

    return { posts, total, tags };
  } catch {
    return { posts: [], total: 0, tags: [] };
  }
}

export default async function BlogPage() {
  const { posts, total, tags } = await getInitialBlogData();

  return (
    <>
      <Navigation />
      <Suspense
        fallback={<div className="min-h-screen bg-background animate-pulse" />}
      >
        <BlogContent
          initialPosts={posts}
          initialTotal={total}
          initialTags={tags}
        />
      </Suspense>
    </>
  );
}
