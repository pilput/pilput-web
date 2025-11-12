"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  PenTool,
  BookOpen,
  Users,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Loading state
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
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0.3 }
        : {
            type: "spring" as const,
            stiffness: 100,
            damping: 15,
          },
    },
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 sm:py-16 lg:py-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced gradient background with mesh effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.06),transparent_50%)]" />
      </div>

      {/* Subtle animated overlay */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)
          `,
          y,
          opacity,
        }}
      />

      {/* Floating geometric shapes and icons */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl"
        animate={prefersReducedMotion ? {} : { y: [0, -20, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg blur-lg"
        animate={prefersReducedMotion ? {} : { y: [0, 15, 0], x: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-32 left-1/4 w-12 h-12 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-md"
        animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Subtle background icons */}
      <motion.div
        className="absolute top-1/4 right-1/4 opacity-10"
        animate={prefersReducedMotion ? {} : { rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <PenTool className="w-24 h-24 text-primary" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 right-10 opacity-8"
        animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <BookOpen className="w-16 h-16 text-purple-500" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 left-1/5 opacity-6"
        animate={prefersReducedMotion ? {} : { scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <Users className="w-20 h-20 text-green-500" />
      </motion.div>

      {/* Content container with proper constraints */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={itemVariants}
      >
        <div className="text-center space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Loading state */}
          <AnimatePresence>
            {!isLoaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-20"
              >
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Badge */}
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 hover:bg-primary/15 transition-all duration-300 rounded-full shadow-sm"
              role="status"
              aria-label="Platform feature highlight"
            >
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" aria-hidden="true" />
              ✍️ Free Publishing Platform - No Limits
            </Badge>
          </motion.div>

          {/* Enhanced main heading with glow effects */}
          <motion.div variants={itemVariants} className="space-y-2 relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight relative">
              <span className="block relative">
                Write, Publish &
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur-xl opacity-50"
                  animate={prefersReducedMotion ? {} : { scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent relative">
                Share Your Ideas
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 rounded-lg blur-lg opacity-60"
                  animate={prefersReducedMotion ? {} : { opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
              </span>
            </h1>
          </motion.div>

          {/* Subtitle - better constrained */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            PILPUT is a free publishing platform where anyone can write and share articles without restrictions.
            No paywalls, no subscription fees, no hidden costs - just pure freedom to express your thoughts.
          </motion.p>

          {/* Enhanced CTA Buttons with modern effects */}
          <motion.nav
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            role="navigation"
            aria-label="Primary actions"
          >
            <Link href="/register" className="w-full sm:w-auto group">
              <Button
                size="lg"
                className="relative overflow-hidden px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 rounded-xl border-0 w-full sm:w-auto min-w-[200px] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
                aria-label="Start writing your first article"
              >
                <span className="relative z-10">Start Writing Now</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/blog" className="w-full sm:w-auto group">
              <Button
                variant="outline"
                size="lg"
                className="relative overflow-hidden px-8 py-4 text-lg font-semibold border-2 border-primary/30 bg-background/80 backdrop-blur-md hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 rounded-xl w-full sm:w-auto min-w-[200px] before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:to-purple-500/10 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
                aria-label="Browse published articles"
              >
                <span className="relative z-10">Browse Articles</span>
              </Button>
            </Link>
          </motion.nav>
        </div>
      </motion.div>

      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, 8, 0],
              }
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
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
