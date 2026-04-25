import { ArrowUpRight, BookOpen, Bot, Cpu, Globe, MessageCircle, PieChart, Sparkles, TrendingUp, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const WritingVisual = () => (
  <div className="absolute bottom-0 left-0 right-0 h-[55%] px-6 overflow-hidden pointer-events-none">
    <div className="w-full h-full bg-background/70 backdrop-blur-md rounded-t-lg border-t border-x border-border/60 p-5 translate-y-3 group-hover:translate-y-0 transition-transform duration-700 ease-out shadow-2xl">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/40">
        {["B", "I", "H1"].map((t) => (
          <span key={t} className="text-[10px] font-bold text-muted-foreground/60 bg-muted/40 rounded px-1.5 py-0.5">
            {t}
          </span>
        ))}
        <div className="ml-auto w-16 h-1.5 bg-primary/30 rounded-full" />
      </div>
      <div className="space-y-2.5">
        <div className="h-2.5 w-1/3 bg-primary/30 rounded-full" />
        <div className="h-2 w-full bg-muted/60 rounded-full" />
        <div className="h-2 w-[90%] bg-muted/60 rounded-full" />
        <div className="h-2 w-3/4 bg-muted/60 rounded-full" />
        <div className="inline-flex items-center gap-1 mt-1">
          <div className="h-2 w-24 bg-muted/40 rounded-full" />
          <div className="h-4 w-0.5 bg-primary/60 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

const AIVisual = () => (
  <div className="absolute bottom-5 right-4 left-4 space-y-2 pointer-events-none">
    <div className="flex justify-end">
      <div className="bg-primary/20 text-primary text-[10px] font-medium px-3 py-1.5 rounded-2xl rounded-br-sm max-w-[75%]">
        Make this punchier
      </div>
    </div>
    <div className="flex items-end gap-1.5">
      <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
        <Cpu className="w-2.5 h-2.5 text-primary" />
      </div>
      <div className="bg-muted/50 backdrop-blur-sm text-[10px] text-muted-foreground px-3 py-1.5 rounded-2xl rounded-bl-sm">
        <span className="inline-flex gap-1">
          <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </span>
      </div>
    </div>
  </div>
);

const GlobalVisual = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[
      { top: "30%", left: "20%", color: "bg-primary/70", delay: "0s" },
      { top: "55%", left: "65%", color: "bg-primary/50", delay: "0.4s" },
      { top: "20%", left: "70%", color: "bg-primary/60", delay: "0.8s" },
    ].map((dot, i) => (
      <span key={i} className="absolute" style={{ top: dot.top, left: dot.left }}>
        <span className={cn("absolute inline-flex w-3 h-3 rounded-full opacity-70 animate-ping", dot.color)} style={{ animationDelay: dot.delay }} />
        <span className={cn("relative inline-flex w-3 h-3 rounded-full", dot.color, "opacity-90")} />
      </span>
    ))}
    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 120" preserveAspectRatio="none">
      <line x1="40" y1="36" x2="130" y2="66" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="text-primary" />
      <line x1="130" y1="66" x2="140" y2="24" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="text-primary" />
    </svg>
    <div className="absolute bottom-5 right-5 flex items-center gap-1.5 bg-background/60 backdrop-blur-md border border-border/50 rounded-xl px-3 py-1.5 shadow-lg">
      <Wifi className="w-3 h-3 text-primary" />
      <span className="text-[10px] font-bold text-primary">12ms</span>
      <span className="text-[10px] text-muted-foreground">latency</span>
    </div>
  </div>
);

