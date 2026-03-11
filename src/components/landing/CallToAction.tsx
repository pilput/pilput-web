"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, PenLine, BookOpen } from "lucide-react";
import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-10"
          >
            <p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed">
              Your words deserve a home.
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Ready to share your story?
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group w-full sm:min-w-[200px] h-14 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-xl"
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
                  className="w-full sm:min-w-[200px] h-14 text-base font-medium rounded-xl border-border hover:bg-accent/50"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore articles
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
