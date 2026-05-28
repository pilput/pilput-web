"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowUp, Rss, Grid, List, TrendingUp } from "lucide-react";
import { apiClient } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import { parseBlogPageQueryParam } from "@/lib/blog-feed-data";
import type { Post } from "@/types/post";
import { useScrollTopVisibility } from "@/hooks/useScrollTopVisibility";
import PostList from "@/components/post/PostList";
import PostListPulse from "@/components/post/PostListPulse";
import { Paginate } from "@/components/common/Paginate";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TrendingPosts from "@/components/post/TrendingPosts";

interface HomeFeedContentProps {
  initialPosts: Post[];
  initialTotal: number;
  postsPerPage: number;
}

const HomeFeedContent = ({
  initialPosts,
  initialTotal,
  postsPerPage,
}: HomeFeedContentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skipUrlSyncFromRouter = useRef(false);

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  /** Avoid empty-state flash when loading client-only (no SSR posts) */
  const [isLoading, setIsLoading] = useState(() => initialPosts.length === 0);
  const [currentPage, setCurrentPage] = useState(() =>
    parseBlogPageQueryParam(searchParams.get("page"))
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [tags, setTags] = useState<string[]>([]);
  const [isTagsLoading, setIsTagsLoading] = useState(true);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);

  const showScrollTop = useScrollTopVisibility(400);

  const replaceFeedQuery = useCallback(
    (page: number) => {
      const params = new URLSearchParams();
      if (page > 0) params.set("page", String(page + 1));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  useLayoutEffect(() => {
    if (skipUrlSyncFromRouter.current) {
      skipUrlSyncFromRouter.current = false;
      return;
    }
    setCurrentPage(parseBlogPageQueryParam(searchParams.get("page")));
  }, [searchParams]);

  useEffect(() => {
    const urlPage = parseBlogPageQueryParam(searchParams.get("page"));
    if (urlPage === currentPage) return;
    skipUrlSyncFromRouter.current = true;
    replaceFeedQuery(currentPage);
  }, [currentPage, replaceFeedQuery, searchParams]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch feed posts
  useEffect(() => {
    if (currentPage === 0 && initialPosts.length > 0) {
      return;
    }

    async function fetchPosts() {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get("/api/posts/feed/for-you", {
          params: {
            limit: postsPerPage,
            offset: currentPage * postsPerPage,
          },
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const response = data;
        if (response.data) {
          setPosts(response.data);
          if (response.meta?.total_items) {
            setTotal(response.meta.total_items);
          } else if (response.total) {
            setTotal(response.total);
          }
        } else {
          toast.error("Error loading posts");
        }
      } catch {
        toast.error("Error loading posts");
      }
      setIsLoading(false);
    }
    fetchPosts();
  }, [currentPage, postsPerPage, initialPosts.length]);

  // Fetch tags for sidebar
  useEffect(() => {
    async function fetchTags() {
      try {
        const { data } = await apiClient.get("/api/tags");
        if (data?.data) {
          setTags(data.data.map((t: { name: string }) => t.name));
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setIsTagsLoading(false);
      }
    }
    fetchTags();
  }, []);

  // Fetch trending posts for sidebar
  useEffect(() => {
    async function fetchTrendingPosts() {
      try {
        const { data } = await apiClient.get("/api/posts/trending", {
          params: { limit: 5 },
        });
        if (data?.data) {
          setTrendingPosts(data.data);
        }
      } catch (error) {
        console.error("Error fetching trending posts:", error);
      } finally {
        setIsTrendingLoading(false);
      }
    }
    fetchTrendingPosts();
  }, []);

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <Rss className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              For you
            </h1>
          </div>
          <p className="text-muted-foreground">
            Freshly curated updates from the community. For search and topics, open{" "}
            <Link
              href="/blog"
              className="text-primary font-semibold hover:underline"
            >
              Blog
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Trending Topics */}
              {tags.length > 0 && (
                <Card className="glass-card shadow-premium border-glow-hover">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Trending Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.slice(0, 10).map((tag, index) => (
                        <Link
                          key={index}
                          href={`/tags/${encodeURIComponent(tag)}`}
                          className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300 hover:scale-105 border border-border/60 block"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Trending Posts Widget */}
              <Card className="glass-card shadow-premium border-glow-hover">
                <CardContent className="p-4">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Trending Posts
                  </h3>
                  <TrendingPosts posts={trendingPosts} isLoading={isTrendingLoading} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                  Community feed
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
                    <Rss className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    No posts found
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    There are no stories published in your feed yet. Check back later or follow other creators.
                  </p>
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
                    prev={() => onPageChange(Math.max(0, currentPage - 1))}
                    next={() =>
                      onPageChange(
                        Math.min(
                          Math.ceil(total / postsPerPage) - 1,
                          currentPage + 1
                        )
                      )
                    }
                    goToPage={(page) => onPageChange(page)}
                    length={posts.length}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl border border-primary/60 backdrop-blur-md transition-all duration-350"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default HomeFeedContent;
