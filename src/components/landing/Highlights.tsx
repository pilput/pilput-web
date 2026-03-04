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
  Shield,
  Zap,
  Globe,
} from "lucide-react";

const highlights = [
  {
    title: "Immersive Writing",
    description: "A distraction-free environment designed for deep focus and effortless creation.",
    icon: BookOpen,
    className: "lg:col-span-2 lg:row-span-2",
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    iconColor: "text-blue-500",
    pattern: "bg-grid-blue-500/[0.05]",
    element: (
      <div className="absolute bottom-0 right-0 w-full h-1/2 p-6 overflow-hidden">
        <div className="w-full h-full bg-background/40 backdrop-blur-md rounded-t-2xl border-t border-x border-border/50 p-4 space-y-3 translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
          <div className="h-2 w-1/3 bg-primary/20 rounded-full" />
          <div className="h-2 w-full bg-muted rounded-full" />
          <div className="h-2 w-full bg-muted rounded-full" />
          <div className="h-2 w-2/3 bg-muted rounded-full" />
        </div>
      </div>
    )
  },
  {
    title: "AI Workspace",
    description: "Refine ideas and polish your prose with smart assistance.",
    icon: Bot,
    className: "lg:col-span-1 lg:row-span-1",
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
    iconColor: "text-purple-500",
    pattern: "bg-grid-purple-500/[0.05]",
  },
  {
    title: "Global Edge",
    description: "Available everywhere, instantly.",
    icon: Globe,
    className: "lg:col-span-1 lg:row-span-1",
    gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
    iconColor: "text-orange-500",
    pattern: "bg-grid-orange-500/[0.05]",
  },
  {
    title: "Insights",
    description: "Track your growth with beautiful analytics.",
    icon: PieChart,
    className: "lg:col-span-1 lg:row-span-1",
    gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent",
    iconColor: "text-indigo-500",
    pattern: "bg-grid-indigo-500/[0.05]",
  },
  {
    title: "Community",
    description: "Connect with a global audience and grow your reach through meaningful interactions.",
    icon: MessageCircle,
    className: "lg:col-span-2 lg:row-span-1",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    iconColor: "text-emerald-500",
    pattern: "bg-grid-emerald-500/[0.05]",
    element: (
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex -space-x-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    )
  },
];

const Highlights = () => {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden bg-background">
      <div className="absolute top-0 right-0 -mr-64 -mt-64 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-64 -mb-64 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-20">
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
              <div className={cn("absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700", item.gradient)} />
              <div className={cn("absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700", item.pattern)} />
              
              <div className="relative p-8 lg:p-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-background/50 shadow-xl ring-1 ring-white/10", item.iconColor)}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-3 relative z-10">
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-base font-light max-w-[240px]">
                    {item.description}
                  </p>
                </div>
                
                {item.element && item.element}
                
                {item.className?.includes("col-span-2") && !item.element && (
                  <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none overflow-hidden opacity-10 group-hover:opacity-20 transition-opacity">
                    <item.icon className="absolute top-1/2 left-1/2 -translate-y-1/2 w-64 h-64 blur-2xl text-primary" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
