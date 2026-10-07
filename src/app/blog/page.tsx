import { Suspense } from "react";
import BlogContent from "@/components/blog/BlogContent";
import Navigation from "@/components/header/Navbar";
import { apiClient } from "@/utils/fetch";
import { postsPerPage } from "@/lib/blog-feed-data";
import type { Post } from "@/types/post";
import { Config } from "@/utils/getConfig";
import { toSafeJsonLd } from "@/utils/sanitize";

export const revalidate = 60;

// Page metadata lives in ./layout.tsx (single source of truth) so crawlers
// and social scrapers always see one canonical title/description pair.

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

  const baseUrl = Config.mainbaseurl;
  // Collection signal for search + AI crawlers: the SSR first page as ItemList.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog | pilput",
    url: `${baseUrl}/blog`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: posts.slice(0, postsPerPage).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url:
          post.slug && post.user?.username
            ? `${baseUrl}/${post.user.username}/${post.slug}`
            : `${baseUrl}/blog`,
        ...(post.title ? { name: post.title } : {}),
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toSafeJsonLd(itemListJsonLd) }}
      />
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
