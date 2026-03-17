import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  return {
    alternates: {
      canonical: `/dashboard/posts/edit/${params.id}`,
    },
  };
}

export default function DashboardPostsEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
