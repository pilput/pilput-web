"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Zap,
  Globe2,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import HeroBackground from "./HeroBackground";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        duration: prefersReducedMotion ? 0.3 : 0.8,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0.3 }
        : { type: "spring" as const, stiffness: 100, damping: 20 },
    },
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden py-20 lg:py-32"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Layering */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_70%)]" />
      <div className="absolute inset-0 bg-grid-slate-100/[0.03] dark:bg-grid-white/[0.02] bg-size-[32px_32px]" />

      <HeroBackground />

      <motion.div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{ y, opacity, scale }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-8 lg:space-y-12">
          <motion.div variants={itemVariants} className="relative">
            <Badge
              variant="outline"
              className="px-4 py-1.5 text-xs sm:text-sm font-medium bg-primary/5 text-primary border-primary/20 backdrop-blur-md rounded-full shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 mr-2 animate-pulse" />
              Empowering the next generation of writers
            </Badge>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="max-w-5xl space-y-4 sm:space-y-6"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] text-foreground">
              Write, publish, and <br className="hidden sm:block" />
              <span className="relative inline-block">
                <span className="relative z-10 bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  ship ideas
                </span>
                <motion.span
                  className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 rounded-full blur-sm"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                />
              </span>{" "}
              without friction.
            </h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light"
            >
              PILPUT is a modern publishing platform designed for clarity. No
              paywalls, no clutter—just a pure focus on your creative voice.
            </motion.p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group relative h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-bold bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 rounded-2xl border-b-4 border-primary/70 active:border-b-0 active:translate-y-1 w-full sm:min-w-55"
              >
                Start your journey
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link href="/blog" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-semibold bg-background/50 backdrop-blur-xl border-border/50 hover:bg-accent hover:border-accent transition-all duration-300 rounded-2xl w-full sm:min-w-55"
              >
                Explore articles
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8 w-full max-w-4xl pt-8 lg:pt-16"
          >
            {[
              {
                icon: ShieldCheck,
                title: "Get Started Free",
                desc: "Start writing at no cost.",
              },
              {
                icon: Zap,
                title: "Instant Load",
                desc: "Smooth and rapid experience.",
              },
              {
                icon: Globe2,
                title: "Global Reach",
                desc: "Get your voice heard everywhere.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative p-6 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm hover:bg-card/50 hover:border-primary/20 transition-all duration-500 text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-primary/10 transition-colors" />
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-500">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </motion.section>
  );
};

export default Hero;
