import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/public-metadata";

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const rawTag = params.tag;
  const decodedTag = decodeURIComponent(rawTag);
  const normalizedTag = decodedTag.replace(/-/g, " ");
  const canonicalPath = `/tags/${encodeURIComponent(rawTag)}`;
  const description = `Read posts tagged with #${normalizedTag} on pilput.`;

  return publicPageMetadata({
    title: `Tag: #${normalizedTag}`,
    description,
    canonicalPath,
    keywords: [normalizedTag, "pilput", "tags", "articles"],
    openGraphTitle: `#${normalizedTag} | pilput`,
  });
}

export default function TagLayout({ children }: { children: React.ReactNode }) {
  return children;
}
