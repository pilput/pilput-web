"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Star, Zap } from "lucide-react";
import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="relative py-24 sm:py-32 lg:py-48 overflow-hidden bg-background">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-grid-slate-100/[0.03] dark:bg-grid-white/[0.02] bg-[length:40px_40px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] animate-pulse" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl mx-auto rounded-[3rem] p-8 sm:p-12 lg:p-24 border border-border/40 bg-card/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Internal Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -ml-48 -mb-48" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="px-6 py-2 border-primary/30 bg-primary/10 text-primary backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">
                <Star className="w-3.5 h-3.5 mr-2 fill-primary" />
                Join the elite community
              </Badge>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-none"
            >
              Start your journey <br />
              <span className="bg-linear-to-r from-primary via-primary/80 to-blue-600 bg-clip-text text-transparent">
                to the top.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl sm:text-2xl text-muted-foreground max-w-3xl font-light leading-relaxed"
            >
              Join a movement of creators, thinkers, and builders who are
              shaping the future of publishing. No limits, just pure potential.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-xl"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:min-w-[260px] h-16 sm:h-20 text-xl font-bold bg-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 rounded-[2rem] border-b-4 border-primary/70 active:border-b-0 active:translate-y-1"
                >
                  Create your account
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/blog" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:min-w-[260px] h-16 sm:h-20 text-xl font-bold bg-background/50 backdrop-blur-xl border-border/50 hover:bg-accent/50 rounded-[2rem] transition-all duration-300"
                >
                  Browse stories
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="pt-8 flex flex-wrap justify-center gap-x-12 gap-y-6 text-sm sm:text-base text-muted-foreground/60 font-medium uppercase tracking-widest"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <span>Instant Setup</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <span>Flexible to Start</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <span>Modern Web Vibe</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
