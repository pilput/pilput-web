"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, PenLine, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const CallToAction = () => {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[760px] h-[760px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-slate-100/[0.03] dark:bg-grid-white/[0.02] bg-size-[40px_40px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/50 backdrop-blur-md px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 text-center space-y-8"
          >
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] bg-grid-slate-100/[0.4] dark:bg-grid-white/[0.2] bg-size-[24px_24px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-8">
              <Badge
                variant="outline"
                className="px-5 py-2 text-xs font-bold uppercase tracking-widest border-primary/30 bg-primary/10 text-primary rounded-full"
              >
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Start Your Journey
              </Badge>

              <div className="space-y-4">
                <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
                  Your words deserve a home.
                </p>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-foreground">
                  Ready to share your story?
                </h2>
              </div>

              <div className="flex w-full flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="group w-full sm:min-w-[220px] h-14 text-base font-semibold rounded-xl"
                  >
                    <PenLine className="mr-2 h-5 w-5" />
                    Start writing
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <Link href="/blog" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:min-w-[220px] h-14 text-base font-medium rounded-xl border-primary/20 bg-background/70 hover:bg-accent/50"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Explore articles
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
