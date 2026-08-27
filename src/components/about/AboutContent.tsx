"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Zap, Shield, PenSquare, Sparkles, Users, Globe, Code } from "lucide-react";

const AboutContent = () => {
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="pt-8 pb-20 md:pt-12 md:pb-28 bg-background relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100/[0.02] dark:bg-grid-slate-700/[0.02] bg-size-[50px_50px]" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Badge
                variant="secondary"
                className="mb-4 cursor-pointer mx-auto hover:bg-secondary/80 transition-colors px-4 py-1 text-sm border-primary/20"
                onClick={() => setIsHovered(!isHovered)}
                role="button"
                tabIndex={0}
                aria-label="Toggle rocket emoji"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsHovered(!isHovered);
                  }
                }}
              >
                Independent &amp; Open Source
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  className="ml-2 inline-block"
                >
                  🚀
                </motion.span>
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6 bg-linear-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent"
            >
              About <span className="font-extrabold text-primary">pilput</span>
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="text-xl md:text-2xl lg:text-3xl font-semibold text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              A free, open publishing platform for writers and creators worldwide
            </motion.h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 hover:bg-card/60 transition-all duration-300 group">
              <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-6">
                A clean, fast, and secure publishing platform built for modern creators.
                Share your stories, connect with readers, and grow your audience.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
                <span className="group-hover:text-foreground transition-colors">Built with passion for writers worldwide</span>
                <Sparkles className="h-4 w-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16"
          >
            <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:bg-card/50 transition-all duration-300 group hover:-translate-y-1 hover:border-yellow-500/20">
              <div className="bg-yellow-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500/20 transition-all duration-300 group-hover:scale-110">
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-yellow-500 transition-colors">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Optimized for speed and performance</p>
            </div>

            <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:bg-card/50 transition-all duration-300 group hover:-translate-y-1 hover:border-blue-500/20">
              <div className="bg-blue-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-110">
                <PenSquare className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-500 transition-colors">Simple Editor</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Intuitive writing experience</p>
            </div>

            <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:bg-card/50 transition-all duration-300 group hover:-translate-y-1 hover:border-green-500/20">
              <div className="bg-green-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-all duration-300 group-hover:scale-110">
                <Shield className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-green-500 transition-colors">Secure &amp; Reliable</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Your content is safe with us</p>
            </div>

            <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:bg-card/50 transition-all duration-300 group hover:-translate-y-1 hover:border-purple-500/20">
              <div className="bg-purple-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/20 transition-all duration-300 group-hover:scale-110">
                <Code className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-500 transition-colors">Open Source</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Transparent and community-driven</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="bg-linear-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8 py-6 rounded-full transition-all duration-300 text-lg font-semibold"
                aria-label="Explore stories"
              >
                <Link href="/explore" className="flex items-center">
                  <Globe className="h-5 w-5 mr-3" />
                  Explore Stories
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                asChild
                size="lg"
                className="border-2 border-border hover:border-primary/50 hover:bg-primary/5 px-8 py-6 rounded-full transition-all duration-300 text-lg font-semibold"
                aria-label="Register for a new account"
              >
                <Link href="/register" className="flex items-center">
                  <Users className="h-5 w-5 mr-3" />
                  Get Started
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutContent;
