import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dashboard/reports",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
