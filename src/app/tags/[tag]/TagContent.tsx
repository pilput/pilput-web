"use client";

import { useEffect, useState } from "react";
import PostList from "@/components/post/PostList";
import PostListPulse from "@/components/post/PostListPulse";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Hash, TrendingUp, Grid, List, Eye } from "lucide-react";
import { Paginate } from "@/components/common/Paginate";
import { apiClient } from "@/utils/fetch";
import type { Post } from "@/types/post";

interface TagContentProps {
  tag: string;
  initialPosts: Post[];
  initialTotal: number;
  relatedTags: string[];
  postsPerPage: number;
}

interface PostsResponse {
  data: Post[];
  meta?: { total_items: number };
  total?: number;
}

export default function TagContent({
  tag,
  initialPosts,
  initialTotal,
  relatedTags,
  postsPerPage,
}: TagContentProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (currentPage === 0) return;

    async function fetchPostsByTag() {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get<PostsResponse>(
          "/api/posts",
          {
            params: { tags: tag, limit: postsPerPage, offset: currentPage * postsPerPage },
          }
        );
        if (data.data) {
          setPosts(data.data);
          if (data.meta?.total_items) {
            setTotal(data.meta.total_items);
          } else if (data.total) {
            setTotal(data.total);
          }
        } else {
          toast.error("Error loading posts for this tag");
        }
      } catch (error) {
        toast.error("Error loading posts for this tag");
        console.error("Error fetching posts by tag:", error);
      }
      setIsLoading(false);
    }
    fetchPostsByTag();
  }, [tag, currentPage, postsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
          <div className="mb-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {tag}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Posts tagged with <span className="font-semibold text-foreground">#{tag}</span>
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 pb-16 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Tag Stats */}
              <Card className="glass-card shadow-premium border-glow-hover">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Tag Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total Posts
                      </span>
                      <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-semibold">
                        {total}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Tag
                      </span>
                      <Badge className="bg-muted text-foreground border border-border/40 hover:bg-muted font-semibold">
                        #{tag}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Tags */}
              {relatedTags.length > 0 && (
                <Card className="glass-card shadow-premium border-glow-hover">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Related Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {relatedTags.map((relatedTag, index) => (
                        <Link
                          key={index}
                          href={`/tags/${encodeURIComponent(relatedTag)}`}
                          className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300 hover:scale-105 border border-border/60 block"
                        >
                          #{relatedTag}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                  Posts tagged with #{tag}
                </h2>
                <Badge className="bg-muted text-muted-foreground border border-border/60">
                  {total} posts
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-card border border-border/70 rounded-xl p-1 shadow-xs">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Posts Content */}
            <div className="space-y-6">
              {isLoading ? (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <PostListPulse key={index} />
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                  {posts.map((post) => (
                    <PostList key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card border border-dashed border-border/60 rounded-2xl p-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Hash className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    No posts found
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    There are no posts tagged with #{tag} yet.
                  </p>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-semibold shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Browse All Posts
                  </Link>
                </div>
              )}

              {/* Pagination */}
              {posts.length > 0 && total > postsPerPage && (
                <div className="flex justify-center mt-12">
                  <Paginate
                    currentPage={currentPage}
                    total={total}
                    limit={postsPerPage}
                    offset={currentPage * postsPerPage}
                    prev={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    next={() =>
                      setCurrentPage(
                        Math.min(
                          Math.ceil(total / postsPerPage) - 1,
                          currentPage + 1
                        )
                      )
                    }
                    goToPage={(page) => handlePageChange(page)}
                    length={posts.length}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
