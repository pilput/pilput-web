"use client";

import { useState } from "react";
import { Search, X, Sparkles, Clock3 } from "lucide-react";

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div
      className="relative overflow-hidden border-b border-border/70 bg-background/90 backdrop-blur"
    >
      <div className="absolute inset-0 bg-grid-slate-100/[0.08] dark:bg-grid-slate-800/[0.1] bg-size-[32px_32px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] font-semibold border border-primary/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Freshly curated for you
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Latest Stories
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Discover stories, thinking, and expertise from writers on every topic.
          </p>
        </div>
        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <div className="relative group shadow-md shadow-primary/5 rounded-full border border-border/70 bg-card/85 backdrop-blur-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Search articles, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-11 pr-12 py-3 bg-transparent border border-transparent rounded-full text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/25 transition-all"
              aria-label="Search blog posts"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {Array.isArray(trendingTags) && trendingTags.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-foreground/80 font-medium text-[11px]">
                  <Clock3 className="w-3 h-3 text-muted-foreground" />
                  Trending:
                </span>
                {trendingTags.slice(0, 5).map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => onTagClick(tag)}
                    className="px-2.5 py-1 rounded-full border border-border/60 bg-card/80 hover:border-primary/40 hover:-translate-y-0.5 transition-all text-foreground text-[11px] font-medium cursor-pointer"
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
