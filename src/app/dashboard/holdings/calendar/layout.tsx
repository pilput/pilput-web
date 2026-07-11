import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dashboard/holdings/calendar",
  },
};

export default function DashboardHoldingsCalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
