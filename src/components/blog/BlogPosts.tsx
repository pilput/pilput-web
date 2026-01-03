"use client";

import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import { Paginate } from "@/components/common/Paginate";
import { Filter, X, FileQuestion, Sparkles } from "lucide-react";
import type { Post } from "@/types/post";

interface BlogPostsProps {
  posts: Post[];
  isLoading: boolean;
  total: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  postsPerPage: number;
  searchQuery: string; // This should be the active filter (debounced)
  onClearSearch: () => void;
}

const BlogPosts = ({
  posts,
  isLoading,
  total,
  currentPage,
  setCurrentPage,
  postsPerPage,
  searchQuery,
  onClearSearch,
}: BlogPostsProps) => {
  const totalPages = Math.max(1, Math.ceil(total / postsPerPage));

  return (
    <div className="flex-1">
      {/* Toolbar */}
      <div className="sticky top-3 z-20 mb-4">
        <div className="flex flex-wrap items-center gap-3 bg-card/90 border border-border/70 rounded-2xl px-4 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-foreground font-semibold">
            <Sparkles className="w-4 h-4 text-primary" />
            {total ? `${total} stories` : "Stories"}
          </div>
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </div>
          {searchQuery && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-foreground text-sm border border-border/60">
                <Filter className="w-3 h-3" />
                Searching "{searchQuery}"
                <button
                  onClick={onClearSearch}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear search filter"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
        </div>
      </div>

      <div className="space-y-4">
          {posts.length > 0 ? (
            <div key="posts">
              {posts.map((post, index) => (
                <div key={post.id} className="mb-4">
                  <Postlist post={post} />
                </div>
              ))}
            </div>
          ) : !isLoading ? (
            <div
              key="empty"
              className="text-center py-20 px-4 bg-card/50 rounded-2xl border border-dashed border-border"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
                <FileQuestion className="w-10 h-10 text-muted-foreground/60" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "No posts found"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery
                  ? "We couldn't find any articles matching your search. Try different keywords or browse our trending topics."
                  : "There are no stories published yet. Check back soon for new content."}
              </p>
              {searchQuery && (
                <button
                  onClick={onClearSearch}
                  className="mt-6 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : null}
        {isLoading && (
          <div key="loading">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <Postlistpulse />
                </div>
              ))}
          </div>
        )}
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
  );
};

export default BlogPosts;
