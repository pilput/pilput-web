"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { toast } from "sonner";

import BlogHero from "@/components/blog/BlogHero";
import BlogPosts from "@/components/blog/BlogPosts";
import BlogSidebarRight from "@/components/blog/BlogSidebarRight";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useScrollTopVisibility } from "@/hooks/useScrollTopVisibility";
import { parseBlogPageQueryParam, postsPerPage } from "@/lib/blog-feed-data";
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

/** Smooth scrolling only when the user hasn't asked for reduced motion. */
function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

interface BlogContentProps {
  initialPosts?: Post[];
  initialTotal?: number;
  initialTags?: string[];
}

const BlogContent = ({
  initialPosts,
  initialTotal = 0,
  initialTags,
}: BlogContentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skipUrlSyncFromRouter = useRef(false);
  const isInitialMount = useRef(true);

  const [posts, setPosts] = useState<Post[]>(() => initialPosts ?? []);
  const [total, setTotal] = useState(() => initialTotal);
  const [trendingTags, setTrendingTags] = useState<string[]>(
    () => initialTags ?? []
  );
  const [isLoading, setIsLoading] = useState(() => initialPosts === undefined);
  const [currentPage, setCurrentPage] = useState(() =>
    parseBlogPageQueryParam(searchParams.get("page"))
  );
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") ?? ""
  );
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);
  const showScrollTop = useScrollTopVisibility(400);

  const replaceBlogQuery = useCallback(
    (page: number, q: string) => {
      const params = new URLSearchParams();
      if (page > 0) params.set("page", String(page + 1));
      const dq = q.trim();
      if (dq) params.set("q", dq);
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
    const urlPage = parseBlogPageQueryParam(searchParams.get("page"));
    const urlQ = searchParams.get("q") ?? "";
    setCurrentPage(urlPage);
    setSearchQuery(urlQ);
  }, [searchParams]);

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
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  }, []);

  useEffect(() => {
    if (initialTags && initialTags.length > 0) {
      return;
    }
    let cancelled = false;
    async function fetchTags() {
      try {
        const { data } = await apiClient.get("/api/tags/trending");
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
  }, [initialTags]);

  useEffect(() => {
    if (
      isInitialMount.current &&
      initialPosts !== undefined &&
      currentPage === 0 &&
      !debouncedSearchQuery.trim()
    ) {
      isInitialMount.current = false;
      return;
    }
    isInitialMount.current = false;
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

        const { data } = await apiClient.get("/api/posts", { params });
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
  }, [currentPage, debouncedSearchQuery, initialPosts]);

  /** Keep URL in sync with the input (`searchQuery`) so `q` and `page` update immediately; any search change stays on page 1. */
  useEffect(() => {
    const urlPage = parseBlogPageQueryParam(searchParams.get("page"));
    const urlQ = (searchParams.get("q") ?? "").trim();
    const sq = searchQuery.trim();
    if (urlPage === currentPage && urlQ === sq) return;
    skipUrlSyncFromRouter.current = true;
    replaceBlogQuery(currentPage, searchQuery);
  }, [currentPage, searchQuery, replaceBlogQuery, searchParams]);

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  }, []);

  const getPageHref = useCallback(
    (pageIndex: number) => {
      const params = new URLSearchParams();
      if (pageIndex > 0) params.set("page", String(pageIndex + 1));
      const sq = searchQuery.trim();
      if (sq) params.set("q", sq);
      const qs = params.toString();
      return qs ? `?${qs}` : "";
    },
    [searchQuery]
  );

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <BlogHero
        searchQuery={searchQuery}
        setSearchQuery={handleSearchQueryChange}
        handleClearSearch={handleClearSearch}
        trendingTags={trendingTags}
        onTagClick={handleTagClick}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <BlogPosts
            posts={posts}
            isLoading={isLoading}
            total={total}
            currentPage={currentPage}
            onPageChange={onPageChange}
            postsPerPage={postsPerPage}
            searchQuery={debouncedSearchQuery}
            onClearSearch={handleClearSearch}
            getPageHref={getPageHref}
          />

          <BlogSidebarRight trendingTags={trendingTags} />
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 flex size-12 items-center justify-center rounded-full border border-primary/60 bg-primary text-primary-foreground shadow-lg cursor-pointer transition-colors duration-200 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-8 sm:right-8"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
    </main>
  );
};

export default BlogContent;
