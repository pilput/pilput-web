import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  PenLine,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const benefits = [
  "Free to start",
  "No credit card required",
  "Publish in seconds",
];

const CallToAction = () => {
  return (
    <section className="relative overflow-hidden border-t border-border/40 bg-background py-20 sm:py-24 lg:py-28">
      <div className="absolute inset-0 bg-linear-to-b from-muted/25 to-background dark:from-muted/10 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/50 p-8 backdrop-blur-md sm:p-12 lg:p-16 landing-reveal">
          {/* Ambient accent glows */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/12 blur-3xl animate-blob-float" />
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-500/12 blur-3xl animate-blob-float"
            style={{ animationDelay: "-9s" }}
          />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="h-8 rounded-full border-primary/20 bg-primary/5 px-3.5 text-xs font-semibold text-primary"
              >
                Start publishing
              </Badge>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
                Turn a draft into something{" "}
                <span className="bg-linear-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:via-indigo-400 dark:to-purple-400">
                  people can read.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-pretty text-muted-foreground sm:text-lg">
                Create a clean writing space, publish when it is ready, and keep
                the focus on the work instead of the setup.
              </p>

              <ul className="mt-8 flex flex-wrap gap-2.5">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-2 rounded-full border border-border/50 bg-background/70 px-3.5 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border/40 bg-background/80 p-6 backdrop-blur-md border-glow-hover transition-all duration-500 sm:p-7">
              <div className="mb-6 flex items-center gap-3.5 border-b border-border/40 pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <PenLine className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold tracking-tight text-foreground">
                    Write your first post
                  </h3>
                  <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
                    Open the editor and start with a blank draft.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/register" className="block">
                  <Button
                    size="lg"
                    className="group h-12 w-full rounded-xl bg-linear-to-r from-primary to-primary/90 text-sm font-semibold transition-all duration-300 hover:brightness-105"
                  >
                    Start writing
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/blog" className="block">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 w-full rounded-xl border-border/70 bg-background/60 text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-muted/40"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse articles first
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
