import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dashboard/users",
  },
};

export default function DashboardUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
