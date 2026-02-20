import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const rawTag = params.tag;
  const decodedTag = decodeURIComponent(rawTag);
  const normalizedTag = decodedTag.replace(/-/g, " ");

  return {
    title: `Tag: #${normalizedTag}`,
    description: `Read posts tagged with #${normalizedTag} on pilput.`,
    alternates: {
      canonical: `/tags/${encodeURIComponent(rawTag)}`,
    },
    openGraph: {
      title: `Tag: #${normalizedTag}`,
      description: `Read posts tagged with #${normalizedTag} on pilput.`,
      url: `/tags/${encodeURIComponent(rawTag)}`,
      type: "website",
    },
  };
}

export default function TagLayout({ children }: { children: React.ReactNode }) {
  return children;
}
