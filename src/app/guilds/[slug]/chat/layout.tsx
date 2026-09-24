import type { Metadata } from "next";
import { ChatGate } from "./ChatGate";

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

export default async function GuildChatLayout(props: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  return <ChatGate slug={slug}>{props.children}</ChatGate>;
}
