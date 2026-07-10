"use client";

import { useState, useEffect } from "react";
import { BookOpen, Sparkles, PieChart, MessageCircle, Check, X, Play, Pause, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Steps definition
const steps = [
  {
    id: 0,
    title: "Focus",
    subtitle: "Immersive Editor",
    description: "Draft articles, tutorials, and investment logs with a clean, distraction-free markdown-first editor.",
    icon: BookOpen,
    accent: "violet",
    colorClass: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    gradient: "from-violet-500/12 via-indigo-500/5 to-transparent",
  },
  {
    id: 1,
    title: "Refine",
    subtitle: "AI Companion",
    description: "Brainstorm finance topics, auto-generate outlines, and refine your prose using our integrated AI helper.",
    icon: Sparkles,
    accent: "purple",
    colorClass: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    gradient: "from-purple-500/12 via-pink-500/5 to-transparent",
  },
  {
    id: 2,
    title: "Track",
    subtitle: "Portfolio Dashboard",
    description: "Log your financial holdings (Stocks, Crypto, Mutual Funds) and track monthly performance, value growth, and profit/loss stats.",
    icon: PieChart,
    accent: "sky",
    colorClass: "text-sky-500 bg-sky-500/10 border-sky-500/20",
    gradient: "from-sky-500/12 via-emerald-500/5 to-transparent",
  },
  {
    id: 3,
    title: "Connect",
    subtitle: "Share Investment Logs",
    description: "Publish your portfolio insights, share strategy lessons, and discuss asset allocation with a community of creators.",
    icon: MessageCircle,
    accent: "rose",
    colorClass: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    gradient: "from-rose-500/12 via-pink-500/5 to-transparent",
  },
];

const DraftMockup = ({ typewriterText }: { typewriterText: string }) => (
  <div className="p-6 font-sans flex flex-col gap-3 h-full select-none text-left">
    <div className="space-y-1.5">
      <div className="text-[10px] font-extrabold text-violet-500 tracking-wider uppercase">NEW POST</div>
      <h2 className="text-xl font-bold text-foreground leading-tight">My 2026 Asset Allocation Strategy</h2>
    </div>
    <p className="text-[10.5px] leading-relaxed text-muted-foreground font-medium flex-1">
      {typewriterText}
      <span className="inline-block h-3.5 w-0.5 ml-0.5 bg-violet-500 animate-cursor-blink align-middle" />
    </p>
  </div>
);

const RefineMockup = () => (
  <div className="p-6 font-sans flex flex-col gap-3 h-full select-none text-left relative">
    <div className="space-y-1.5 opacity-40">
      <div className="text-[10px] font-extrabold text-purple-500 tracking-wider uppercase">NEW POST</div>
      <h2 className="text-xl font-bold text-foreground leading-tight">My 2026 Asset Allocation Strategy</h2>
    </div>
    <p className="text-[10.5px] leading-relaxed text-muted-foreground font-medium flex-1">
      Writing a portfolio log helps maintain rebalancing discipline. Every year, I rebalance my index funds, stocks, and crypto back to target ratios...
    </p>

    {/* AI Tooltip */}
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.15 }}
      className="absolute top-1/2 left-6 right-6 -translate-y-1/2 bg-card border border-purple-500/35 rounded-xl p-3.5 shadow-xl backdrop-blur-md z-20 flex flex-col gap-2.5"
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
        <div className="flex items-center gap-1.5 text-purple-500">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[9px] font-extrabold tracking-wide uppercase">AI Assistant</span>
        </div>
        <span className="text-[7.5px] font-bold text-muted-foreground/80 bg-muted/40 px-1.5 py-0.5 rounded">Action: Outline</span>
      </div>
      <div className="text-[9.5px] text-muted-foreground leading-relaxed">
        Outline suggestions for <span className="font-semibold text-foreground">portfolio rebalancing</span>:
        <div className="text-foreground font-semibold mt-1.5 bg-purple-500/5 border border-purple-500/10 p-2 rounded-lg text-[9px] leading-relaxed space-y-1">
          <p>1. Assess Target Allocation vs. Current Allocations</p>
          <p>2. Set Thresholds for Rebalancing (e.g. 5% drift)</p>
          <p>3. Plan Tax-Efficient Rebalancing Transactions</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1.5">
        <button className="h-6 px-2.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 text-[8.5px] font-bold flex items-center gap-1 cursor-pointer">
          <X className="w-2.5 h-2.5" /> Reject
        </button>
        <button className="h-6 px-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-[8.5px] font-bold flex items-center gap-1 cursor-pointer">
          <Check className="w-2.5 h-2.5" /> Insert Outline
        </button>
      </div>
    </motion.div>
  </div>
);

