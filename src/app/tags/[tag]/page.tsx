import Navigation from "@/components/header/Navbar";
import { apiClient } from "@/utils/fetch";
import { Config } from "@/utils/getConfig";
import { toSafeJsonLd } from "@/utils/sanitize";
import type { Post } from "@/types/post";
import TagContent from "./TagContent";

const postsPerPage = 10;

export const revalidate = 30;

interface PostsResponse {
  data: Post[];
  meta?: { total_items: number };
  total?: number;
}

async function fetchPostsByTag(tag: string): Promise<{ posts: Post[]; total: number }> {
  try {
    const { data } = await apiClient.get<PostsResponse>("/api/posts", {
      params: { tags: tag, limit: postsPerPage, offset: 0 },
    });
    return {
      posts: data.data || [],
      total: data.meta?.total_items || data.total || 0,
    };
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    return { posts: [], total: 0 };
  }
}

async function fetchAllTags(): Promise<string[]> {
  try {
    const response = await apiClient.get("/api/tags");
    return response.data.data.map((tagItem: { name: string }) => tagItem.name);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

export default async function TagPage(props: {
  params: Promise<{ tag: string }>;
}) {
  const params = await props.params;
  const tag = params.tag;
  const { posts, total } = await fetchPostsByTag(tag);
  const allTags = await fetchAllTags();
  const relatedTags = allTags.filter((t) => t !== tag).slice(0, 10);

  const baseUrl = Config.mainbaseurl;
  let decodedTag = tag;
  try {
    decodedTag = decodeURIComponent(tag);
  } catch {
    // Keep the raw segment if it is not valid URI encoding.
  }
  // Collection signal for search + AI crawlers.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `#${decodedTag} | pilput`,
    url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: posts.slice(0, postsPerPage).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url:
          post.slug && post.user?.username
            ? `${baseUrl}/${post.user.username}/${post.slug}`
            : `${baseUrl}/tags/${encodeURIComponent(tag)}`,
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
      <TagContent
        key={tag}
        tag={tag}
        initialPosts={posts}
        initialTotal={total}
        relatedTags={relatedTags}
        postsPerPage={postsPerPage}
      />
    </>
  );
}
