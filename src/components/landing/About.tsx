"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Zap, Shield, PenSquare, Sparkles, Users, Globe } from "lucide-react";

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
    <section className="py-16 md:py-24 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <Badge
              variant="secondary"
              className="mb-4 cursor-pointer mx-auto"
              onClick={() => setIsHovered(!isHovered)}
            >
              Independent & Open Source
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-2"
                >
                  🚀
                </motion.span>
              )}
            </Badge>

            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-secondary mb-6"
            >
              About <span className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">pilput</span>
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
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-lg">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                A clean, fast, and secure publishing platform built for modern creators. 
                Share your stories, connect with readers, and grow your audience.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/70">
                <Sparkles className="h-4 w-4" />
                <span>Trusted by thousands of writers worldwide</span>
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
          >
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:bg-card/50 transition-all duration-300 group">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">Optimized for speed and performance</p>
            </div>
            
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:bg-card/50 transition-all duration-300 group">
              <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                <PenSquare className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Simple Editor</h3>
              <p className="text-sm text-muted-foreground">Intuitive writing experience</p>
            </div>
            
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:bg-card/50 transition-all duration-300 group">
              <div className="bg-green-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                <Shield className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-sm text-muted-foreground">Your content is safe with us</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button
              asChild
              size="lg"
              className="relative group overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/blog">
                <Globe className="h-5 w-5 mr-2" />
                <span className="relative z-10 font-semibold">Explore the Blog</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              asChild 
              size="lg" 
              className="group border-2 border-primary/20 hover:border-primary/40 px-8 py-3 rounded-full hover:bg-primary/5 transition-all duration-300"
            >
              <Link href="/register">
                <Users className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Get Started</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutContent;
