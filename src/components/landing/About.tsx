"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

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
      <div className="container px-4 md:px-6">
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
              Available for Freelance Work
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-2"
                >
                  👋
                </motion.span>
              )}
            </Badge>
            
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 mb-4"
            >
              About <span className="font-extrabold">CECEP JANUARDI</span>
            </motion.h1>
            
            <motion.h2
              variants={itemVariants}
              className="text-xl md:text-2xl font-semibold text-muted-foreground"
            >
              Full Stack Developer & Creator
            </motion.h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="prose prose-lg max-w-none text-foreground mb-12"
          >
            <p className="mb-4">
              Hello! I&apos;m Cecep Januardi, a passionate full-stack developer with a deep love for creating digital experiences that are both beautiful and functional. With years of experience in the ever-evolving tech landscape, I&apos;ve honed my skills in crafting modern web applications that stand out.
            </p>
            
            <p className="mb-4">
              My journey in tech began with curiosity and a desire to build things that matter. Over time, this curiosity has transformed into expertise in key technologies like Next.js, React, and Node.js. I believe in writing clean, efficient code and creating intuitive user interfaces that provide seamless experiences.
            </p>
            
            <p className="mb-4">
              When I&apos;m not coding, you&apos;ll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community. I&apos;m constantly learning and adapting to stay at the forefront of web development trends.
            </p>
            
            <p>
              I&apos;m currently focused on building PILPUT, a free publishing platform that empowers writers to share their ideas without restrictions. This project combines my technical skills with my belief in accessible knowledge sharing.
            </p>
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
                <span className="relative z-10">Read My Blog</span>
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="group">
              <Link href="/projects">
                <span>View Projects</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutContent;
