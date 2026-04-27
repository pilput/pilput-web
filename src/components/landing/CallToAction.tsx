import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  PenLine,
  Sparkles,
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
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-grid-slate-100/[0.03] dark:bg-grid-white/[0.02] bg-size-[40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(var(--color-primary),0.08),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(var(--color-primary),0.06),transparent)]" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card/60 px-6 py-14 text-center shadow-2xl shadow-black/5 backdrop-blur-xl sm:px-12 sm:py-18 lg:px-20 lg:py-20 landing-reveal">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border/50 to-transparent" />
            <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-40 w-40 rounded-full bg-primary/8 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
              <Badge
                variant="outline"
                className="h-8 rounded-full border-primary/25 bg-primary/8 px-4 text-xs font-semibold text-primary backdrop-blur-sm landing-reveal landing-delay-1"
              >
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Start your journey
              </Badge>

              <div className="mt-7 space-y-4 landing-reveal landing-delay-2">
                <h2 className="text-3xl font-black leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Ready to share
                  <span className="block bg-linear-to-r from-primary via-primary/85 to-primary/60 bg-clip-text text-transparent">
                    your story?
                  </span>
                </h2>

                <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  Your words deserve a home. Join a community of writers who
                  publish with clarity and confidence.
                </p>
              </div>

              <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:flex-row landing-reveal landing-delay-3">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="group h-12 w-full rounded-md px-7 text-sm font-semibold shadow-lg shadow-primary/20 sm:min-w-[210px]"
                  >
                    <PenLine className="mr-2 h-4 w-4" />
                    Start writing
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/blog" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 w-full rounded-md border-border/70 bg-background/70 px-7 text-sm font-semibold backdrop-blur-md sm:min-w-[210px]"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Explore articles
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 landing-reveal landing-delay-4">
                {benefits.map((b) => (
                  <div
                    key={b}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary/70" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
