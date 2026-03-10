import type { MetadataRoute } from "next";
import { Config } from "@/utils/getConfig";

interface PostSitemapItem {
  slug?: string;
  username?: string;
  updated_at?: string;
  created_at?: string;
}

interface PostsResponse {
  data?: PostSitemapItem[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(`${Config.apibaseurl3}/posts/sitemap`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const result = (await response.json()) as PostsResponse;
    const posts = Array.isArray(result.data) ? result.data : [];

    return posts
      .filter((post) => post.username && post.slug)
      .map((post) => ({
        url: `${Config.mainbaseurl}/${post.username}/${post.slug}`,
        lastModified: post.updated_at
          ? new Date(post.updated_at)
          : post.created_at
            ? new Date(post.created_at)
            : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}

