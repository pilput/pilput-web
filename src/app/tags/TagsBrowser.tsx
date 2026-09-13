"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Hash, TrendingUp, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface TagListItem {
  id: string;
  name: string;
  created_at: string;
}

export default function TagsBrowser({ tags }: { tags: TagListItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTags = useMemo(
    () =>
      tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, tags]
  );

  const sortedTags = useMemo(
    () => [...filteredTags].sort((a, b) => a.name.localeCompare(b.name)),
    [filteredTags]
  );

  const recentTags = useMemo(
    () =>
      [...tags]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 10),
    [tags]
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-foreground">Browse Tags</h2>
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

      {sortedTags.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedTags.map((tag) => (
            <Link key={tag.id} href={`/tags/${encodeURIComponent(tag.name)}`}>
              <Card className="glass-card border-border/60 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
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

      {!searchTerm && recentTags.length > 0 && (
        <div className="mt-12">
          <Card className="glass-card border-glow-hover bg-card/90 py-0">
            <CardContent className="p-5">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Recently Added Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {recentTags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${encodeURIComponent(tag.name)}`}
                    className="px-2.5 py-1 bg-muted rounded-full text-xs font-semibold text-foreground/80 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200 hover:scale-102 border border-border/50"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
