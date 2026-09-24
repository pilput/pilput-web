import { GuildWorkspace } from "./GuildWorkspace";

export default async function GuildLayout(props: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  return <GuildWorkspace slug={slug}>{props.children}</GuildWorkspace>;
}
