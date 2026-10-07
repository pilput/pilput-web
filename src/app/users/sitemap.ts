import type { MetadataRoute } from "next";
import { Config } from "@/utils/getConfig";

// Constants
const SITEMAP_REVALIDATE_SECONDS = 3600; // 1 hour
const WRITER_CHANGE_FREQUENCY = "weekly" as const;
const WRITER_PRIORITY = 0.6;

interface WriterSitemapItem {
  username: string;
  updated_at?: string;
  created_at?: string;
}

interface WritersResponse {
  data?: WriterSitemapItem[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(`${Config.apibaseurl}/api/users/sitemap`, {
      next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error(`Writers sitemap fetch failed with status: ${response.status}`);
      return [];
    }

    const writersResponse: WritersResponse = await response.json();
    const writers = Array.isArray(writersResponse.data) ? writersResponse.data : [];

    return writers
      .filter((writer): writer is WriterSitemapItem => Boolean(writer.username))
      .map((writer) => ({
        url: `${Config.mainbaseurl}/${encodeURIComponent(writer.username)}`,
        lastModified: writer.updated_at
          ? new Date(writer.updated_at)
          : writer.created_at
            ? new Date(writer.created_at)
            : new Date(),
        changeFrequency: WRITER_CHANGE_FREQUENCY,
        priority: WRITER_PRIORITY,
      }));
  } catch (error) {
    console.error("Error generating writers sitemap:", error);
    return [];
  }
}
