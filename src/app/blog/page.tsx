"use client";
import React, { useEffect, useState } from "react";
import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import { toast } from "react-hot-toast";
import Navigation from "@/components/header/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Home,
  Bookmark,
  Heart,
  Users,
  Trophy,
  TrendingUp,
  Filter,
  Grid,
  List,
  Zap,
  Star,
  Clock,
  Eye,
} from "lucide-react";
import { Paginate } from "@/components/common/Paginate";
import { postsStore } from "@/stores/postsStorage";
import { axiosInstence } from "@/utils/fetch";

const postsPerPage = 10;

const Blog = () => {
  const postStore = postsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [trendingTags, setTrendingTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        await postStore.fetchPublic(postsPerPage, currentPage * postsPerPage);
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
      icon: Zap,
      label: "Trending",
      value: "trending",
      color: "text-orange-500",
    },
    {
      icon: Star,
      label: "Featured",
      value: "featured",
      color: "text-yellow-500",
    },
    { icon: Clock, label: "Recent", value: "recent", color: "text-blue-500" },
    { icon: Eye, label: "Popular", value: "popular", color: "text-zinc-600" },
    { icon: Heart, label: "Loved", value: "loved", color: "text-red-500" },
  ];

  const quickLinks = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Community", href: "/community" },
    { icon: Trophy, label: "Challenges", href: "/challenges" },
    { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-900 dark:via-slate-900 dark:to-zinc-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-600/10 to-gray-600/10 dark:from-zinc-400/5 dark:to-gray-400/5" />
          <div className="relative max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">
                Discover Amazing Stories
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explore cutting-edge articles, tutorials, and insights from our
                vibrant community of developers and creators.
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === category.value
                      ? "bg-white dark:bg-gray-800 border border-zinc-300 dark:border-zinc-600 scale-105"
                      : "bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <category.icon className={`w-4 h-4 ${category.color}`} />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {category.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 pb-12 mt-5">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-80">
              <div className="sticky top-20 space-y-6">
                {/* Quick Links */}
                <Card className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-500" />
                      Quick Access
                    </h3>
                    <nav className="space-y-2">
                      {quickLinks.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-300 group"
                        >
                          <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300" />
                          <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </nav>
                  </CardContent>
                </Card>

                {/* Trending Tags */}
                <Card className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      Trending Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(trendingTags) &&
                      trendingTags.length > 0 ? (
                        trendingTags.map((tag, index) => (
                          <Link
                            key={index}
                            href={`/tags/${tag.slice(1)}`}
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

                {/* Community Highlights */}
                <Card className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Community Highlights
                    </h3>
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/30">
                        <Link
                          href="#"
                          className="font-medium text-gray-900 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                        >
                          🚀 Building the Future with AI
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Featured discussion • 42 replies
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/30">
                        <Link
                          href="#"
                          className="font-medium text-gray-900 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                        >
                          💡 Weekly Code Challenge
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Join the challenge • 128 participants
                        </p>
                      </div>
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
                    {postStore.total} posts
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

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
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
                {postStore.posts.length > 0 ? (
                  postStore.posts.map((post) => (
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
                {isLoading && <Postlistpulse />}
              </div>

              {/* Pagination */}
              {postStore.posts.length > 0 && postStore.total > postsPerPage && (
                <div className="mt-8 flex justify-center">
                  <Paginate
                    prev={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    next={() =>
                      setCurrentPage(
                        Math.min(
                          Math.ceil(postStore.total / postsPerPage) - 1,
                          currentPage + 1
                        )
                      )
                    }
                    goToPage={(page) => setCurrentPage(page)}
                    limit={postsPerPage}
                    Offset={currentPage * postsPerPage}
                    total={postStore.total}
                    length={postStore.posts.length}
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
