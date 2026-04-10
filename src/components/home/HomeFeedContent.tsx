"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowUp } from "lucide-react";
import { apiClientApp } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import { parseBlogPageQueryParam } from "@/lib/blog-feed-data";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skipUrlSyncFromRouter = useRef(false);

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  /** Avoid empty-state flash when loading client-only (no SSR posts) */
  const [isLoading, setIsLoading] = useState(() => initialPosts.length === 0);
  const [currentPage, setCurrentPage] = useState(() =>
    parseBlogPageQueryParam(searchParams.get("page"))
  );
  const showScrollTop = useScrollTopVisibility(400);

  const replaceFeedQuery = useCallback(
    (page: number) => {
      const params = new URLSearchParams();
      if (page > 0) params.set("page", String(page + 1));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  useLayoutEffect(() => {
    if (skipUrlSyncFromRouter.current) {
      skipUrlSyncFromRouter.current = false;
      return;
    }
    setCurrentPage(parseBlogPageQueryParam(searchParams.get("page")));
  }, [searchParams]);

  useEffect(() => {
    const urlPage = parseBlogPageQueryParam(searchParams.get("page"));
    if (urlPage === currentPage) return;
    skipUrlSyncFromRouter.current = true;
    replaceFeedQuery(currentPage);
  }, [currentPage, replaceFeedQuery, searchParams]);

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
        const { data } = await apiClientApp.get("/v1/posts/feed/for-you", {
          params: {
            limit: postsPerPage,
            offset: currentPage * postsPerPage,
          },
          headers: { Authorization: `Bearer ${getToken()}` },
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

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const getPageHref = useCallback((pageIndex: number) => {
    if (pageIndex > 0) return `?page=${pageIndex + 1}`;
    return "";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-3xl px-4 py-8 md:py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">For you</h1>
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
          onPageChange={onPageChange}
          postsPerPage={postsPerPage}
          searchQuery=""
          onClearSearch={noopClearSearch}
          variant="feed"
          getPageHref={getPageHref}
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
