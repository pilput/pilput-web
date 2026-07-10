"use client";
import React, { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/header/Navbar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Hash,
  TrendingUp,
  Search,
  ArrowRight,
  Tag as TagIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { apiClient } from "@/utils/fetch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

interface TagWithStats {
  id: string;
  name: string;
  description?: string;
  post_count?: number;
  created_at: string;
}

const TagsPage = () => {
  const [tags, setTags] = useState<TagWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchTags() {
      setIsLoading(true);
      try {
        const { data: response } = await apiClient.get<{
          data?: Array<Omit<TagWithStats, "post_count">>;
        }>("/api/tags");
        if (response.data) {
          // Add mock post counts since the API doesn't provide them
          const tagsWithStats = response.data.map((tag) => ({
            ...tag,
            post_count: Math.floor(Math.random() * 50) + 1, // Mock data
          }));
          setTags(tagsWithStats);
        } else {
          console.error("Error loading tags");
        }
      } catch (error) {
        console.error("Error loading tags:", error);
        // Fallback to default tags if API fails
        const fallbackTags = [
          { id: "1", name: "ai", post_count: 25, created_at: new Date().toISOString() },
          { id: "2", name: "nextjs", post_count: 18, created_at: new Date().toISOString() },
          { id: "3", name: "typescript", post_count: 32, created_at: new Date().toISOString() },
          { id: "4", name: "webdev", post_count: 45, created_at: new Date().toISOString() },
          { id: "5", name: "react", post_count: 28, created_at: new Date().toISOString() },
          { id: "6", name: "javascript", post_count: 35, created_at: new Date().toISOString() },
        ];
        setTags(fallbackTags);
      }
      setIsLoading(false);
    }
    fetchTags();
  }, []);

  const filteredTags = useMemo(
    () =>
      tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, tags]
  );

  const sortedTags = useMemo(
    () =>
      [...filteredTags].sort(
        (a, b) => (b.post_count || 0) - (a.post_count || 0)
      ),
    [filteredTags]
  );

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="mb-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                ← Back to Blog
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <TagIcon className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                All Tags
              </h1>
            </div>
            <p className="text-muted-foreground">
              Explore topics and discover content by tags
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Stats */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-foreground">
                Browse Tags
              </h2>
              <Badge className="bg-muted text-muted-foreground border border-border/40 font-semibold">
                {filteredTags.length} tags
              </Badge>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border/80"
              />
            </div>
          </div>

          {/* Tags Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sortedTags.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedTags.map((tag) => (
                <Link key={tag.id} href={`/tags/${encodeURIComponent(tag.name)}`}>
                  <Card className="glass-card border-border/60 hover:shadow-premium hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Hash className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            #{tag.name}
                          </h3>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      
                      {tag.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {tag.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-semibold">
                          {tag.post_count || 0} posts
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(tag.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No tags found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? `No tags match "${searchTerm}". Try a different search term.`
                  : "No tags are available at the moment."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Popular Tags Section */}
          {!searchTerm && sortedTags.length > 0 && (
            <div className="mt-12">
              <Card className="glass-card shadow-premium border-glow-hover bg-card/90 py-0">
                <CardContent className="p-5">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Most Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {sortedTags.slice(0, 10).map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/tags/${encodeURIComponent(tag.name)}`}
                        className="px-2.5 py-1 bg-muted rounded-full text-xs font-semibold text-foreground/80 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200 hover:scale-102 flex items-center gap-1 border border-border/50"
                      >
                        #{tag.name}
                        <Badge className="ml-1 bg-primary/10 text-primary border border-primary/20 text-[10px] h-4 px-1 flex items-center font-bold">
                          {tag.post_count}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TagsPage;