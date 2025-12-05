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
} from "lucide-react";
import { Paginate } from "@/components/common/Paginate";
import { axiosInstence } from "@/utils/fetch";
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

        const { data } = await axiosInstence.get("/v1/posts", { params });
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
        const response = await axiosInstence.get("/v1/tags");
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
      <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50/60 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        {/* Hero / search */}
        <div className="relative overflow-hidden border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
          <div className="absolute inset-0 opacity-70 dark:opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.16),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.14),transparent_25%)]" />
          <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
            <div className="text-center mb-10 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-3 py-1 text-xs font-semibold shadow-sm">
                <Sparkles className="w-4 h-4" />
                Freshly curated for you
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Latest Stories
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Discover stories, thinking, and expertise from writers on every topic. Browse, search, and dive back into what matters.
              </p>
            </div>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group shadow-lg shadow-gray-200/40 dark:shadow-black/30 rounded-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 focus:border-transparent transition"
                  aria-label="Search blog posts"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {Array.isArray(trendingTags) && trendingTags.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    <Clock3 className="w-4 h-4" />
                    Trending tags:
                  </span>
                  {trendingTags.slice(0, 8).map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleTagClick(tag)}
                      className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 hover:-translate-y-0.5 transition text-gray-700 dark:text-gray-200"
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
                <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-semibold">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {total ? `${total} stories` : "Stories"}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Page {currentPage + 1} of {totalPages}
                  </div>
                  {debouncedSearchQuery && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm">
                      Searching “{debouncedSearchQuery}”
                      <button
                        onClick={handleClearSearch}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800/30 rounded-full flex items-center justify-center">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {debouncedSearchQuery ? `No results for "${debouncedSearchQuery}"` : "No posts found"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {debouncedSearchQuery
                        ? "Try searching for different keywords or check back later for new content."
                        : "Try adjusting your filters or check back later for new content."
                      }
                    </p>
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
                <Card className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      Trending now
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(trendingTags) &&
                      trendingTags.length > 0 ? (
                        trendingTags.slice(0, 10).map((tag, index) => (
                          <Link
                            key={index}
                            href={`/tags/${tag}`}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            #{tag}
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No trending topics yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Reading List */}
                <Card className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      Reading List
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Save articles for later and never miss great content
                    </p>
                    <button className="w-full px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-medium">
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
