import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dashboard/moderation",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardModerationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
