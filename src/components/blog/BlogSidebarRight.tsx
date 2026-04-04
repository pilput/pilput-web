"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import ReadingListCard from "@/components/blog/ReadingListCard";

interface BlogSidebarRightProps {
  trendingTags: string[];
}

const BlogSidebarRight = ({ trendingTags }: BlogSidebarRightProps) => {
  return (
    <div className="xl:w-80">
      <div className="space-y-4">
        {/* Trending Topics */}
        <div>
          <Card className="bg-card border border-border/70 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                Trending now
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(trendingTags) && trendingTags.length > 0 ? (
                  trendingTags.slice(0, 7).map((tag, index) => (
                    <div key={index}>
                      <Link
                        href={`/tags/${tag}`}
                        className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border/60 block"
                      >
                        #{tag}
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No trending topics yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <ReadingListCard />
      </div>
    </div>
  );
};

export default BlogSidebarRight;
