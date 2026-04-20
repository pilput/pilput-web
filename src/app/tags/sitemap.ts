import type { MetadataRoute } from "next";
import { Config } from "@/utils/getConfig";

// Constants
const SITEMAP_REVALIDATE_SECONDS = 3600; // 1 hour
const TAG_CHANGE_FREQUENCY = "weekly" as const;
const TAG_PRIORITY = 0.6;

interface TagSitemapItem {
  name: string;
  created_at?: string;
}

interface TagsResponse {
  data?: TagSitemapItem[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(`${Config.apibaseurl}/v1/tags`, {
      next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error(`Tags sitemap fetch failed with status: ${response.status}`);
      return [];
    }

    const tagsResponse: TagsResponse = await response.json();
    const tags = Array.isArray(tagsResponse.data) ? tagsResponse.data : [];

    return tags
      .filter((tag): tag is TagSitemapItem => Boolean(tag.name))
      .map((tag) => ({
        url: `${Config.mainbaseurl}/tags/${tag.name}`,
        lastModified: tag.created_at ? new Date(tag.created_at) : new Date(),
        changeFrequency: TAG_CHANGE_FREQUENCY,
        priority: TAG_PRIORITY,
      }));
  } catch (error) {
    console.error("Error generating tags sitemap:", error);
    return [];
  }
}
