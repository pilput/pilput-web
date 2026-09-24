import ChatIndexClient from "./ChatIndexClient";

export default async function GuildChatIndexPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  return <ChatIndexClient slug={slug} />;
}
