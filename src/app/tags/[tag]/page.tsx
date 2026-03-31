import Navigation from "@/components/header/Navbar";
import { apiClientApp } from "@/utils/fetch";
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
    const { data } = await apiClientApp.get<PostsResponse>(`/v1/posts/tag/${tag}`, {
      params: { limit: postsPerPage, offset: 0 },
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
    const response = await apiClientApp.get("/v1/tags");
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

  return (
    <>
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
