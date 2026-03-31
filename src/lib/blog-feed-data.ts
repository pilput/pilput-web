import { apiClient } from "@/utils/fetch";
import type { Post } from "@/types/post";

export const postsPerPage = 10;

interface PostsResponse {
  data: Post[];
  meta?: { total_items: number };
  total?: number;
}

export async function fetchInitialPosts(): Promise<{
  posts: Post[];
  total: number;
}> {
  try {
    const { data } = await apiClient.get<PostsResponse>("/v1/posts", {
      params: { limit: postsPerPage, offset: 0 },
    });

    return {
      posts: data.data || [],
      total: data.meta?.total_items || data.total || 0,
    };
  } catch (error) {
    console.error("Error fetching initial posts:", error);
    return { posts: [], total: 0 };
  }
}

export async function fetchTrendingTags(): Promise<string[]> {
  try {
    const { data } = await apiClient.get("/v1/tags");
    return data.data.map((tag: { name: string }) => tag.name);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return ["ai", "nextjs", "typescript", "webdev", "react", "javascript"];
  }
}
