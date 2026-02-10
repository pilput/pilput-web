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
} from "lucide-react";

const highlights = [
  {
    title: "Rich Writing Experience",
    description:
      "Create long-form posts with an editor built for focus, clarity, and consistent publishing flow.",
    icon: BookOpen,
    className: "md:col-span-2",
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    iconColor: "text-blue-500",
  },
  {
    title: "AI Chat Assistant",
    description:
      "Get help for brainstorming, drafting, and refining content from a built-in AI conversation workspace.",
    icon: Bot,
    className: "md:col-span-1",
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
    iconColor: "text-purple-500",
  },
  {
    title: "Portfolio Tracking",
    description:
      "Monitor holdings and view portfolio performance in one dashboard for clearer financial visibility.",
    icon: PieChart,
    className: "md:col-span-1",
    gradient: "from-indigo-500/10 via-indigo-500/5 to-transparent",
    iconColor: "text-indigo-500",
  },
  {
    title: "Community Interaction",
    description:
      "Engage through comments and discussions so ideas can grow with feedback from other readers.",
    icon: MessageCircle,
    className: "md:col-span-2",
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    iconColor: "text-emerald-500",
  },
];

const Highlights = () => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center"
          >
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/20 bg-primary/5 text-primary backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Core Capabilities
            </Badge>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
          >
            Built for creators who write, <br className="hidden sm:block" />
            <span className="text-muted-foreground">analyze, and collaborate.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            PILPUT combines writing tools, AI assistance, and portfolio insights
            into one focused platform.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base text-muted-foreground/90 max-w-3xl mx-auto"
          >
            Designed for everyday creators who need speed, clarity, and reliable
            workflows from idea to publication.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500",
                item.className
              )}
            >
              <div className={cn("absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", item.gradient)} />
              
              <div className="relative p-8 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-background/80 shadow-xs ring-1 ring-border/50", item.iconColor)}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
                
                {/* Decorative visual elements for larger cards */}
                {item.className?.includes("col-span-2") && (
                  <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
                    <item.icon className="w-64 h-64" />
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
