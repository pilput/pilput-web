"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { toast } from "sonner";

import BlogHero from "@/components/blog/BlogHero";
import BlogPosts from "@/components/blog/BlogPosts";
import BlogSidebarLeft from "@/components/blog/BlogSidebarLeft";
import BlogSidebarRight from "@/components/blog/BlogSidebarRight";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useScrollTopVisibility } from "@/hooks/useScrollTopVisibility";
import { postsPerPage } from "@/lib/blog-feed-data";
import type { Post } from "@/types/post";
import { apiClient } from "@/utils/fetch";

const FALLBACK_TRENDING_TAGS = [
  "ai",
  "nextjs",
  "typescript",
  "webdev",
  "react",
  "javascript",
];

const BlogContent = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [trendingTags, setTrendingTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);
  const showScrollTop = useScrollTopVisibility(400);

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

  useEffect(() => {
    let cancelled = false;
    async function fetchTags() {
      try {
        const { data } = await apiClient.get("/v1/tags");
        if (!cancelled && data?.data) {
          setTrendingTags(data.data.map((tag: { name: string }) => tag.name));
        }
      } catch {
        if (!cancelled) {
          setTrendingTags(FALLBACK_TRENDING_TAGS);
        }
      }
    }
    fetchTags();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      setIsLoading(true);
      try {
        const params: Record<string, string | number> = {
          limit: postsPerPage,
          offset: currentPage * postsPerPage,
        };
        const q = debouncedSearchQuery.trim();
        if (q) {
          params.search = q;
        }

        const { data } = await apiClient.get("/v1/posts", { params });
        if (cancelled) {
          return;
        }

        if (data.data) {
          setPosts(data.data);
          const nextTotal =
            data.meta?.total_items ?? data.total ?? 0;
          setTotal(nextTotal);
        } else {
          toast.error("Error loading posts");
        }
      } catch {
        if (!cancelled) {
          toast.error("Error loading posts");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [currentPage, debouncedSearchQuery]);

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
