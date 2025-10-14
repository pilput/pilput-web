"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Users,
  MessageSquare,
  BookOpen,
  Zap,
  ChevronDown,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; delay: number }>
  >([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

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

  // Generate particles - reduced number for better performance
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      // Reduced from 50 to 20 particles for better performance
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          delay: Math.random() * 5,
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  // Mouse tracking with throttling for better performance
  useEffect(() => {
    let throttleTimer: NodeJS.Timeout | null = null;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse movement updates to reduce CPU usage
      if (throttleTimer) return;
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
        mouseX.set((x - 0.5) * 100);
        mouseY.set((y - 0.5) * 100);
      }
      
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
      }, 16); // ~60fps
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        if (throttleTimer) clearTimeout(throttleTimer);
      };
    }
  }, [mouseX, mouseY]);

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

  const floatingIcons = [
    { icon: Users, delay: 0, x: "10%", y: "20%" },
    { icon: MessageSquare, delay: 1, x: "85%", y: "15%" },
    { icon: BookOpen, delay: 2, x: "15%", y: "70%" },
    { icon: Zap, delay: 1.5, x: "80%", y: "75%" },
  ];

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Modern gradient background with mesh effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

      {/* Animated mesh gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)
          `,
          y,
          opacity,
        }}
      />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Interactive mouse-following gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(600px circle at ${
            mousePosition.x * 100
          }% ${
            mousePosition.y * 100
          }%, rgba(59, 130, 246, 0.06), transparent 50%)`,
        }}
      />

      {/* Animated geometric grid - simplified for better performance */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            x: springX,
            y: springY,
          }}
        />
      </div>

      {/* Floating particles - Only render if motion is not reduced */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-primary/10"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
              animate={{
                y: [0, -80, 0],
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Floating background shapes - reduced for better performance */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-multiply filter blur-xl"
              animate={{
                x: [0, 30, 0],
                y: [0, 20, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                delay: i * 3,
                ease: "linear",
              }}
              style={{
                width: `${150 + i * 50}px`,
                height: `${150 + i * 50}px`,
                left: `${10 + i * 30}%`,
                top: `${10 + i * 20}%`,
                backgroundColor: `hsl(${220 + i * 20}, 50%, 90%)`,
                opacity: 0.2,
              }}
            />
          ))}
        </div>
      )}

      {/* Floating icons - Only render if motion is not reduced */}
      {!prefersReducedMotion &&
        floatingIcons.map((item, index) => {
          const IconComponent = item.icon;
          const distanceFromMouse = Math.sqrt(
            Math.pow((parseFloat(item.x) / 100 - mousePosition.x) * 100, 2) +
              Math.pow((parseFloat(item.y) / 100 - mousePosition.y) * 100, 2)
          );
          const isNearMouse = distanceFromMouse < 15;

          return (
            <motion.div
              key={index}
              className="absolute hidden lg:block cursor-pointer"
              style={{ left: item.x, top: item.y }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 3, 0],
                scale: isNearMouse ? 1.15 : 1,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.2,
                rotate: 10,
                transition: { duration: 0.2 },
              }}
            >
              <motion.div
                className="p-3 bg-card/40 backdrop-blur-sm rounded-xl border border-border/30 shadow-md hover:shadow-lg transition-all duration-200"
                animate={{
                  boxShadow: isNearMouse
                    ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
                transition={{ duration: 0.3 }}
              >
                <IconComponent className="h-5 w-5 text-primary" />
              </motion.div>
            </motion.div>
          );
        })}

      <motion.div
        className="relative z-20 container px-4 sm:px-6 lg:px-8"
        style={{
          transform: prefersReducedMotion
            ? "none"
            : `translate(${springX.get() * 0.01}px, ${springY.get() * 0.01}px)`,
        }}
      >
        <header className="relative flex flex-col items-center space-y-6 sm:space-y-8 text-center max-w-6xl mx-auto p-6 sm:p-8 lg:p-12">
          {/* Loading state */}
          <AnimatePresence>
            {!isLoaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Badge */}
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 text-xs sm:text-sm font-medium bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 hover:bg-primary/15 transition-all duration-300 rounded-full shadow-sm"
              role="status"
              aria-label="Platform feature highlight"
            >
              <Sparkles
                className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-pulse"
                aria-hidden="true"
              />
              ✍️ Free Publishing Platform - No Limits
            </Badge>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight px-2"
          >
            Write, Publish &
            <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Share Your Ideas
            </span>
            <span className="block text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl mt-1 sm:mt-2 text-muted-foreground font-medium">
              Completely Free
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl sm:max-w-3xl lg:max-w-4xl leading-relaxed font-medium px-2 sm:px-0"
          >
            PILPUT is a free publishing platform where anyone can write and
            share articles without restrictions. No paywalls, no subscription
            fees, no hidden costs - just pure freedom to express your thoughts
            and reach readers worldwide.
          </motion.p>

          {/* CTA Buttons */}
          <motion.nav
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 justify-center items-center w-full sm:w-auto"
            role="navigation"
            aria-label="Primary actions"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-6 lg:px-12 lg:py-7 text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl border-0 w-full"
                aria-label="Start writing your first article"
              >
                Start Writing Now
                <ArrowRight
                  className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Button>
            </Link>
            <Link href="/blog" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-6 lg:px-12 lg:py-7 text-sm sm:text-base md:text-lg font-semibold border-2 border-primary/30 bg-background/80 backdrop-blur-md hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 rounded-xl w-full"
                aria-label="Browse published articles"
              >
                Browse Articles
              </Button>
            </Link>
          </motion.nav>

          {/* Stats preview */}
          <motion.section
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 pt-6 sm:pt-8 text-center w-full"
            aria-label="Platform statistics"
          >
            <div className="group flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-white/5 dark:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-white/5 min-w-[100px] sm:min-w-[120px] md:min-w-[140px] flex-1 sm:flex-none hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                1.8K+
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-2 group-hover:text-foreground transition-colors duration-300">
                Writers
              </div>
            </div>
            <div className="group flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-white/5 dark:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-white/5 min-w-[100px] sm:min-w-[120px] md:min-w-[140px] flex-1 sm:flex-none hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                12.4K+
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-2 group-hover:text-foreground transition-colors duration-300">
                Articles Published
              </div>
            </div>
            <div className="group flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-white/5 dark:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-white/5 min-w-[100px] sm:min-w-[120px] md:min-w-[140px] flex-1 sm:flex-none hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-teal-500 transition-all duration-300">
                67K+
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-2 group-hover:text-foreground transition-colors duration-300">
                Monthly Readers
              </div>
            </div>
          </motion.section>
        </header>
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
        className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2"
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
        <div className="w-4 h-7 sm:w-5 sm:h-8 border-2 border-muted-foreground/20 rounded-full flex justify-center">
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground/40 mt-1" />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
