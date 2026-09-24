import type { Metadata } from "next";
import Navigation from "@/components/header/Navbar";
import GuildChatClient from "./GuildChatClient";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  return {
    title: "Guild chat",
    alternates: { canonical: `/guilds/${slug}/chat` },
    // Members-only content: nothing here is worth indexing.
    robots: { index: false, follow: false },
  };
}

export default async function GuildChatPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Navigation />
      <main className="flex-1 min-h-0 w-full">
        <GuildChatClient slug={slug} />
      </main>
    </div>
  );
}
