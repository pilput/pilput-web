import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dashboard/posts/create",
  },
};

export default function DashboardPostsCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
