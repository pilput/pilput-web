"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Sparkles, Hash } from "lucide-react";
import TrendingPosts from "@/components/post/TrendingPosts";
import { apiClient } from "@/utils/fetch";
import { toast } from "sonner";
import type { Post } from "@/types/post";

interface BlogSidebarRightProps {
  trendingTags: string[];
}

const BlogSidebarRight = ({ trendingTags }: BlogSidebarRightProps) => {
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingPosts() {
      setIsTrendingLoading(true);
      try {
        const { data } = await apiClient.get("/api/posts/trending", {
          params: { limit: 5 },
        });
        if (data?.data) {
          setTrendingPosts(data.data);
        } else {
          console.error("No trending posts data received");
        }
      } catch (error) {
        console.error("Error fetching trending posts:", error);
        toast.error("Error loading trending posts");
      } finally {
        setIsTrendingLoading(false);
      }
    }
    fetchTrendingPosts();
  }, []);

  return (
    <div className="lg:w-80 w-full shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Trending Posts */}
        <Card className="bg-card border border-border/70 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-5">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-base">
              <Sparkles className="w-4 h-4 text-primary" />
              Trending Stories
            </h3>
            <TrendingPosts posts={trendingPosts} isLoading={isTrendingLoading} />
          </CardContent>
        </Card>

        {/* Trending Topics */}
        <Card className="bg-card border border-border/70 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-5">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4 text-primary" />
              Popular Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(trendingTags) && trendingTags.length > 0 ? (
                trendingTags.slice(0, 10).map((tag, index) => (
                  <Link
                    key={index}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-muted rounded-full text-xs font-semibold text-foreground/80 hover:bg-primary/10 hover:text-primary transition-all duration-200 border border-border/60"
                  >
                    <Hash className="w-3 h-3 text-muted-foreground/60 group-hover:text-primary" />
                    {tag}
                  </Link>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">
                  No popular topics yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogSidebarRight;
