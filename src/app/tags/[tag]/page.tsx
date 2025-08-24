"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import { toast } from "react-hot-toast";
import Navigation from "@/components/header/Navbar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Hash, TrendingUp, Grid, List, Eye } from "lucide-react";
import { Paginate } from "@/components/common/Paginate";
import { axiosInstence } from "@/utils/fetch";

import type { Post } from "@/types/post";

const postsPerPage = 10;

const TagPage = () => {
  const params = useParams();
  const tag = params.tag as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [relatedTags, setRelatedTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchPostsByTag() {
      if (!tag) return;

      setIsLoading(true);
      try {
        const { data } = await axiosInstence.get(`/v1/posts/tag/${tag}`, {
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
          toast.error("Error loading posts for this tag");
        }
      } catch (error) {
        toast.error("Error loading posts for this tag");
        console.error("Error fetching posts by tag:", error);
      }
      setIsLoading(false);
    }
    fetchPostsByTag();
  }, [tag, currentPage]);

  useEffect(() => {
    async function fetchRelatedTags() {
      try {
        const response = await axiosInstence.get("/v1/tags");
        const allTags = response.data.data.map((tagItem: any) => tagItem.name);
        // Filter out current tag and show related ones
        const filtered = allTags.filter((t: string) => t !== tag).slice(0, 10);
        setRelatedTags(filtered);
      } catch (error) {
        console.error("Error fetching related tags:", error);
      }
    }
    fetchRelatedTags();
  }, [tag]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-900 dark:via-slate-900 dark:to-zinc-950">
        {/* Hero Section */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="mb-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded flex items-center justify-center">
                <Hash className="w-4 h-4 text-white dark:text-gray-900" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                {tag}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Posts tagged with {tag}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 pb-12 mt-5">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-80">
              <div className="sticky top-20 space-y-6">
                {/* Tag Stats */}
                <Card className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-500" />
                      Tag Statistics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Total Posts
                        </span>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {total}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Tag
                        </span>
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          #{tag}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Tags */}
                {relatedTags.length > 0 && (
                  <Card className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        Related Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {relatedTags.map((relatedTag, index) => (
                          <Link
                            key={index}
                            href={`/tags/${relatedTag}`}
                            className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/50 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-700/60 transition-all duration-300 hover:scale-105"
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
            <div className="flex-1">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Posts tagged with #{tag}
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

              {/* Posts Content */}
              <div className="space-y-6">
                {isLoading ? (
                  <div className="space-y-6">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Postlistpulse key={index} />
                    ))}
                  </div>
                ) : posts.length > 0 ? (
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <Postlist key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Hash className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No posts found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      There are no posts tagged with #{tag} yet.
                    </p>
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                      Offset={currentPage * postsPerPage}
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
                      length={posts.length}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TagPage;
