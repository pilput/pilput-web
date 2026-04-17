"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Bot,
  BookOpen,
  MessageCircle,
  PieChart,
  Sparkles,
  ArrowUpRight,
  Globe,
  TrendingUp,
  Cpu,
  Wifi,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Visual sub-components for each card
───────────────────────────────────────────── */

/** Immersive Writing — animated editor mockup */
const WritingVisual = () => (
  <div className="absolute bottom-0 left-0 right-0 h-[55%] px-6 overflow-hidden pointer-events-none">
    <div className="w-full h-full bg-background/50 backdrop-blur-md rounded-t-2xl border-t border-x border-border/50 p-5 translate-y-3 group-hover:translate-y-0 transition-transform duration-700 ease-out shadow-2xl">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/40">
        {["B", "I", "H1"].map((t) => (
          <span key={t} className="text-[10px] font-bold text-muted-foreground/60 bg-muted/40 rounded px-1.5 py-0.5">
            {t}
          </span>
        ))}
        <div className="ml-auto w-16 h-1.5 bg-blue-500/30 rounded-full" />
      </div>
      {/* Content lines */}
      <div className="space-y-2.5">
        <div className="h-2.5 w-1/3 bg-primary/30 rounded-full" />
        <div className="h-2 w-full bg-muted/60 rounded-full" />
        <div className="h-2 w-[90%] bg-muted/60 rounded-full" />
        <div className="h-2 w-3/4 bg-muted/60 rounded-full" />
        {/* Cursor blink */}
        <div className="inline-flex items-center gap-1 mt-1">
          <div className="h-2 w-24 bg-muted/40 rounded-full" />
          <div className="h-4 w-0.5 bg-blue-400 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

/** AI Workspace — typing indicator + AI bubble */
const AIVisual = () => (
  <div className="absolute bottom-5 right-4 left-4 space-y-2 pointer-events-none">
    {/* User message */}
    <div className="flex justify-end">
      <div className="bg-primary/20 text-primary text-[10px] font-medium px-3 py-1.5 rounded-2xl rounded-br-sm max-w-[75%]">
        Make this punchier
      </div>
    </div>
    {/* AI response bubble */}
    <div className="flex items-end gap-1.5">
      <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
        <Cpu className="w-2.5 h-2.5 text-purple-400" />
      </div>
      <div className="bg-muted/50 backdrop-blur-sm text-[10px] text-muted-foreground px-3 py-1.5 rounded-2xl rounded-bl-sm">
        <span className="inline-flex gap-1">
          <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </span>
      </div>
    </div>
  </div>
);

/** Global Edge — world map dots + latency badge */
const GlobalVisual = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Ping circles */}
    {[
      { top: "30%", left: "20%", color: "bg-orange-400", delay: "0s" },
      { top: "55%", left: "65%", color: "bg-orange-300", delay: "0.4s" },
      { top: "20%", left: "70%", color: "bg-orange-500", delay: "0.8s" },
    ].map((dot, i) => (
      <span key={i} className="absolute" style={{ top: dot.top, left: dot.left }}>
        <span className={cn("absolute inline-flex w-3 h-3 rounded-full opacity-70 animate-ping", dot.color)} style={{ animationDelay: dot.delay }} />
        <span className={cn("relative inline-flex w-3 h-3 rounded-full", dot.color, "opacity-90")} />
      </span>
    ))}
    {/* Lines connecting dots (SVG) */}
    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 120" preserveAspectRatio="none">
      <line x1="40" y1="36" x2="130" y2="66" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="text-orange-400" />
      <line x1="130" y1="66" x2="140" y2="24" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="text-orange-400" />
    </svg>
    {/* Latency badge */}
    <div className="absolute bottom-5 right-5 flex items-center gap-1.5 bg-background/60 backdrop-blur-md border border-border/50 rounded-xl px-3 py-1.5 shadow-lg">
      <Wifi className="w-3 h-3 text-orange-400" />
      <span className="text-[10px] font-bold text-orange-400">12ms</span>
      <span className="text-[10px] text-muted-foreground">latency</span>
    </div>
  </div>
);

