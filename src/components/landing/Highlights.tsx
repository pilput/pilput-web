"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Gauge,
  ShieldCheck,
  Sparkles,
  Globe2,
  Users,
} from "lucide-react";

const highlights = [
  {
    title: "Zero Paywalls",
    description: "Publish freely forever with no hidden tiers or limits.",
    icon: ShieldCheck,
    accent: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    title: "Built for Speed",
    description: "Next.js + edge caching keep every page feeling instant.",
    icon: Gauge,
    accent: "from-blue-500/20 to-blue-500/5",
  },
  {
    title: "Global by Default",
    description: "SEO, sitemaps, and social previews are handled for you.",
    icon: Globe2,
    accent: "from-indigo-500/20 to-indigo-500/5",
  },
  {
    title: "Human Community",
    description: "Creators, readers, and collaborators ready to connect.",
    icon: Users,
    accent: "from-amber-500/20 to-amber-500/5",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Highlights = () => {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-grid-slate-100/[0.04] dark:bg-grid-slate-700/[0.06] bg-size-[36px_36px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <Badge className="bg-primary/10 text-primary border border-primary/20 px-4 py-1">
            Built for Momentum
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            A Landing Designed to Convert
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Clear value props, fast feedback, and confident visuals that keep
            visitors moving toward your calls-to-action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-xl shadow-lg hover:shadow-xl transition-transform duration-300 hover:-translate-y-1">
                <div
                  className={cn(
                    "absolute inset-0 opacity-80 bg-gradient-to-br",
                    item.accent,
                  )}
                />
                <CardContent className="relative z-10 p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-background/80 shadow-inner shadow-primary/10">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Sparkles className="h-5 w-5 text-primary/80" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;

