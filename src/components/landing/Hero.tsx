"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Users,
  MessageSquare,
  BookOpen,
  Zap,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);
  
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

  // Generate particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
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

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
        mouseX.set((x - 0.5) * 100);
        mouseY.set((y - 0.5) * 100);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/30"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
        style={{ y, opacity }}
      />

      {/* Interactive mouse-following gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(var(--primary), 0.1), transparent 40%)`,
        }}
      />

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(var(--primary), 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(var(--primary), 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            x: springX,
            y: springY,
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              delay: i * 3,
              ease: "linear",
            }}
            style={{
              width: `${200 + i * 80}px`,
              height: `${200 + i * 80}px`,
              left: `${10 + i * 25}%`,
              top: `${15 + i * 20}%`,
              backgroundColor: `hsl(${220 + i * 30}, 60%, 95%)`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* Animated geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`geo-${i}`}
            className="absolute border border-primary/10"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              borderRadius: i % 2 === 0 ? '50%' : '0%',
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating icons */}
      {floatingIcons.map((item, index) => {
        const IconComponent = item.icon;
        const distanceFromMouse = Math.sqrt(
          Math.pow((parseFloat(item.x) / 100 - mousePosition.x) * 100, 2) +
          Math.pow((parseFloat(item.y) / 100 - mousePosition.y) * 100, 2)
        );
        const isNearMouse = distanceFromMouse < 20;
        
        return (
          <motion.div
            key={index}
            className="absolute hidden lg:block cursor-pointer"
            style={{ left: item.x, top: item.y }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
              scale: isNearMouse ? 1.2 : 1,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.3,
              rotate: 15,
              transition: { duration: 0.2 },
            }}
          >
            <motion.div 
              className="p-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
              animate={{
                boxShadow: isNearMouse 
                  ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <IconComponent className="h-6 w-6 text-primary" />
            </motion.div>
          </motion.div>
        );
      })}

      <motion.div 
        className="relative z-20 container px-4 md:px-6"
        style={{
          transform: `translate(${springX.get() * 0.02}px, ${springY.get() * 0.02}px)`,
        }}
      >
        <div className="flex flex-col items-center space-y-8 text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Welcome to the Future of Content Creation
            </Badge>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
          >
            Create, Share &
            <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Connect
            </span>
            <span className="block text-3xl md:text-5xl lg:text-6xl mt-2 text-muted-foreground">
              Like Never Before
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed"
          >
            Join thousands of creators on PILPUT - the modern platform where
            ideas come to life, communities thrive, and connections spark
            innovation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link href="/register">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(var(--primary), 0.4)",
                    "0 0 0 10px rgba(var(--primary), 0)",
                    "0 0 0 0 rgba(var(--primary), 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Button
                  size="lg"
                  className="group px-8 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Creating Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/blog">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold border-2 bg-background/50 backdrop-blur-sm hover:bg-muted/50 transition-all duration-300"
              >
                Explore Content
              </Button>
            </Link>
          </motion.div>

          {/* Stats preview */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-8 pt-8 text-center"
          >
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                12K+
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Active Creators
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                48K+
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Posts Published
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                250K+
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Connections Made
              </div>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div variants={itemVariants} className="pt-4">
            <p className="text-sm text-muted-foreground">
              ✨ Free to start • 🚀 No setup required • 🔒 Your data is secure
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
