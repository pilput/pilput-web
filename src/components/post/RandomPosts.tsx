"use client";
import { useState, useEffect } from "react";
import PostItem from "./PostItem";
import { axiosInstance } from "@/utils/fetch";
import { toast } from "react-hot-toast";
import PostItemPulse from "./PostItemPulse";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw } from "lucide-react";
import type { Post } from "@/types/post";
import { cn } from "@/lib/utils";

interface succesResponse {
  data: Post[];
  message: string;
  success: boolean;
}

const tempposts = [1, 2, 3, 4, 5, 6];

const PostsRandomList = () => {
  const [posts, setposts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRandomPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/v1/posts/random?limit=6");
      const result = response.data as succesResponse;
      setposts(result.data);
    } catch {
      toast.error("Failed to fetch random posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRandomPosts();
    setIsRefreshing(false);
    toast.success("New posts loaded!");
  };

  useEffect(() => {
    fetchRandomPosts();
  }, []);

  return (
    <div className="py-8">
      {/* Section Header */}
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
          className="self-start sm:self-auto rounded-full gap-2"
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

      {/* Posts Grid */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
          isLoading && "animate-pulse"
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
            <Button size="sm" variant="outline" className="rounded-full gap-2">
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
              className="rounded-full px-8 gap-2"
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
