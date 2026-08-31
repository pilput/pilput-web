import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dashboard/tags",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardTagsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
