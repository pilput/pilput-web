import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse all tags on pilput and discover articles by topic.",
  alternates: {
    canonical: "/tags",
  },
  openGraph: {
    title: "Tags",
    description: "Browse all tags on pilput and discover articles by topic.",
    url: "/tags",
    type: "website",
  },
};

export default function TagsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
