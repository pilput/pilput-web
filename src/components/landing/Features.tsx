"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bot,
  MessageCircle,
  PenTool,
  PieChart,
  Star,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  background: ReactNode;
  stats: string;
  cta: string;
  href: string;
  glow: string;
  accentColor: string;
}

const Features = () => {
  const features: Feature[] = [
    {
      id: "content-creation",
      icon: BookOpen,
      title: "Immersive Writing",
      description:
        "Craft stories that captivate with high-performance writing tools. Enjoy a clean space with instant formatting and media integration.",
      background: (
        <div className="absolute inset-0 overflow-hidden opacity-5 dark:opacity-[0.08] transition-opacity duration-500 group-hover:opacity-12">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="absolute top-0 right-0 p-8 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
            <PenTool className="w-32 h-32 text-primary" />
          </div>
        </div>
      ),
      stats: "Clean & Simple",
      cta: "Start writing",
      href: "/dashboard/posts/create",
      glow: "from-primary/10 to-transparent",
      accentColor: "border-primary/20 text-primary bg-primary/10",
    },
    {
      id: "ai-chat",
      icon: Bot,
      title: "Creative Companion",
      description:
        "Never stare at a blank page again. Our smart assistant helps you brainstorm topics, outline ideas, and refine your tone as you write.",
      background: (
        <div className="absolute inset-0 overflow-hidden opacity-5 dark:opacity-[0.08] transition-opacity duration-500 group-hover:opacity-12">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="absolute bottom-0 left-0 p-8 transform -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
            <MessageCircle className="w-32 h-32 text-purple-500" />
          </div>
        </div>
      ),
      stats: "Smart Assistant",
      cta: "Try Assistant",
      href: "/chat",
      glow: "from-purple-500/10 to-transparent",
      accentColor: "border-purple-500/20 text-purple-600 dark:text-purple-400 bg-purple-500/10",
    },
    {
      id: "holdings",
      icon: PieChart,
      title: "Personal Dashboard",
      description:
        "Stay organized and track your progress. Manage your stories and get clear insights into how your content is performing.",
      background: (
        <div className="absolute inset-0 overflow-hidden opacity-5 dark:opacity-[0.08] transition-opacity duration-500 group-hover:opacity-12">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="absolute top-0 left-0 p-8 transform -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
            <TrendingUp className="w-32 h-32 text-indigo-500" />
          </div>
        </div>
      ),
      stats: "All-in-one",
      cta: "Go to Dashboard",
      href: "/dashboard/holdings",
      glow: "from-indigo-500/10 to-transparent",
      accentColor: "border-indigo-500/20 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border/40 py-20 sm:py-24 lg:py-28 bg-linear-to-b from-transparent to-muted/20">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="landing-reveal">
              <Badge
                variant="outline"
                className="h-8 rounded-full border-primary/20 bg-primary/5 hover:bg-primary/8 px-3.5 text-xs font-semibold text-primary transition-all duration-300"
              >
                Platform tools
              </Badge>
            </div>
            <h2 className="text-3xl font-black leading-tight tracking-tight landing-reveal landing-delay-1 sm:text-4xl lg:text-5xl">
              A practical workspace for writers who ship.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground landing-reveal landing-delay-2 sm:text-lg">
            Compose, improve, and manage your work with tools that feel fast
            enough to disappear while you use them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Link
              key={feature.id}
              href={feature.href}
              className="block landing-reveal"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <article
                className={cn(
                  "group relative h-[350px] w-full overflow-hidden rounded-2xl",
                  "glass-card border-glow-hover shadow-premium hover:shadow-premium-hover",
                  "transition-all duration-500 ease-out hover:-translate-y-1.5"
                )}
              >
                {/* Custom glow gradient on hover */}
                <div
                  className={cn(
                    "absolute -inset-px bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10",
                    feature.glow
                  )}
                />

                {feature.background}
                <div className="relative h-full flex flex-col p-6 sm:p-8 z-10">
                  <div className="mb-auto">
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xs border",
                          feature.accentColor
                        )}
                      >
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <Badge
                        variant="outline"
                        className="rounded-full border-primary/20 text-[10px] uppercase tracking-widest font-bold bg-background/80 px-2.5 py-0.5"
                      >
                        {feature.stats}
                      </Badge>
                    </div>
                    <h3 className="mb-3 text-xl font-bold tracking-tight sm:text-2xl group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center text-sm font-bold text-primary group/btn">
                    <span className="mr-2 relative overflow-hidden inline-block pb-0.5">
                      {feature.cta}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover/btn:w-full" />
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
