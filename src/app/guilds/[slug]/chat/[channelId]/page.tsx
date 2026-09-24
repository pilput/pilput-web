import ChannelView from "../ChannelView";

export default async function GuildChannelPage(props: {
  params: Promise<{ slug: string; channelId: string }>;
}) {
  const { slug, channelId } = await props.params;
  return <ChannelView slug={slug} channelId={channelId} />;
}
