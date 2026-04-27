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
    setTimeout(() => setIsRefreshing(false), 600);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-background py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-grid-slate-100/[0.03] dark:bg-grid-white/[0.02] bg-[length:40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(var(--color-primary),0.07),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(var(--color-primary),0.05),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none z-10" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center sm:mb-16 landing-reveal">
          <Badge variant="outline" className="h-8 rounded-full border-primary/25 bg-primary/8 px-4 text-xs font-semibold text-primary backdrop-blur-sm">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Fresh reads
          </Badge>

          <h2 className="mt-6 text-3xl font-black leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Explore what the community{" "}
            <span className="bg-linear-to-r from-primary via-primary/85 to-primary/60 bg-clip-text text-transparent">
              is publishing.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Read recent stories, essays, and experiments from people building their voice in public.
          </p>
        </div>

        <div className="relative landing-reveal landing-delay-1">
          <RandomPosts key={refreshKey} showHeader={false} />
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row landing-reveal landing-delay-2">
          <Button variant="outline" size="lg" onClick={handleRefresh} disabled={isRefreshing} className="rounded-full px-7 gap-2 border-border/70 bg-background/70 backdrop-blur-md">
            <RefreshCw className={cn("h-4 w-4 transition-transform duration-300", isRefreshing && "animate-spin")} />
            Refresh feed
          </Button>
          <Link href="/blog">
            <Button size="lg" className="group rounded-full px-7 gap-2 shadow-lg shadow-primary/20">
              Explore all articles
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
