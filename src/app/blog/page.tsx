"use client";
import React, { useEffect, useState } from "react";
import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import { toast } from "react-hot-toast";
import Navigation from "@/components/header/Navbar";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  TrendingUp,
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



  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Minimal Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                Latest Stories
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover stories, thinking, and expertise from writers on any topic
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Main Content Area */}
          <div className="flex flex-col xl:flex-row gap-12">
            {/* Main Posts Feed */}
            <div className="flex-1">
              <div className="space-y-8">
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
                      No posts found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Try adjusting your filters or check back later for new
                      content.
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
              <div className="space-y-8">
                {/* Trending Topics */}
                <Card className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-500" />
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
                <Card className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                      See more of what you like
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Your reading list helps you save articles for later
                    </p>
                    <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
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
