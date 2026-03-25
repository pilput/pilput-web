"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { ArrowUp } from "lucide-react";
import { axiosInstance } from "@/utils/fetch";
import type { Post } from "@/types/post";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useScrollTopVisibility } from "@/hooks/useScrollTopVisibility";
import { useTrendingTags } from "@/hooks/useTrendingTags";

import BlogHero from "@/components/blog/BlogHero";
import BlogPosts from "@/components/blog/BlogPosts";
import BlogSidebarLeft from "@/components/blog/BlogSidebarLeft";
import BlogSidebarRight from "@/components/blog/BlogSidebarRight";

interface BlogContentProps {
  initialPosts: Post[];
  initialTotal: number;
  postsPerPage: number;
}

const BlogContent = ({ initialPosts, initialTotal, postsPerPage }: BlogContentProps) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);
  const showScrollTop = useScrollTopVisibility(400);
  const trendingTags = useTrendingTags();

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    handleSearchQueryChange(tag);
  }, [handleSearchQueryChange]);

  const handleClearSearch = useCallback(() => {
    handleSearchQueryChange("");
  }, [handleSearchQueryChange]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch posts when page or search changes
  useEffect(() => {
    // Skip initial fetch if we have initial data and no search/page changes yet
    if (currentPage === 0 && !debouncedSearchQuery && initialPosts.length > 0) {
      return;
    }

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

        const { data } = await axiosInstance.get("/v1/posts", { params });
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
  }, [currentPage, debouncedSearchQuery, postsPerPage, initialPosts.length]);

  return (
    <div className="min-h-screen bg-background">
      <BlogHero
        searchQuery={searchQuery}
        setSearchQuery={handleSearchQueryChange}
        handleClearSearch={handleClearSearch}
        trendingTags={trendingTags}
        onTagClick={handleTagClick}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
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
  );
};

export default BlogContent;
