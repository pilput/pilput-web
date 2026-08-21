import Navbar from "@/components/header/Navbar";
import PostListPulse from "@/components/post/PostListPulse";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp } from "lucide-react";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Skeleton */}
      <div className="relative overflow-hidden border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="text-center mb-6 space-y-3 flex flex-col items-center">
            <Skeleton className="h-5 w-36 rounded-full" />
            <Skeleton className="h-9 w-64 md:w-80 rounded-lg" />
            <Skeleton className="h-4 w-96 max-w-full rounded" />
          </div>

          {/* Search bar skeleton */}
          <div className="max-w-xl mx-auto space-y-3">
            <Skeleton className="h-11 w-full rounded-full" />
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Posts Column */}
          <div className="flex-1 min-w-0">
            {/* Toolbar Skeleton */}
            <div className="sticky top-3 z-20 mb-6">
              <div className="flex items-center gap-3 bg-card/90 border border-border/70 rounded-2xl px-5 py-3.5 backdrop-blur-md">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
            </div>

            {/* Posts Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <PostListPulse />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Right Skeleton */}
          <div className="lg:w-80 w-full shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Trending Stories Skeleton */}
              <Card className="bg-card border border-border/70 py-0">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <Skeleton className="h-5 w-32 rounded" />
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="space-y-1.5 py-2 border-b border-border/50 last:border-b-0"
                      >
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-3 w-1/2 rounded" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Topics Skeleton */}
              <Card className="bg-card border border-border/70 py-0">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <Skeleton className="h-5 w-28 rounded" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-16 rounded-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
