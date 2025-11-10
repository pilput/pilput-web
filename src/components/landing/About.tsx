"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Zap, Shield, PenSquare, Sparkles, Users, Globe, Code, Rocket } from "lucide-react";

const AboutContent = () => {
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100/[0.02] dark:bg-grid-slate-700/[0.02] bg-size-[50px_50px]" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
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
                className="mb-4 cursor-pointer mx-auto hover:bg-secondary/80 transition-colors"
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
                Independent & Open Source
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
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6 bg-linear-to-r from-foreground to-primary/80 bg-clip-text text-transparent"
            >
              About <span className="font-extrabold">pilput</span>
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="text-xl md:text-2xl lg:text-3xl font-semibold text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed"
            >
              A free, open publishing platform for writers and creators worldwide
            </motion.h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-8 hover:bg-card/40 transition-all duration-300 group">
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                A clean, fast, and secure publishing platform built for modern creators.
                Share your stories, connect with readers, and grow your audience.
              </motion.p>
              <motion.div 
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground/60"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                <span>Trusted by thousands of writers worldwide</span>
                <Sparkles className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16"
          >
            <motion.div
              className="bg-card/20 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:bg-card/30 transition-all duration-300 group group-hover:scale-105"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-all duration-300 group-hover:scale-110"
                whileHover={{ rotate: 180 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Zap className="h-8 w-8 text-primary" />
              </motion.div>
              <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Optimized for speed and performance</p>
            </motion.div>

            <motion.div
              className="bg-card/20 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:bg-card/30 transition-all duration-300 group group-hover:scale-105"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="bg-secondary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/30 transition-all duration-300 group-hover:scale-110"
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <PenSquare className="h-8 w-8 text-secondary" />
              </motion.div>
              <h3 className="font-semibold text-lg mb-2">Simple Editor</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Intuitive writing experience</p>
            </motion.div>

            <motion.div
              className="bg-card/20 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:bg-card/30 transition-all duration-300 group group-hover:scale-105"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="bg-green-20 dark:bg-green-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-30 dark:group-hover:bg-green-700 transition-all duration-300 group-hover:scale-110"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </motion.div>
              <h3 className="font-semibold text-lg mb-2">Secure & Reliable</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Your content is safe with us</p>
            </motion.div>

            <motion.div
              className="bg-card/20 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:bg-card/30 transition-all duration-300 group group-hover:scale-105"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="bg-purple-20 dark:bg-purple-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-30 dark:group-hover:bg-purple-700 transition-all duration-300 group-hover:scale-110"
                whileHover={{ rotate: 360 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Code className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </motion.div>
              <h3 className="font-semibold text-lg mb-2">Open Source</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Transparent and community-driven</p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                aria-label="Explore the blog section"
              >
                <Link href="/blog" className="flex items-center">
                  <Globe className="h-5 w-5 mr-3" />
                  <span className="font-semibold">Explore the Blog</span>
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                asChild
                size="lg"
                className="border border-border hover:border-primary/50 hover:bg-primary/5 px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                aria-label="Register for a new account"
              >
                <Link href="/register" className="flex items-center">
                  <Users className="h-5 w-5 mr-3" />
                  <span className="font-semibold">Get Started</span>
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
