"use client";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useRef, useCallback } from "react";
import {
  ArrowRight,
  BookOpen,
  Bot,
  LucideIcon,
  MessageCircle,
  PenTool,
  PieChart,
  Star,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "./FeatureCard";

interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  background: React.ReactNode;
  stats: string;
  cta: string;
  delay: number;
  href?: string;
  glowColor?: "primary" | "blue" | "purple" | "green" | "yellow";
  accentIcon?: LucideIcon;
}

const Features: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const features: Feature[] = [
    {
      id: "content-creation",
      icon: BookOpen,
      title: "Immersive Writing",
      description:
        "Craft stories that captivate with our high-performance writing tools. Enjoy a clean space with instant formatting and media integration.",
      background: (
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 right-0 p-8">
            <PenTool className="w-32 h-32 text-blue-500" />
          </div>
        </div>
      ),
      stats: "Clean & Simple",
      cta: "Start writing",
      delay: 0.1,
      href: "/dashboard/posts/create",
      glowColor: "blue",
      accentIcon: Star,
    },
    {
      id: "ai-chat",
      icon: Bot,
      title: "Creative Companion",
      description:
        "Never stare at a blank page again. Our smart assistant helps you brainstorm topics, outline ideas, and refine your tone as you write.",
      background: (
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute bottom-0 left-0 p-8">
            <MessageCircle className="w-32 h-32 text-purple-500" />
          </div>
        </div>
      ),
      stats: "Smart Assistant",
      cta: "Try Assistant",
      delay: 0.2,
      href: "/chat",
      glowColor: "purple",
      accentIcon: TrendingUp,
    },
    {
      id: "holdings",
      icon: PieChart,
      title: "Personal Dashboard",
      description:
        "Stay organized and track your progress. Manage your stories and get clear insights into how your content is performing.",
      background: (
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 p-8">
            <TrendingUp className="w-32 h-32 text-primary" />
          </div>
        </div>
      ),
      stats: "All-in-one",
      cta: "Go to Dashboard",
      delay: 0.3,
      href: "/dashboard/holdings",
      glowColor: "primary",
      accentIcon: PieChart,
    },
  ];

  const handleFeatureClick = useCallback(
    (feature: Feature) => {
      if (feature.href) {
        router.push(feature.href);
      }
    },
    [router]
  );

  return (
    <motion.section
      ref={containerRef}
      className="relative py-16 sm:py-20 lg:py-24 bg-background overflow-hidden"
    >
      {/* Refined Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/2 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-6 mb-12 lg:mb-16">
          <div className="max-w-2xl space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="px-4 py-1.5 bg-primary/10 text-primary border-none rounded-full">
                Platform Innovation
              </Badge>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black tracking-tight leading-tight"
            >
              Precision tools for <br />
              <span className="text-primary">exceptional results.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-md font-light leading-relaxed mb-2"
          >
            We&apos;ve stripped away the noise to give you the most powerful,
            intuitive tools for your creative workflow.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay, duration: 0.6 }}
            >
              <FeatureCard
                onClick={() => handleFeatureClick(feature)}
                className="group h-[360px] lg:h-[400px]"
                glowColor={feature.glowColor}
              >
                {feature.background}
                <div className="relative h-full flex flex-col p-10 lg:p-12">
                  <div className="mb-auto">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className="border-primary/20 text-[10px] uppercase tracking-widest font-bold">
                        {feature.stats}
                      </Badge>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-4 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-base lg:text-lg font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  <div className="mt-8 flex items-center text-primary font-bold group/btn">
                    <span className="mr-2">{feature.cta}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </div>
                </div>
              </FeatureCard>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Features;
