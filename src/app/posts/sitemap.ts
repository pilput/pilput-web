import type { MetadataRoute } from "next";
import { Config } from "@/utils/getConfig";

// Constants
const SITEMAP_REVALIDATE_SECONDS = 3600; // 1 hour
const POST_CHANGE_FREQUENCY = "weekly" as const;
const POST_PRIORITY = 0.7;

interface PostSitemapItem {
  slug: string;
  username: string;
  updated_at?: string;
  created_at?: string;
}

interface PostsResponse {
  data?: PostSitemapItem[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(`${Config.apibaseurl2}/v1/posts/sitemap`, {
      next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error(`Sitemap fetch failed with status: ${response.status}`);
      return [];
    }

    const postsResponse: PostsResponse = await response.json();
    const posts = Array.isArray(postsResponse.data) ? postsResponse.data : [];

    return posts
      .filter((post): post is PostSitemapItem => 
        Boolean(post.username && post.slug)
      )
      .map((post) => ({
        url: `${Config.mainbaseurl}/${post.username}/${post.slug}`,
        lastModified: post.updated_at
          ? new Date(post.updated_at)
          : post.created_at
            ? new Date(post.created_at)
            : new Date(),
        changeFrequency: POST_CHANGE_FREQUENCY,
        priority: POST_PRIORITY,
      }));
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}

