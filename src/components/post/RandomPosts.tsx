"use client";
import { useCallback, useEffect, useState } from "react";
import PostItem from "./PostItem";
import { apiClient } from "@/utils/fetch";
import { toast } from "sonner";
import PostItemPulse from "./PostItemPulse";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw } from "lucide-react";
import type { Post } from "@/types/post";
import { cn } from "@/lib/utils";

interface SuccessResponse {
  data: Post[];
  message: string;
  success: boolean;
}

const tempposts = [1, 2, 3, 4, 5, 6];

const PostsRandomList = ({ showHeader = true }: { showHeader?: boolean }) => {
  const [posts, setposts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRandomPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/api/posts/random?limit=6");
      const result = response.data as SuccessResponse;
      setposts(result.data);
    } catch {
      toast.error("Failed to fetch random posts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRandomPosts();
    setIsRefreshing(false);
    toast.success("New posts loaded!");
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchRandomPosts();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchRandomPosts]);

  return (
    <div className="py-8">
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Random Posts
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-md">
              Explore interesting posts from our community
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="self-start gap-2 rounded-md sm:self-auto"
          >
            <RefreshCw
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                isRefreshing && "animate-spin"
              )}
            />
            Refresh
          </Button>
        </div>
      )}

      {/* Posts Grid */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        )}
      >
        {isLoading
          ? tempposts.map((post) => <PostItemPulse key={post} />)
          : posts.map((post) => <PostItem key={post.id} post={post} showStats={false} />)}
      </div>

      {/* Empty State */}
      {!isLoading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">No posts found</p>
          <Link href="/blog">
            <Button size="sm" variant="outline" className="gap-2 rounded-md">
              Browse Blog
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* Explore More Button */}
      {!isLoading && posts.length > 0 && (
        <div className="flex justify-center mt-8">
          <Link href="/blog">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 rounded-md px-8"
            >
              Explore More Posts
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostsRandomList;
