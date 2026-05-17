import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Free to start",
  "No credit card required",
  "Publish in seconds",
];

const CallToAction = () => {
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-muted/25 py-16 sm:py-20 lg:py-24">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div className="max-w-3xl landing-reveal">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Start publishing
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Turn a draft into something people can read.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Create a clean writing space, publish when it is ready, and keep
              the focus on the work instead of the setup.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 landing-reveal landing-delay-1">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 rounded-md border border-border/70 bg-background/70 px-3 py-2 text-sm font-medium text-muted-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border/70 bg-background p-5 shadow-sm landing-reveal landing-delay-2">
            <div className="rounded-md border border-border/70 bg-card p-4">
              <div className="mb-5 flex items-center gap-3 border-b border-border/60 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <PenLine className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold tracking-tight">
                    Write your first post
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Open the editor and start with a blank draft.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/register" className="block">
                  <Button
                    size="lg"
                    className="group h-12 w-full rounded-md text-sm font-semibold shadow-md shadow-primary/15"
                  >
                    Start writing
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/blog" className="block">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 w-full rounded-md border-border/70 bg-background text-sm font-semibold"
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
