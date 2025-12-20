import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Latest Stories & Insights",
  description: "Discover stories, thinking, and expertise from writers on every topic. Browse, search, and dive back into what matters.",
  openGraph: {
    title: "Blog | Latest Stories & Insights",
    description: "Discover stories, thinking, and expertise from writers on every topic.",
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
