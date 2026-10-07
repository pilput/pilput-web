import type { MetadataRoute } from "next";
import { Config } from "@/utils/getConfig";

// Constants
const SITEMAP_REVALIDATE_SECONDS = 3600; // 1 hour
const GUILD_CHANGE_FREQUENCY = "weekly" as const;
const GUILD_PRIORITY = 0.6;

interface GuildSitemapItem {
  slug: string;
  updated_at?: string;
  created_at?: string;
}

interface GuildsResponse {
  data?: GuildSitemapItem[];
}

async function fetchGuildSlugs(): Promise<GuildSitemapItem[]> {
  // Preferred: dedicated sitemap endpoint (mirrors posts/tags sitemaps).
  try {
    const response = await fetch(`${Config.apibaseurl}/api/guilds/sitemap`, {
      next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
    });
    if (response.ok) {
      const body: GuildsResponse = await response.json();
      if (Array.isArray(body.data) && body.data.length > 0) return body.data;
    }
  } catch {
    // Fall through to the public directory listing below.
  }

  // Fallback: public guild directory (private guilds are never listed).
  const response = await fetch(
    `${Config.apibaseurl}/api/guilds?limit=100&offset=0`,
    { next: { revalidate: SITEMAP_REVALIDATE_SECONDS } },
  );
  if (!response.ok) {
    console.error(`Guilds sitemap fetch failed with status: ${response.status}`);
    return [];
  }
  const body: GuildsResponse = await response.json();
  return Array.isArray(body.data) ? body.data : [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const guilds = await fetchGuildSlugs();

    return guilds
      .filter((guild): guild is GuildSitemapItem => Boolean(guild.slug))
      .map((guild) => ({
        url: `${Config.mainbaseurl}/guilds/${encodeURIComponent(guild.slug)}`,
        lastModified: guild.updated_at
          ? new Date(guild.updated_at)
          : guild.created_at
            ? new Date(guild.created_at)
            : new Date(),
        changeFrequency: GUILD_CHANGE_FREQUENCY,
        priority: GUILD_PRIORITY,
      }));
  } catch (error) {
    console.error("Error generating guilds sitemap:", error);
    return [];
  }
}
