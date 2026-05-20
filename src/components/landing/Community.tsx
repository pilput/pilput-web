"use client";

import { useState, useCallback } from "react";
import RandomPosts from "@/components/post/RandomPosts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Community() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setIsRefreshing(false), 700);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-background py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-44 bg-linear-to-b from-muted/55 to-transparent dark:from-muted/20" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none z-10" />

      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-blob-float pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-blob-float pointer-events-none" style={{ animationDelay: "-6s" }} />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center sm:mb-16 landing-reveal">
          <Badge
            variant="outline"
            className="h-8 rounded-md border-primary/25 bg-primary/5 hover:bg-primary/10 px-4 text-xs font-semibold text-primary backdrop-blur-md transition-all duration-300 animate-pulse-slow cursor-default"
          >
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Fresh reads
          </Badge>

          <h2 className="mt-6 text-3xl font-black leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Explore what the community{" "}
            <span className="block bg-linear-to-r from-primary via-primary/90 to-purple-500 bg-clip-text text-transparent">
              is publishing.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Read recent stories, essays, and experiments from people building their voice in public.
          </p>
        </div>

        {/* Feed container with smooth transition animation on refresh */}
        <div
          className={cn(
            "relative transition-all duration-500 ease-in-out landing-reveal landing-delay-1",
            isRefreshing
              ? "opacity-20 scale-[0.985] blur-xs pointer-events-none"
              : "opacity-100 scale-100 blur-none"
          )}
        >
          <RandomPosts key={refreshKey} showHeader={false} />
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row landing-reveal landing-delay-2">
          <Button
            variant="outline"
            size="lg"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full sm:w-auto h-12 rounded-md px-7 gap-2 border-border/70 bg-background/80 backdrop-blur-md cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <RefreshCw
              className={cn(
                "h-4 w-4 transition-transform duration-500",
                isRefreshing && "animate-spin"
              )}
            />
            Refresh feed
          </Button>
          <Link href="/blog" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 group rounded-md px-7 gap-2 shadow-md shadow-primary/20 bg-linear-to-r from-primary to-primary/95 text-primary-foreground hover:brightness-110 hover:shadow-primary/30 transition-all duration-300 cursor-pointer"
            >
              Explore all articles
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
