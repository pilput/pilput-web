import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata = publicPageMetadata({
  title: "Blog | Latest Stories & Insights",
  description:
    "Discover stories, thinking, and expertise from writers on every topic. Browse, search, and dive back into what matters.",
  canonicalPath: "/blog",
  keywords: [
    "blog",
    "articles",
    "writers",
    "pilput",
    "publishing",
    "stories",
  ],
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
