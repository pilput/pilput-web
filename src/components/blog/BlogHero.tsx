"use client";

import { Search, X, Clock3 } from "lucide-react";

interface BlogHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleClearSearch: () => void;
  trendingTags: string[];
  onTagClick: (tag: string) => void;
}

const BlogHero = ({
  searchQuery,
  setSearchQuery,
  handleClearSearch,
  trendingTags,
  onTagClick,
}: BlogHeroProps) => {
  return (
    <div
      className="relative overflow-hidden border-b border-border/70 bg-background"
    >
      <div className="absolute inset-0 bg-grid-slate-100/[0.08] dark:bg-grid-slate-800/[0.1] bg-size-[32px_32px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold border border-primary/20">
            Freshly curated for you
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Latest Stories
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Discover stories, thinking, and expertise from writers on every topic.
          </p>
        </div>
        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <div role="search" className="relative group rounded-full border border-border/70 bg-card">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5" aria-hidden="true" />
            <input
              type="search"
              enterKeyHint="search"
              placeholder="Search articles, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-transparent border border-transparent rounded-full text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus:border-primary/40 transition-colors duration-200 [&::-webkit-search-cancel-button]:hidden"
              aria-label="Search blog posts"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
          {Array.isArray(trendingTags) && trendingTags.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-foreground/80 font-medium text-xs">
                  <Clock3 className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                  Trending:
                </span>
                {trendingTags.slice(0, 5).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onTagClick(tag)}
                    aria-pressed={searchQuery === tag}
                    className="min-h-8 px-3 py-1 rounded-full border border-border/60 bg-card/80 hover:border-primary/40 hover:text-primary aria-pressed:border-primary/50 aria-pressed:bg-primary/10 aria-pressed:text-primary transition-colors duration-200 text-foreground text-xs font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  >
                    #{tag}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
