"use client";

import { BookOpen, Sparkles, PieChart, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const highlights = [
  {
    id: 0,
    index: "01",
    title: "Focus",
    subtitle: "Immersive Editor",
    description: "Draft articles, tutorials, and investment logs with a clean, distraction-free markdown-first editor designed for deep work.",
    icon: BookOpen,
    accent: "violet",
    colorClass: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    gradient: "from-violet-500/8 via-indigo-500/3 to-transparent",
    visual: (
      <div className="flex flex-col gap-2 w-full opacity-60 group-hover:opacity-90 transition-opacity duration-300 select-none">
        <div className="h-2 w-1/4 bg-violet-500/20 rounded-full" />
        <div className="space-y-1.5">
          <div className="h-1 w-full bg-muted-foreground/20 rounded-full" />
          <div className="h-1 w-full bg-muted-foreground/20 rounded-full" />
          <div className="h-1 w-4/5 bg-muted-foreground/20 rounded-full inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 1,
    index: "02",
    title: "Refine",
    subtitle: "AI Companion",
    description: "Brainstorm finance topics, auto-generate outlines, and refine your prose using our integrated AI helper that understands your context.",
    icon: Sparkles,
    accent: "purple",
    colorClass: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    gradient: "from-purple-500/8 via-pink-500/3 to-transparent",
    visual: (
      <div className="flex items-center gap-3 bg-muted/20 border border-border/30 rounded-xl p-2.5 w-full opacity-60 group-hover:opacity-90 transition-opacity duration-300 select-none">
        <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-1.5 w-1/3 bg-purple-500/35 rounded-full" />
          <div className="h-1 w-full bg-muted-foreground/25 rounded-full" />
        </div>
        <div className="h-5 w-12 rounded bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-[7.5px] font-bold text-purple-600 dark:text-purple-400">
          Outline
        </div>
      </div>
    ),
  },
  {
    id: 2,
    index: "03",
    title: "Track",
    subtitle: "Portfolio Dashboard",
    description: "Log your financial holdings (Stocks, Crypto, Mutual Funds) and track monthly performance, value growth, and profit/loss stats.",
    icon: PieChart,
    accent: "sky",
    colorClass: "text-sky-500 bg-sky-500/10 border-sky-500/20",
    gradient: "from-sky-500/8 via-emerald-500/3 to-transparent",
    visual: (
      <div className="w-full space-y-2.5 opacity-60 group-hover:opacity-90 transition-opacity duration-300 select-none">
        <div className="flex items-center justify-between text-[8px] font-bold text-muted-foreground">
          <span>Stocks (45%)</span>
          <span>Crypto (35%)</span>
          <span>Funds (20%)</span>
        </div>
        <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden flex gap-0.5 p-0.5">
          <div className="h-full bg-sky-500 rounded-l-full" style={{ width: "45%" }} />
          <div className="h-full bg-purple-500" style={{ width: "35%" }} />
          <div className="h-full bg-emerald-500 rounded-r-full" style={{ width: "20%" }} />
        </div>
      </div>
    ),
  },
  {
    id: 3,
    index: "04",
    title: "Connect",
    subtitle: "Share Investment Logs",
    description: "Publish your portfolio insights, share strategy lessons, and discuss asset allocation with a community of creators.",
    icon: MessageCircle,
    accent: "rose",
    colorClass: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    gradient: "from-rose-500/8 via-pink-500/3 to-transparent",
    visual: (
      <div className="flex items-center justify-between w-full opacity-60 group-hover:opacity-90 transition-opacity duration-300 select-none">
        <div className="flex -space-x-1.5 overflow-hidden">
          {["from-rose-500 to-pink-500", "from-blue-500 to-indigo-500", "from-emerald-500 to-teal-500"].map((gradient, i) => (
            <div key={i} className={cn("inline-block h-5 w-5 rounded-full border border-background bg-gradient-to-tr shadow-xs", gradient)} />
          ))}
          <div className="inline-block h-5 w-5 rounded-full border border-background bg-muted flex items-center justify-center text-[6px] font-black text-muted-foreground">
            +12
          </div>
        </div>
        <div className="text-[8px] font-bold text-muted-foreground flex items-center gap-1.5">
          <span>👏 148 claps</span>
          <span className="w-0.5 h-0.5 rounded-full bg-border" />
          <span>8 comments</span>
        </div>
      </div>
    ),
  },
];

const Highlights = () => {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-background py-20 sm:py-24 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background/40 to-background dark:from-muted/10 pointer-events-none" />
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="inline-flex items-center landing-reveal">
            <Badge
              variant="outline"
              className="h-8 rounded-full border-primary/20 bg-primary/5 hover:bg-primary/8 px-3.5 text-xs font-semibold text-primary transition-all duration-300 shadow-xs cursor-default"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2 animate-pulse-slow" />
              Core workflow
            </Badge>
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-foreground landing-reveal landing-delay-1 sm:text-4xl lg:text-5xl">
            Everything around the writing stays quiet.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground landing-reveal landing-delay-2 sm:text-lg">
            Drafting, feedback, publishing, and discovery live in one focused
            flow so the page stays about the idea.
          </p>
        </div>

        {/* 2x2 Clean Minimalist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-3xl border border-border/30 bg-card/45 backdrop-blur-md p-8 sm:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-premium border-glow-hover flex flex-col justify-between min-h-[340px] landing-reveal"
              >
                {/* Soft glow background */}
                <div className={cn("absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none", item.gradient)} />
                
                <div>
                  {/* Top row */}
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs transition-colors", item.colorClass)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground/40 group-hover:text-muted-foreground/80 transition-colors">
                      {item.index}
                    </span>
                  </div>

                  {/* Info details */}
                  <div className="space-y-3 relative z-10">
                    <div className="text-[9px] font-extrabold tracking-widest uppercase text-muted-foreground/60">{item.title}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{item.subtitle}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground max-w-[420px]">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Micro Visual */}
                <div className="mt-8 pt-6 border-t border-border/20 relative z-10">
                  {item.visual}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Highlights;
