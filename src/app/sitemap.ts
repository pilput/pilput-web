import type { MetadataRoute } from "next";
import { Config } from "@/utils/getConfig";

interface PostSitemapItem {
  slug?: string;
  updated_at?: string;
  created_at?: string;
  user?: {
    username?: string;
  };
}

interface PostsResponse {
  data?: PostSitemapItem[];
}

const publicRoutes = ["/", "/about", "/blog", "/contact", "/forum", "/privacy", "/tags"];

async function getPostEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(`${Config.apibaseurl}/v1/posts?limit=200&offset=0`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const result = (await response.json()) as PostsResponse;
    const posts = Array.isArray(result.data) ? result.data : [];

    return posts
      .filter((post) => post.user?.username && post.slug)
      .map((post) => ({
        url: `${Config.mainbaseurl}/${post.user!.username}/${post.slug}`,
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: `${Config.mainbaseurl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : route === "/blog" ? 0.9 : 0.8,
  }));

  const postEntries = await getPostEntries();
  return [...staticEntries, ...postEntries];
}