/** Insights — mini bar chart */
const InsightsVisual = () => {
  const bars = [40, 65, 45, 80, 55, 90, 70];
  return (
    <div className="absolute bottom-5 left-5 right-5 pointer-events-none">
      <div className="flex items-end gap-1.5 h-14">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-indigo-500/30 group-hover:bg-indigo-500/50 transition-all duration-500 relative overflow-hidden"
            style={{ height: `${h}%`, transitionDelay: `${i * 60}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/60 to-transparent" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <TrendingUp className="w-3 h-3 text-indigo-400" />
        <span className="text-[10px] font-semibold text-indigo-400">+24% this week</span>
      </div>
    </div>
  );
};

/** Community — conversation bubbles */
const CommunityVisual = () => (
  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-none w-[45%]">
    {/* Bubble 1 — incoming */}
    <div className="self-start flex items-end gap-1.5">
      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex-shrink-0" />
      <div className="bg-muted/60 backdrop-blur-sm text-[10px] text-muted-foreground px-3 py-2 rounded-2xl rounded-bl-sm leading-relaxed max-w-[85%]">
        Great post! 🔥
      </div>
    </div>
    {/* Bubble 2 — outgoing */}
    <div className="self-end">
      <div className="bg-emerald-500/20 text-emerald-300 text-[10px] px-3 py-2 rounded-2xl rounded-br-sm leading-relaxed">
        Thanks! More soon 🙌
      </div>
    </div>
    {/* Bubble 3 — incoming, typing */}
    <div className="self-start flex items-end gap-1.5">
      <div className="w-6 h-6 rounded-full bg-teal-500/20 flex-shrink-0" />
      <div className="bg-muted/60 backdrop-blur-sm px-3 py-2 rounded-2xl rounded-bl-sm">
        <span className="inline-flex gap-1 items-center">
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </span>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Highlights data
───────────────────────────────────────────── */

const highlights = [
  {
    title: "Immersive Writing",
    description: "A distraction-free environment designed for deep focus and effortless creation.",
    icon: BookOpen,
    className: "lg:col-span-2 lg:row-span-2",
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    iconColor: "text-blue-500",
    accentColor: "blue",
    element: <WritingVisual />,
  },
  {
    title: "AI Workspace",
    description: "Refine ideas and polish your prose with smart assistance.",
    icon: Bot,
    className: "lg:col-span-1 lg:row-span-1",
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
    iconColor: "text-purple-500",
    accentColor: "purple",
    element: <AIVisual />,
  },
  {
    title: "Global Edge",
    description: "Available everywhere, instantly.",
    icon: Globe,
    className: "lg:col-span-1 lg:row-span-1",
    gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
    iconColor: "text-orange-500",
    accentColor: "orange",
    element: <GlobalVisual />,
  },
  {
    title: "Insights",
    description: "Track your growth with beautiful analytics.",
    icon: PieChart,
    className: "lg:col-span-1 lg:row-span-1",
    gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent",
    iconColor: "text-indigo-500",
    accentColor: "indigo",
    element: <InsightsVisual />,
  },
  {
    title: "Community",
    description: "Connect with a global audience and grow your reach through meaningful interactions.",
    icon: MessageCircle,
    className: "lg:col-span-2 lg:row-span-1",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    iconColor: "text-emerald-500",
    accentColor: "emerald",
    element: <CommunityVisual />,
  },
];

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */

const Highlights = () => {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-background">
      {/* Background glows */}
      <div className="absolute top-0 right-0 -mr-64 -mt-64 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-64 -mb-64 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center"
          >
            <Badge variant="outline" className="px-5 py-2 text-xs font-bold uppercase tracking-widest border-primary/30 bg-primary/5 text-primary backdrop-blur-md rounded-full">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Core Ecosystem
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-foreground"
          >
            Tools designed for the <br />
            <span className="text-muted-foreground/40">modern creative mind.</span>
          </motion.h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-md hover:bg-card/60 hover:border-primary/30 transition-all duration-500",
                item.className,
                "min-h-[280px]"
              )}
            >
              {/* Gradient overlay on hover */}
              <div className={cn("absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700", item.gradient)} />

              {/* Card content */}
              <div className="relative p-8 lg:p-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-background/50 shadow-xl ring-1 ring-white/10", item.iconColor)}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-2 relative z-10">
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-base font-light max-w-[240px]">
                    {item.description}
                  </p>
                </div>

                {/* Unique visual element per card */}
                {item.element}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
