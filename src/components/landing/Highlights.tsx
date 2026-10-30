"use client";

import { BookOpen, Lightbulb, PieChart, MessageCircle, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

const highlights = [
  {
    id: 0,
    index: "01",
    title: "Focus",
    subtitle: "Immersive Editor",
    description: "Draft articles, tutorials, and essays with a clean, distraction-free markdown-first editor designed for deep work.",
    icon: BookOpen,
    colorClass: "text-primary bg-primary/10 border-primary/20",
    visual: (
      <div className="flex flex-col gap-2 w-full opacity-80 select-none">
        <div className="h-2 w-1/4 bg-primary/20 rounded-full" />
        <div className="space-y-1.5">
          <div className="h-1 w-full bg-muted-foreground/20 rounded-full" />
          <div className="h-1 w-full bg-muted-foreground/20 rounded-full" />
          <div className="h-1 w-4/5 bg-muted-foreground/20 rounded-full inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
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
    description: "Brainstorm topics, auto-generate outlines, and refine your prose using our integrated AI helper that understands your context.",
    icon: Lightbulb,
    colorClass: "text-primary bg-primary/10 border-primary/20",
    visual: (
      <div className="flex items-center gap-3 bg-muted/20 border border-border/30 rounded-xl p-2.5 w-full opacity-80 select-none">
        <Lightbulb className="w-3.5 h-3.5 text-primary shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-1.5 w-1/3 bg-primary/35 rounded-full" />
          <div className="h-1 w-full bg-muted-foreground/25 rounded-full" />
        </div>
        <div className="h-5 w-12 rounded bg-primary/10 border border-primary/25 flex items-center justify-center text-[7.5px] font-bold text-primary">
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
    colorClass: "text-primary bg-primary/10 border-primary/20",
    visual: (
      <div className="w-full space-y-2.5 opacity-80 select-none">
        <div className="flex items-center justify-between text-[8px] font-bold text-muted-foreground">
          <span>Stocks (45%)</span>
          <span>Crypto (35%)</span>
          <span>Funds (20%)</span>
        </div>
        <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden flex gap-0.5 p-0.5">
          <div className="h-full bg-chart-1 rounded-l-full" style={{ width: "45%" }} />
          <div className="h-full bg-chart-2" style={{ width: "35%" }} />
          <div className="h-full bg-chart-4 rounded-r-full" style={{ width: "20%" }} />
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
    colorClass: "text-primary bg-primary/10 border-primary/20",
    visual: (
      <div className="flex items-center justify-between w-full opacity-80 select-none">
        <div className="flex -space-x-1.5 overflow-hidden">
          {["bg-chart-1", "bg-chart-2", "bg-chart-4"].map((color, i) => (
            <div key={i} className={cn("inline-block h-5 w-5 rounded-full border border-background", color)} />
          ))}
          <div className="inline-block h-5 w-5 rounded-full border border-background bg-muted flex items-center justify-center text-[6px] font-black text-muted-foreground">
            +12
          </div>
        </div>
        <div className="text-[8px] font-bold text-muted-foreground flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1">
            <Heart className="h-2.5 w-2.5 text-primary" />
            148 likes
          </span>
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
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="inline-flex items-center landing-reveal">
            <Badge
              variant="outline"
              className="h-8 rounded-full border-primary/20 bg-primary/5 px-3.5 text-xs font-semibold text-primary cursor-default"
            >
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
                className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-8 sm:p-10 flex flex-col justify-between min-h-[340px] landing-reveal"
              >
                
                <div>
                  {/* Top row */}
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center border  transition-colors", item.colorClass)}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span aria-hidden="true" className="text-xs font-mono font-bold tracking-widest text-muted-foreground/60">
                      {item.index}
                    </span>
                  </div>

                  {/* Info details */}
                  <div className="space-y-3 relative z-10">
                    <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">{item.title}</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{item.subtitle}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground max-w-[420px]">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Micro Visual */}
                <div aria-hidden="true" className="mt-8 pt-6 border-t border-border/40 relative z-10">
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