const InsightsVisual = () => {
  const bars = [40, 65, 45, 80, 55, 90, 70];
  return (
    <div className="absolute bottom-5 left-5 right-5 pointer-events-none">
      <div className="flex items-end gap-1.5 h-14">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-primary/25 group-hover:bg-primary/40 transition-all duration-500 relative overflow-hidden"
            style={{ height: `${h}%`, transitionDelay: `${i * 60}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <TrendingUp className="w-3 h-3 text-primary" />
        <span className="text-[10px] font-semibold text-primary">+24% this week</span>
      </div>
    </div>
  );
};

const CommunityVisual = () => (
  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-none w-[45%]">
    <div className="self-start flex items-end gap-1.5">
      <div className="w-6 h-6 rounded-full bg-primary/15 flex-shrink-0" />
      <div className="bg-muted/60 backdrop-blur-sm text-[10px] text-muted-foreground px-3 py-2 rounded-2xl rounded-bl-sm leading-relaxed max-w-[85%]">
        Great post!
      </div>
    </div>
    <div className="self-end">
      <div className="bg-primary/15 text-primary text-[10px] px-3 py-2 rounded-2xl rounded-br-sm leading-relaxed">
        Thanks! More soon
      </div>
    </div>
    <div className="self-start flex items-end gap-1.5">
      <div className="w-6 h-6 rounded-full bg-teal-500/20 flex-shrink-0" />
      <div className="bg-muted/60 backdrop-blur-sm px-3 py-2 rounded-2xl rounded-bl-sm">
        <span className="inline-flex gap-1 items-center">
          <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </span>
      </div>
    </div>
  </div>
);

const highlights = [
  {
    title: "Immersive Writing",
    description: "A distraction-free environment designed for deep focus and effortless creation.",
    icon: BookOpen,
    className: "lg:col-span-2 lg:row-span-2",
    gradient: "from-primary/15 via-primary/5 to-transparent",
    iconColor: "text-primary",
    element: <WritingVisual />,
  },
  {
    title: "AI Workspace",
    description: "Refine ideas and polish your prose with smart assistance.",
    icon: Bot,
    className: "lg:col-span-1 lg:row-span-1",
    gradient: "from-primary/15 via-primary/5 to-transparent",
    iconColor: "text-primary",
    element: <AIVisual />,
  },
  {
    title: "Global Edge",
    description: "Available everywhere, instantly.",
    icon: Globe,
    className: "lg:col-span-1 lg:row-span-1",
    gradient: "from-primary/15 via-primary/5 to-transparent",
    iconColor: "text-primary",
    element: <GlobalVisual />,
  },
  {
    title: "Insights",
    description: "Track your growth with beautiful analytics.",
    icon: PieChart,
    className: "lg:col-span-1 lg:row-span-1",
    gradient: "from-primary/15 via-primary/5 to-transparent",
    iconColor: "text-primary",
    element: <InsightsVisual />,
  },
  {
    title: "Community",
    description: "Connect with a global audience and grow your reach through meaningful interactions.",
    icon: MessageCircle,
    className: "lg:col-span-2 lg:row-span-1",
    gradient: "from-primary/15 via-primary/5 to-transparent",
    iconColor: "text-primary",
    element: <CommunityVisual />,
  },
];

const Highlights = () => {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-background py-16 sm:py-20 lg:py-24">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="inline-flex items-center landing-reveal">
            <Badge variant="outline" className="h-8 rounded-md border-primary/25 bg-primary/5 px-3 text-xs font-semibold text-primary backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Core workflow
            </Badge>
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-foreground landing-reveal landing-delay-1 sm:text-4xl lg:text-6xl">
            Everything around the writing stays quiet.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground landing-reveal landing-delay-2 sm:text-lg">
            Drafting, feedback, publishing, and discovery live in one focused
            flow so the page stays about the idea.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className={cn(
                "group relative overflow-hidden rounded-lg border border-border/60 bg-card/70 backdrop-blur-md hover:bg-card hover:border-primary/30 transition-all duration-500",
                item.className,
                "min-h-[280px] landing-reveal"
              )}
              style={{ animationDelay: `${180 + index * 80}ms` }}
            >
              <div className={cn("absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700", item.gradient)} />

              <div className="relative p-8 lg:p-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("w-11 h-11 rounded-md flex items-center justify-center bg-background/70 shadow-sm ring-1 ring-border/50", item.iconColor)}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-2 relative z-10">
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base max-w-[260px]">
                    {item.description}
                  </p>
                </div>

                {item.element}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
