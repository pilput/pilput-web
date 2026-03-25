import Navigation from "@/components/header/Navbar";
import BlogContent from "@/components/blog/BlogContent";
import { axiosInstance } from "@/utils/fetch";
import type { Post } from "@/types/post";

const postsPerPage = 10;

export const revalidate = 30;

interface PostsResponse {
  data: Post[];
  meta?: { total_items: number };
  total?: number;
}

async function fetchInitialPosts(): Promise<{ posts: Post[]; total: number }> {
  try {
    const { data } = await axiosInstance.get<PostsResponse>("/v1/posts", {
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

async function fetchTrendingTags(): Promise<string[]> {
  try {
    const { data } = await axiosInstance.get("/v1/tags");
    return data.data.map((tag: { name: string }) => tag.name);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return ["ai", "nextjs", "typescript", "webdev", "react", "javascript"];
  }
}

export default async function BlogPage() {
  const [{ posts, total }, trendingTags] = await Promise.all([
    fetchInitialPosts(),
    fetchTrendingTags(),
  ]);

  return (
    <>
      <Navigation />
      <BlogContent
        initialPosts={posts}
        initialTotal={total}
        postsPerPage={postsPerPage}
        trendingTags={trendingTags}
      />
    </>
  );
}
