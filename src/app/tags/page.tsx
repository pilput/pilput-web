import Navigation from "@/components/header/Navbar";
import Link from "next/link";
import { Tag as TagIcon } from "lucide-react";
import { apiClient } from "@/utils/fetch";
import TagsBrowser, { type TagListItem } from "./TagsBrowser";

export const revalidate = 300;

async function getTags(): Promise<TagListItem[]> {
  try {
    const { data: response } = await apiClient.get<{
      data?: Array<{ id?: string | number; name: string; created_at?: string }>;
    }>("/api/tags", { next: { revalidate } });

    return (response.data ?? []).map((tag) => ({
      id: String(tag.id ?? tag.name),
      name: tag.name,
      created_at: tag.created_at ?? new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error loading tags:", error);
    return [];
  }
}

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <div className="border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="mb-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                ← Back to Blog
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <TagIcon className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                All Tags
              </h1>
            </div>
            <p className="text-muted-foreground">
              Explore topics and discover content by tags
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TagsBrowser tags={tags} />
        </div>
      </div>
    </>
  );
}
