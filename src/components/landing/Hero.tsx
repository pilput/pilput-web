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
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

      {/* Subtle animated overlay */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)
          `,
          y,
          opacity,
        }}
      />

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

          {/* Main heading - cleaner and more contained */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="block">Write, Publish &</span>
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Share Your Ideas
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-medium">
              Completely Free
            </p>
          </motion.div>

          {/* Subtitle - better constrained */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            PILPUT is a free publishing platform where anyone can write and share articles without restrictions.
            No paywalls, no subscription fees, no hidden costs - just pure freedom to express your thoughts.
          </motion.p>

          {/* CTA Buttons - cleaner layout */}
          <motion.nav
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            role="navigation"
            aria-label="Primary actions"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl border-0 w-full sm:w-auto min-w-[200px]"
                aria-label="Start writing your first article"
              >
                Start Writing Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/blog" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-2 border-primary/30 bg-background/80 backdrop-blur-md hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 rounded-xl w-full sm:w-auto min-w-[200px]"
                aria-label="Browse published articles"
              >
                Browse Articles
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
