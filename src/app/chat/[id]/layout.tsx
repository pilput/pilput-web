import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  return {
    alternates: {
      canonical: `/chat/${params.id}`,
    },
  };
}

export default function ChatIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
