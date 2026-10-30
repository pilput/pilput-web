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

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-8 sm:p-12 lg:p-16 landing-reveal">
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
                <span className="text-primary">
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
                    className="flex items-center gap-2 rounded-full border border-border/50 bg-background px-3.5 py-1.5 text-sm font-medium text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border/40 bg-background p-6 sm:p-7">
              <div className="mb-6 flex items-center gap-3.5 border-b border-border/40 pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <PenLine className="h-5 w-5" aria-hidden="true" />
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
                <Button
                  size="lg"
                  nativeButton={false}
                  render={<Link href="/register" />}
                  className="group h-12 w-full rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Start writing
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  nativeButton={false}
                  render={<Link href="/blog" />}
                  className="h-12 w-full rounded-xl border-border/70 bg-background text-sm font-semibold cursor-pointer transition-colors duration-200 hover:border-primary/30 hover:bg-muted/40"
                >
                  <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
                  Browse articles first
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
