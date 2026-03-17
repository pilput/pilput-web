import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dashboard/holdings/overview",
  },
};

export default function DashboardHoldingsOverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
