"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown, ShieldCheck, Zap, Globe2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import HeroBackground from "./HeroBackground";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "36%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
        duration: prefersReducedMotion ? 0.3 : 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 26 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0.25 }
        : { type: "spring" as const, stiffness: 120, damping: 16 },
    },
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-14 sm:py-16 lg:py-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-grid-slate-100/[0.06] dark:bg-grid-slate-800/[0.1] bg-[length:28px_28px]" />
      <HeroBackground />
      <motion.div className="absolute inset-0" style={{ y, opacity, background: "transparent" }} />

      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={itemVariants}
      >
        <div className="text-center space-y-6 sm:space-y-8 lg:space-y-10">
          <AnimatePresence>
            {!isLoaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-16"
              >
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-all duration-200 rounded-full shadow-sm"
              role="status"
              aria-label="Platform feature highlight"
            >
              <Sparkles className="h-4 w-4 mr-2" aria-hidden="true" />
              Free publishing platform with no limits
            </Badge>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2 relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="block">Write, publish, and</span>
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent relative">
                ship ideas without friction
                <motion.span
                  className="absolute -inset-2 rounded-3xl blur-2xl bg-primary/12"
                  animate={prefersReducedMotion ? {} : { opacity: [0.45, 0.8, 0.45] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                />
              </span>
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            PILPUT is a free publishing platform where anyone can write and share without restrictions.
            No paywalls, no subscriptions, no hidden limits—just a clean place to focus on your words.
          </motion.p>

          <motion.nav
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
            role="navigation"
            aria-label="Primary actions"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                className="group relative overflow-hidden px-8 py-4 text-lg font-semibold bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-200 rounded-2xl border border-primary/60 w-full sm:w-auto min-w-[200px]"
                size="lg"
                aria-label="Start writing your first article"
              >
                <span className="relative z-10">Start writing now</span>
                <ArrowRight className="ml-2 h-5 w-5 translate-x-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/blog" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="relative overflow-hidden px-8 py-4 text-lg font-semibold border border-border/70 bg-background/70 backdrop-blur-md hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 rounded-2xl w-full sm:w-auto min-w-[200px]"
                aria-label="Browse published articles"
              >
                <span className="relative z-10">Browse articles</span>
              </Button>
            </Link>
          </motion.nav>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 pt-6"
          >
            {[
              { icon: ShieldCheck, title: "Free forever", desc: "No paywalls or hidden limits" },
              { icon: Zap, title: "Fast by default", desc: "Edge-ready, optimized Next.js" },
              { icon: Globe2, title: "Built to scale", desc: "SEO, social, and global ready" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl px-4 py-3 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={
          prefersReducedMotion
            ? {}
            : {
              y: [0, 8, 0],
            }
        }
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <ChevronDown className="w-4 h-4 text-muted-foreground/50 mt-2" />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
