"use client";

import FeaturedPostCard from "@/components/blog/FeaturedPostCard";
import PostGridCard from "@/components/blog/PostGridCard";
import PostListPulse from "@/components/post/PostListPulse";
import { Paginate } from "@/components/common/Paginate";
import { Filter, X, FileQuestion, Sparkles, Rss } from "lucide-react";
import type { Post } from "@/types/post";

interface BlogPostsProps {
  posts: Post[];
  isLoading: boolean;
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  postsPerPage: number;
  searchQuery: string; // This should be the active filter (debounced)
  onClearSearch: () => void;
  /** "feed" = compact home feed; "blog" = full blog toolbar copy */
  variant?: "blog" | "feed";
  /** Pagination link query builder (1-based `page`, optional `q`) */
  getPageHref?: (pageIndex: number) => string;
}

const BlogPosts = ({
  posts,
  isLoading,
  total,
  currentPage,
  onPageChange,
  postsPerPage,
  searchQuery,
  onClearSearch,
  variant = "blog",
  getPageHref,
}: BlogPostsProps) => {
  const totalPages = Math.max(1, Math.ceil(total / postsPerPage));
  const isFeed = variant === "feed";

  // Calculate Featured Post logic: only on page 1, when not searching, and variant is blog
  const showFeatured = currentPage === 0 && !searchQuery && posts.length > 0 && !isFeed;
  const featuredPost = showFeatured ? posts[0] : null;
  const gridPosts = showFeatured ? posts.slice(1) : posts;

  return (
    <div className="flex-1 min-w-0">
      {/* Toolbar */}
      <div className="sticky top-3 z-20 mb-6">
        <div
          className={
            isFeed
              ? "flex flex-wrap items-center gap-3 border-b border-border/60 pb-4"
              : "flex flex-wrap items-center gap-3 bg-card/90 border border-border/70 rounded-2xl px-5 py-3.5 shadow-md backdrop-blur-md"
          }
        >
          <div className="flex items-center gap-2 text-sm text-foreground font-bold">
            {isFeed ? (
              <Rss className="w-4 h-4 text-primary" />
            ) : (
              <Sparkles className="w-4 h-4 text-primary" />
            )}
            {isFeed
              ? total
                ? `${total} posts`
                : "Feed"
              : total
                ? `${total} stories`
                : "Stories"}
          </div>
          <div className="text-xs text-muted-foreground border-l border-border/60 pl-3">
            Page {currentPage + 1} of {totalPages}
          </div>
          {searchQuery && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-foreground text-xs border border-border/60">
              <Filter className="w-3 h-3 text-primary" />
              Searching &quot;{searchQuery}&quot;
              <button
                onClick={onClearSearch}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear search filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Featured Post Card */}
        {showFeatured && featuredPost && (
          <div className="mb-8">
            <FeaturedPostCard post={featuredPost} />
          </div>
        )}

        {/* Grid Posts */}
        {gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" key="posts-grid">
            {gridPosts.map((post) => (
              <div key={post.id}>
                <PostGridCard post={post} />
              </div>
            ))}
          </div>
        ) : !isLoading && !featuredPost ? (
          <div
            key="empty"
            className="text-center py-20 px-4 bg-card/50 rounded-2xl border border-dashed border-border/70"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
              <FileQuestion className="w-10 h-10 text-muted-foreground/60" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "No posts found"}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              {searchQuery
                ? "We couldn't find any articles matching your search. Try different keywords or browse our trending topics."
                : "There are no stories published yet. Check back soon for new content."}
            </p>
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="mt-6 px-4 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : null}

        {/* Skeletons while loading */}
        {isLoading && (
          <div key="loading" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(showFeatured ? 4 : 6)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <PostListPulse />
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {posts.length > 0 && total > postsPerPage && (
        <div className="mt-12 flex justify-center">
          <Paginate
            prev={() => onPageChange(Math.max(0, currentPage - 1))}
            next={() =>
              onPageChange(
                Math.min(
                  Math.ceil(total / postsPerPage) - 1,
                  currentPage + 1
                )
              )
            }
            goToPage={(page) => onPageChange(page)}
            limit={postsPerPage}
            offset={currentPage * postsPerPage}
            total={total}
            length={posts.length}
            currentPage={currentPage}
            getPageHref={getPageHref}
          />
        </div>
      )}
    </div>
  );
};

export default BlogPosts;
