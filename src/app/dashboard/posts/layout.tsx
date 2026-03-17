import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dashboard/posts",
  },
};

export default function DashboardPostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
