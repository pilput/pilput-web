import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/public-metadata";
import { apiClient } from "@/utils/fetch";
import type { Guild } from "@/types/guild";
import GuildDetailClient from "./GuildDetailClient";

export const revalidate = 30;

/**
 * Anonymous fetch for SSR and metadata. A private guild answers 404 to anyone
 * who is not a member, so `null` here does not mean the guild is missing — the
 * client re-fetches with the viewer's token and decides what to render.
 */
async function fetchGuild(slug: string): Promise<Guild | null> {
  try {
    const { data } = await apiClient.get<{ data?: Guild }>(
      `/api/guilds/${encodeURIComponent(slug)}`,
    );
    return data?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const guild = await fetchGuild(slug);

  if (!guild) {
    return publicPageMetadata({
      title: "Guild",
      description: "A community on pilput.",
      canonicalPath: `/guilds/${slug}`,
      robots: { index: false, follow: true },
    });
  }

  return publicPageMetadata({
    title: guild.name,
    description:
      guild.description ||
      `${guild.name} is a community on pilput with ${guild.member_count} members.`,
    canonicalPath: `/guilds/${guild.slug}`,
    keywords: ["guild", "community", guild.name, "pilput"],
    openGraphTitle: `${guild.name} | pilput`,
  });
}

export default async function GuildPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const guild = await fetchGuild(slug);

  return <GuildDetailClient slug={slug} initialGuild={guild} />;
}
