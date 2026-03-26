"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowUp } from "lucide-react";
import { axiosInstance } from "@/utils/fetch";
import type { Post } from "@/types/post";
import { useScrollTopVisibility } from "@/hooks/useScrollTopVisibility";
import BlogPosts from "@/components/blog/BlogPosts";

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
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const showScrollTop = useScrollTopVisibility(400);

  const noopClearSearch = useCallback(() => {}, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (currentPage === 0 && initialPosts.length > 0) {
      return;
    }

    async function fetchPosts() {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get("/v1/posts", {
          params: {
            limit: postsPerPage,
            offset: currentPage * postsPerPage,
          },
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

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-3xl px-4 py-8 md:py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Feed</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Updates from the community. For search and topics, open{" "}
            <Link
              href="/blog"
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              Blog
            </Link>
            .
          </p>
        </header>

        <BlogPosts
          posts={posts}
          isLoading={isLoading}
          total={total}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          postsPerPage={postsPerPage}
          searchQuery=""
          onClearSearch={noopClearSearch}
          variant="feed"
        />
      </main>

      {showScrollTop && (
        <button
          type="button"
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

export default HomeFeedContent;
