"use client";
import React, { useEffect, useState } from "react";
import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import { toast } from "react-hot-toast";
import Navigation from "@/components/header/Navbar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Heart,
  TrendingUp,
  Grid,
  List,
  Zap,
  Clock,
  Eye,
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [trendingTags, setTrendingTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const { data } = await axiosInstence.get("/v1/posts", {
          params: { limit: postsPerPage, offset: currentPage * postsPerPage },
        });
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
  }, [currentPage]);

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

  const categories = [
    {
      icon: Clock,
      label: "Latest",
      value: "latest",
      color: "text-blue-500",
    },
    {
      icon: Zap,
      label: "Trending",
      value: "trending",
      color: "text-orange-500",
    },
    { icon: Eye, label: "Popular", value: "popular", color: "text-zinc-600" },
    { icon: Heart, label: "Loved", value: "loved", color: "text-red-500" },
    {
      icon: TrendingUp,
      label: "Future",
      value: "future",
      color: "text-purple-500",
    },
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-900 dark:via-slate-900 dark:to-zinc-950">
        {/* Hero Section */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white dark:text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                Blog
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Discover the latest articles, tutorials, and insights from our community
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 pb-12 mt-5">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-80">
              <div className="sticky top-20 space-y-6">
                {/* Popular Posts */}
                <Card className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      Popular This Week
                    </h3>
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          Getting Started with Next.js 15
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          2.5k views • 3 days ago
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          TypeScript Best Practices
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          1.8k views • 5 days ago
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          Building Modern UIs
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          1.2k views • 1 week ago
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trending Tags */}
                <Card className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-500" />
                      Trending Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(trendingTags) &&
                      trendingTags.length > 0 ? (
                        trendingTags.map((tag, index) => (
                          <Link
                            key={index}
                            href={`/tags/${tag}`}
                            className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/50 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-700/60 transition-all duration-300 hover:scale-105"
                          >
                            #{tag}
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No trending tags available
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedCategory === "all"
                      ? "All Posts"
                      : categories.find((c) => c.value === selectedCategory)
                          ?.label + " Posts"}
                  </h2>
                  <Badge className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    {total} posts
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === "grid"
                          ? "bg-zinc-600 text-white"
                          : "text-gray-600 dark:text-gray-400 hover:text-zinc-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === "list"
                          ? "bg-zinc-600 text-white"
                          : "text-gray-600 dark:text-gray-400 hover:text-zinc-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Posts Grid/List */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "space-y-6"
                }
              >
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <Postlist key={post.id} post={post} />
                  ))
                ) : !isLoading ? (
                  <div className="col-span-full text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800/30 rounded-full flex items-center justify-center">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No posts found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Try adjusting your filters or check back later for new
                      content.
                    </p>
                  </div>
                ) : null}
                {isLoading && (
                  Array(6).fill(0).map((_, i) => (
                    <Postlistpulse key={i} />
                  ))
                )}
              </div>

              {/* Pagination */}
              {posts.length > 0 && total > postsPerPage && (
                <div className="mt-8 flex justify-center">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
