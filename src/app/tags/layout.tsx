import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata = publicPageMetadata({
  title: "Tags",
  description: "Browse all tags on pilput and discover articles by topic.",
  canonicalPath: "/tags",
  keywords: ["tags", "topics", "articles", "pilput", "browse"],
  openGraphTitle: "Tags | pilput",
});

export default function TagsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
