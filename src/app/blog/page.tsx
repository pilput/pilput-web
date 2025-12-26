"use client";
import { useEffect, useState, useCallback } from "react";
import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import { toast } from "react-hot-toast";
import Navigation from "@/components/header/Navbar";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  TrendingUp,
  Bookmark,
  X,
  Sparkles,
  Clock3,
  FileQuestion,
} from "lucide-react";
import { Paginate } from "@/components/common/Paginate";
import { axiosInstence3 } from "@/utils/fetch";
import type { Post } from "@/types/post";

const postsPerPage = 10;

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [trendingTags, setTrendingTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const totalPages = Math.max(1, Math.ceil(total / postsPerPage));

  const handleTagClick = useCallback((tag: string) => {
    setSearchQuery(tag);
    setCurrentPage(0);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setCurrentPage(0);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(0); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const params: any = {
          limit: postsPerPage,
          offset: currentPage * postsPerPage,
        };

        if (debouncedSearchQuery.trim()) {
          params.search = debouncedSearchQuery.trim();
        }

        const { data } = await axiosInstence3.get("/v1/posts", { params });
        const response = data;
        if (response.data) {
          setPosts(response.data);
          if (response.meta && response.meta.total_items) {
            setTotal(response.meta.total_items);
          } else if (response.total) {
            setTotal(response.total);
          }
        } else {
          toast.error("Error loading posts");
        }
      } catch (error) {
        toast.error("Error loading posts");
      }
      setIsLoading(false);
    }
    fetchPosts();
  }, [currentPage, debouncedSearchQuery]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await axiosInstence3.get("/v1/tags");
        console.log(response.data);
        
        setTrendingTags(response.data.data.map((tag: any) => tag.name));
      } catch (error) {
        console.error("Error fetching tags:", error);
        // Fallback to default tags if API fails
        setTrendingTags([
          "ai",
          "nextjs",
          "typescript",
          "webdev",
          "react",
          "javascript",
        ]);
      }
    }
    fetchTags();
  }, []);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        {/* Hero / search */}
        <div className="relative overflow-hidden border-b border-border/70 bg-background/90 backdrop-blur">
          <div className="absolute inset-0 bg-grid-slate-100/[0.08] dark:bg-grid-slate-800/[0.1] bg-size-[32px_32px]" />
          <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
            <div className="text-center mb-10 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold border border-primary/20 shadow-sm">
                <Sparkles className="w-4 h-4" />
                Freshly curated for you
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Latest Stories
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover stories, thinking, and expertise from writers on every topic. Browse, search, and dive back into what matters.
              </p>
            </div>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group shadow-lg shadow-primary/5 rounded-full border border-border/70 bg-card/80 backdrop-blur">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 bg-transparent border border-transparent rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition"
                  aria-label="Search blog posts"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {Array.isArray(trendingTags) && trendingTags.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2 px-2 py-1 rounded-full bg-muted text-foreground/80">
                    <Clock3 className="w-4 h-4" />
                    Trending tags:
                  </span>
                  {trendingTags.slice(0, 8).map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleTagClick(tag)}
                      className="px-3 py-1.5 rounded-full border border-border/70 bg-card/80 hover:border-primary/40 hover:-translate-y-0.5 transition text-foreground"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Main Content Area */}
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Main Posts Feed */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="sticky top-3 z-20 mb-4">
                <div className="flex flex-wrap items-center gap-3 bg-card/90 border border-border/70 rounded-2xl px-4 py-3 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-2 text-sm text-foreground font-semibold">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {total ? `${total} stories` : "Stories"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage + 1} of {totalPages}
                  </div>
                  {debouncedSearchQuery && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-foreground text-sm border border-border/60">
                      Searching "{debouncedSearchQuery}"
                      <button
                        onClick={handleClearSearch}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Clear search filter"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <Postlist key={post.id} post={post} />
                  ))
                ) : !isLoading ? (
                  <div className="text-center py-20 px-4 bg-card/50 rounded-2xl border border-dashed border-border">
                    <div className="w-20 h-20 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
                      <FileQuestion className="w-10 h-10 text-muted-foreground/60" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {debouncedSearchQuery ? `No results for "${debouncedSearchQuery}"` : "No posts found"}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {debouncedSearchQuery
                        ? "We couldn't find any articles matching your search. Try different keywords or browse our trending topics."
                        : "There are no stories published yet. Check back soon for new content."
                      }
                    </p>
                    {debouncedSearchQuery && (
                      <button 
                        onClick={handleClearSearch}
                        className="mt-6 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : null}
                {isLoading &&
                  Array(6)
                    .fill(0)
                    .map((_, i) => <Postlistpulse key={i} />)}
              </div>

              {/* Pagination */}
              {posts.length > 0 && total > postsPerPage && (
                <div className="mt-12 flex justify-center">
                  <Paginate
                    prev={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    next={() =>
                      setCurrentPage(
                        Math.min(
                          Math.ceil(total / postsPerPage) - 1,
                          currentPage + 1
                        )
                      )
                    }
                    goToPage={(page) => setCurrentPage(page)}
                    limit={postsPerPage}
                    Offset={currentPage * postsPerPage}
                    total={total}
                    length={posts.length}
                    currentPage={currentPage}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="xl:w-80">
              <div className="space-y-3">
                {/* Trending Topics */}
                <Card className="bg-card border border-border/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-muted-foreground" />
                      Trending now
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(trendingTags) &&
                      trendingTags.length > 0 ? (
                        trendingTags.slice(0, 10).map((tag, index) => (
                          <Link
                            key={index}
                            href={`/tags/${tag}`}
                            className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border/60"
                          >
                            #{tag}
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No trending topics yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Reading List */}
                <Card className="bg-card border border-border/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-muted-foreground" />
                      Reading List
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Save articles for later and never miss great content
                    </p>
                    <button className="w-full px-4 py-2 rounded-lg border border-primary/60 bg-primary text-primary-foreground hover:shadow-md transition-colors text-sm font-medium">
                      Create reading list
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
