"use client";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Bot,
  Globe,
  Heart,
  LucideIcon,
  MessageCircle,
  PenTool,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FeatureCard, FeatureList } from "./FeatureCard";

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

type GlowColor = "primary" | "blue" | "purple" | "green" | "yellow";

const Features: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const [isClient, setIsClient] = useState(false);

  const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const features: Feature[] = [
    {
      id: "content-creation",
      icon: BookOpen,
      title: "Rich Content Creation",
      description: "Create and share engaging blog posts with our powerful editor featuring markdown support, real-time preview, and collaborative writing tools.",
      background: (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-blue-500/10 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 opacity-20">
            <PenTool className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      ),
      stats: "10K+ Posts Created",
      cta: "Start Writing",
      delay: 0.1,
      href: "/dashboard/posts/create",
      glowColor: "blue",
      accentIcon: Star,
    },
    {
      id: "ai-chat",
      icon: Bot,
      title: "AI-Powered Chat",
      description: "Engage with our intelligent AI assistant. Get help with writing, research, brainstorming, and creative problem-solving in real-time.",
      background: (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-purple-500/10 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 opacity-20">
            <MessageCircle className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      ),
      stats: "1M+ Conversations",
      cta: "Try AI Chat",
      delay: 0.2,
      href: "/chat",
      glowColor: "purple",
      accentIcon: TrendingUp,
    },
    {
      id: "community",
      icon: Users,
      title: "Thriving Community",
      description: "Join a vibrant community of writers, developers, and creators. Share knowledge, collaborate on projects, and build meaningful connections.",
      background: (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-green-500/10 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 opacity-20">
            <Heart className="w-12 h-12 text-green-500" />
          </div>
        </div>
      ),
      stats: "50K+ Active Users",
      cta: "Join Community",
      delay: 0.3,
      href: "/forum",
      glowColor: "green",
      accentIcon: Globe,
    },
    {
      id: "performance",
      icon: Zap,
      title: "Lightning Fast",
      description: "Built with Next.js and optimized for performance. Experience blazing fast load times and seamless interactions across all devices.",
      background: (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-yellow-500/10 via-transparent to-transparent" />
          <div className="absolute bottom-4 right-4 opacity-20">
            <Award className="w-12 h-12 text-yellow-500" />
          </div>
        </div>
      ),
      stats: "< 100ms Load Time",
      cta: "Experience Speed",
      delay: 0.4,
      glowColor: "yellow",
      accentIcon: Zap,
    }
  ];

  const handleFeatureClick = useCallback((feature: Feature) => {
    if (feature.href) {
      router.push(feature.href);
    }
  }, [router]);

  return (
    <motion.section
      ref={containerRef}
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-linear-to-b from-background to-background/95 dark:from-black dark:to-black/95"
      aria-labelledby="features-heading"
      style={{ opacity }}
    >
      {/* Enhanced Background with Parallax Effects */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: parallaxY }}
      >
        {/* Base pattern */}
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,rgba(240,240,240,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(240,240,240,0.3)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(26,26,26,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.3)_1px,transparent_1px)] bg-size-[4rem_4rem]">
          {/* Gradient orbs - Client-side only to prevent hydration issues */}
          {isClient && (
            <>
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-linear-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-linear-to-br from-green-500/20 to-transparent rounded-full blur-2xl animate-pulse delay-2000" />
            </>
          )}
        </div>
      </motion.div>

      {/* Floating particles for ambiance - Client-side only to prevent hydration mismatch */}
      {isClient && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${(i * 5 + 15) % 100}%`,
                top: `${(i * 7 + 20) % 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: (i % 4),
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header Section */}
        <motion.header
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
              }
            }
          }}
          className="text-center mb-16 sm:mb-20 lg:mb-24"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.8 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }
              }
            }}
            className="inline-flex items-center gap-3 mb-6 sm:mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            </motion.div>
            <Badge
              variant="outline"
              className="text-sm sm:text-base px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 text-primary font-medium"
            >
              Why Choose PILPUT
            </Badge>
          </motion.div>
          
          <motion.h2
            id="features-heading"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.8,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 80
                }
              }
            }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight"
          >
            Powerful Features for{" "}
            <motion.span
              className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent relative inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Modern Creators
            </motion.span>
          </motion.h2>
          
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  delay: 0.4
                }
              }
            }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light"
          >
            Everything you need to create, share, and connect. Built with cutting-edge technology
            and designed for the ultimate creative experience.
          </motion.p>
        </motion.header>

        {/* Enhanced Features Timeline */}
        <div className="max-w-5xl mx-auto relative">
          {/* Enhanced Timeline Line with gradient */}
          <motion.div
            className="absolute left-8 top-0 bottom-0 w-1 bg-linear-to-b from-primary via-primary/60 to-primary/20 hidden sm:block rounded-full"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ transformOrigin: "top" }}
          />

          <FeatureList role="list" aria-label="Platform features">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                role="listitem"
                className="relative flex gap-4 sm:gap-6"
              >
                {/* Timeline Node */}
                <div className="flex-shrink-0 relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.4, delay: feature.delay + 0.2, type: "spring" }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary border-2 border-primary flex items-center justify-center"
                  >
                    <feature.icon
                      className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground"
                      aria-hidden="true"
                    />
                  </motion.div>
                  
                </div>

                {/* Content Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: feature.delay + 0.3 }}
                  className="flex-1 pb-8"
                >
                  <FeatureCard
                    onClick={() => handleFeatureClick(feature)}
                    aria-label={`${feature.title}: ${feature.description}`}
                    aria-describedby={`feature-stats-${feature.id}`}
                    className="h-auto min-h-[200px] sm:min-h-[220px]"
                    glowColor={feature.glowColor}
                  >
                    {feature.background}
                    <div className="z-10 p-4 sm:p-6 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {feature.accentIcon && <feature.accentIcon className="h-4 w-4" />}
                          {feature.stats}
                        </div>
                        <Badge
                          id={`feature-stats-${feature.id}`}
                          variant="secondary"
                          className="text-xs font-semibold"
                        >
                          {feature.cta}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-neutral-700 dark:text-neutral-300 leading-tight">
                          {feature.title}
                        </h3>
                        <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="px-0 text-primary hover:text-primary"
                          onClick={() => handleFeatureClick(feature)}
                          aria-label={`Go to ${feature.title}`}
                        >
                          {feature.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          Tailored for fast onboarding and daily use.
                        </span>
                      </div>
                    </div>
                  </FeatureCard>
                </motion.div>
              </motion.div>
            ))}
          </FeatureList>
        </div>
      </div>
    </motion.section>
  );
};

export default Features;
