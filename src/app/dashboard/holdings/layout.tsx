import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dashboard/holdings",
  },
};

export default function DashboardHoldingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