const PortfolioMockup = () => (
  <div className="p-6 font-sans flex flex-col gap-3 h-full select-none text-left relative">
    <div className="flex items-center justify-between pb-2 border-b border-border/40 shrink-0">
      <div>
        <div className="text-[9px] font-extrabold text-sky-500 tracking-wider uppercase">PORTFOLIO TRACKER</div>
        <h2 className="text-sm font-bold text-foreground">Holdings Overview</h2>
      </div>
      <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
        <TrendingUp className="w-3 h-3" />
        <span>+18.57% (Rp 19,500,000)</span>
      </div>
    </div>

    {/* Summary statistics */}
    <div className="grid grid-cols-2 gap-4 py-2 border-b border-border/40 shrink-0">
      <div>
        <span className="text-[8px] font-bold text-muted-foreground uppercase">Net Worth</span>
        <div className="text-sm font-black text-foreground">Rp 124,500,000</div>
      </div>
      <div>
        <span className="text-[8px] font-bold text-muted-foreground uppercase">Total Invested</span>
        <div className="text-sm font-bold text-muted-foreground">Rp 105,000,000</div>
      </div>
    </div>

    {/* Asset Allocations Breakdown */}
    <div className="flex-1 flex flex-col justify-center gap-3">
      <div className="text-[9px] font-bold text-muted-foreground uppercase">Asset Allocation</div>
      <div className="space-y-2.5">
        {[
          { name: "Stocks (Indo)", value: "Rp 56,025,000", pct: "45%", color: "bg-sky-500" },
          { name: "Cryptocurrency", value: "Rp 43,575,000", pct: "35%", color: "bg-purple-500" },
          { name: "Mutual Funds", value: "Rp 24,900,000", pct: "20%", color: "bg-emerald-500" },
        ].map((item) => (
          <div key={item.name} className="space-y-1">
            <div className="flex items-center justify-between text-[9px] font-bold">
              <span className="text-foreground">{item.name}</span>
              <span className="text-muted-foreground">{item.value} ({item.pct})</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", item.color)} style={{ width: item.pct }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ConnectMockup = () => (
  <div className="p-6 font-sans flex flex-col justify-between h-full select-none text-left">
    {/* Article body snippet */}
    <div className="space-y-2 opacity-35">
      <div className="h-2 w-1/4 bg-primary/20 rounded-full" />
      <div className="h-1.5 w-full bg-muted-foreground/35 rounded-full" />
      <div className="h-1.5 w-[90%] bg-muted-foreground/35 rounded-full" />
    </div>

    {/* Comments section */}
    <div className="border-t border-border/40 pt-3 space-y-2.5">
      <div className="text-[8px] font-black text-rose-500 tracking-wide uppercase">Feedback & Discussion</div>
      
      {/* Comment Card */}
      <div className="flex items-start gap-2.5 bg-muted/20 border border-border/30 rounded-xl p-2.5">
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex-shrink-0 flex items-center justify-center text-[7.5px] font-black text-white shadow-xs">
          SC
        </div>
        <div className="flex-1 space-y-0.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-foreground">Sarah Chen</span>
            <span className="text-[7.5px] text-muted-foreground">3m ago</span>
          </div>
          <p className="text-[9px] text-muted-foreground leading-normal font-medium">
            Do you hold any stablecoins in your crypto allocation, or is it purely BTC and ETH?
          </p>
        </div>
      </div>
    </div>

    {/* Claps & Share bar */}
    <div className="border-t border-border/40 pt-2.5 flex items-center justify-between">
      <button className="h-7 px-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/15 transition-colors text-[8.5px] font-bold flex items-center gap-1.5 cursor-pointer">
        <span>👏</span> <span>148 Claps</span>
      </button>
      <span className="text-[8px] font-bold text-muted-foreground">1,240 Reads • 12 Comments</span>
    </div>
  </div>
);

const Highlights = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [typewriterText, setTypewriterText] = useState("");
  const draftTarget = "Writing a portfolio log helps maintain rebalancing discipline. Every year, I rebalance my index funds, stocks, and crypto back to target ratios...";

  // Typewriter effect logic for Step 0
  useEffect(() => {
    if (activeStep === 0) {
      let idx = 0;
      const interval = setInterval(() => {
        if (idx <= draftTarget.length) {
          setTypewriterText(draftTarget.slice(0, idx));
          idx++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [activeStep]);

  // Auto rotation logic
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

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

        {/* 2-Column interactive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto items-center">
          
          {/* Left Column: Selector buttons */}
          <div className="lg:col-span-5 flex flex-col gap-4 select-none">
            {steps.map((step) => {
              const isActive = activeStep === step.id;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  onClick={() => {
                    setActiveStep(step.id);
                    setIsPlaying(false); // Pause auto-rotate when user interacts
                  }}
                  className={cn(
                    "group text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden",
                    isActive
                      ? "bg-card border-border/80 shadow-premium"
                      : "bg-transparent border-transparent hover:bg-muted/30"
                  )}
                >
                  {/* Subtle active colored glow background */}
                  {isActive && (
                    <div className={cn("absolute inset-0 bg-linear-to-br opacity-100 transition-opacity duration-500", step.gradient)} />
                  )}

                  <div className="flex gap-4 items-start relative z-10">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300",
                      isActive ? step.colorClass : "text-muted-foreground bg-muted/40 border-border/40 group-hover:border-border/80"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/60">{step.title}</span>
                        {isActive && (
                          <span className={cn("w-1.5 h-1.5 rounded-full animate-ping", 
                            step.accent === "violet" && "bg-violet-500",
                            step.accent === "purple" && "bg-purple-500",
                            step.accent === "sky" && "bg-sky-500",
                            step.accent === "rose" && "bg-rose-500"
                          )} />
                        )}
                      </div>
                      <h3 className={cn(
                        "text-lg font-bold transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}>
                        {step.subtitle}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Play/Pause controls */}
            <div className="flex items-center gap-2 mt-2 px-5 text-muted-foreground">
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-muted/40 hover:bg-muted/80 px-3 py-1.5 rounded-full border border-border/50 transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-2.5 h-2.5" /> Pause Auto-Play
                  </>
                ) : (
                  <>
                    <Play className="w-2.5 h-2.5" /> Resume Auto-Play
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Unified mockup panel */}
          <div className="lg:col-span-7 w-full">
            <div className="relative aspect-video lg:aspect-auto lg:h-[390px] rounded-2xl border border-border/45 bg-card/85 text-left shadow-premium backdrop-blur-xl overflow-hidden border-glow-hover flex flex-col transition-all duration-300">
              
              {/* Browser Header */}
              <div className="flex items-center gap-1.5 border-b border-border/45 px-5 py-3.5 bg-muted/25 select-none shrink-0">
                <span className="h-2 w-2 rounded-full bg-red-500/70" />
                <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
                <span className="h-2 w-2 rounded-full bg-green-500/70" />
                <div className="ml-4 flex items-center gap-1.5 bg-background/55 border border-border/40 rounded-md px-3 py-1 text-[9px] font-semibold text-muted-foreground/80 w-44">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                  <span className="truncate select-none">compounding-ideas.md</span>
                </div>
              </div>

              {/* Main content display area */}
              <div className="flex-1 relative overflow-hidden bg-card/45">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 h-full w-full"
                  >
                    {activeStep === 0 && <DraftMockup typewriterText={typewriterText} />}
                    {activeStep === 1 && <RefineMockup />}
                    {activeStep === 2 && <PortfolioMockup />}
                    {activeStep === 3 && <ConnectMockup />}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Highlights;
