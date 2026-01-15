"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import Navigation from "@/components/header/Navbar";
import { ArrowUp } from "lucide-react";
import { axiosInstance3 } from "@/utils/fetch";
import type { Post } from "@/types/post";

import BlogHero from "@/components/blog/BlogHero";
import BlogPosts from "@/components/blog/BlogPosts";
import BlogSidebarLeft from "@/components/blog/BlogSidebarLeft";
import BlogSidebarRight from "@/components/blog/BlogSidebarRight";

const postsPerPage = 10;

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [trendingTags, setTrendingTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleTagClick = useCallback((tag: string) => {
    setSearchQuery(tag);
    setCurrentPage(0);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setCurrentPage(0);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

        const { data } = await axiosInstance3.get("/v1/posts", { params });
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
        const response = await axiosInstance3.get("/v1/tags");
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
        <BlogHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleClearSearch={handleClearSearch}
          trendingTags={trendingTags}
          onTagClick={handleTagClick}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Main Content Area */}
          <div className="flex flex-col xl:flex-row gap-8">
            <BlogSidebarLeft />

            <BlogPosts
              posts={posts}
              isLoading={isLoading}
              total={total}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              postsPerPage={postsPerPage}
              searchQuery={debouncedSearchQuery}
              onClearSearch={handleClearSearch}
            />

            <BlogSidebarRight trendingTags={trendingTags} />
          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl border border-primary/60 backdrop-blur-md"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  );
};

export default Blog;
