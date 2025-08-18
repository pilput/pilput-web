"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Zap, Shield, Users, PenSquare } from "lucide-react";

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
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
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
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 mb-4"
            >
              About <span className="font-extrabold">pilput</span>
            </motion.h1>
            
            <motion.h2
              variants={itemVariants}
              className="text-xl md:text-2xl font-semibold text-muted-foreground"
            >
              A free, open publishing platform for writers and creators
            </motion.h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="max-w-3xl mx-auto text-center mb-8 text-muted-foreground"
          >
            <p className="text-base">
              A clean, fast, privacy‑first publishing platform. Built for creators.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-3xl mx-auto mb-12 text-center"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <PenSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Simple Editor</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Privacy‑first</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="relative group overflow-hidden"
            >
              <Link href="/blog">
                <span className="relative z-10">Explore the Blog</span>
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="group">
              <Link href="/register">
                <span>Get Started</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutContent;
