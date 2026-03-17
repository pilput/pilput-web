import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dashboard/holdings/performance",
  },
};

export default function DashboardHoldingsPerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
