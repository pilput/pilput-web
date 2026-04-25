import Link from "next/link";
import { ArrowRight, BookOpen, PenLine, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-grid-slate-100/[0.03] dark:bg-grid-white/[0.02] bg-size-[40px_40px]" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-lg border border-border/70 bg-card/80 px-6 py-12 text-center shadow-xl shadow-black/5 backdrop-blur-md sm:px-10 sm:py-16 lg:px-16 lg:py-18 landing-reveal">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-primary/80 to-primary/55 pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] bg-grid-slate-100/[0.4] dark:bg-grid-white/[0.2] bg-size-[24px_24px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <Badge
                variant="outline"
                className="h-8 rounded-md border-primary/30 bg-primary/10 px-3 text-xs font-semibold text-primary landing-reveal landing-delay-1"
              >
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Start your journey
              </Badge>

              <div className="mt-6 space-y-4 landing-reveal landing-delay-2">
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Your words deserve a home.
                </p>

                <h2 className="text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl lg:text-6xl">
                  Ready to share your story?
                </h2>
              </div>

              <div className="mt-8 flex w-full flex-col sm:flex-row gap-3 justify-center items-center landing-reveal landing-delay-3">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="group h-12 w-full rounded-md text-sm font-semibold sm:min-w-[200px]"
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
                    className="h-12 w-full rounded-md border-primary/20 bg-background/70 text-sm font-semibold hover:bg-accent/50 sm:min-w-[200px]"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Explore articles
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
