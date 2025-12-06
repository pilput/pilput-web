"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";
import Link from "next/link";

const CallToAction = () => {
  const stats = [
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Posts Created", value: "50K+", icon: Sparkles },
    { label: "Communities", value: "100+", icon: Zap },
  ];

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
      },
    },
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-grid-slate-100/[0.06] dark:bg-grid-slate-800/[0.1] bg-[length:28px_28px]" />
      <div className="absolute inset-x-6 inset-y-10 rounded-3xl border border-border/60 bg-card/80 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center space-y-4"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="text-sm px-4 py-1">
              Join the community
            </Badge>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto"
          >
            Ready to start your
            <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              creative journey?
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Join thousands of creators, developers, and writers who are already building
            meaningful content and connections on PILPUT.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link href="/register">
              <Button
                size="lg"
                className="group px-8 py-6 text-lg font-semibold rounded-2xl border border-primary/60 bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-200"
              >
                Get started free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/blog">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-2xl border border-border/70 bg-background/80 hover:bg-primary/5 hover:border-primary/50 transition-all duration-200"
              >
                Explore content
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto pt-10"
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/15 transition-colors duration-200">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div variants={itemVariants} className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              No credit card required • Free forever • Join in 30 seconds
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
