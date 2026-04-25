import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  ChevronDown,
  Globe2,
  PenLine,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HeroBackground from "./HeroBackground";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Start free",
    desc: "Publish your first draft without setup drag.",
  },
  {
    icon: Zap,
    title: "Fast reading",
    desc: "A clean page that keeps readers in the story.",
  },
  {
    icon: Globe2,
    title: "Open reach",
    desc: "Share ideas with readers across the web.",
  },
];

const Hero = () => {
  return (
    <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden border-b border-border/60 py-14 sm:py-18 lg:py-22">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.02))] dark:bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.02))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

      <HeroBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="landing-reveal">
            <Badge
              variant="outline"
              className="h-8 rounded-md border-primary/25 bg-background/70 px-3 text-xs font-semibold text-primary shadow-sm backdrop-blur-md"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Built for focused publishing
            </Badge>
          </div>

          <div className="mt-7 max-w-5xl space-y-5 landing-reveal landing-delay-1">
            <h1 className="text-4xl font-black leading-[1.03] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
              Write and publish
              <span className="block bg-linear-to-r from-primary via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                ideas worth reading.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg lg:text-xl">
              PILPUT gives writers a clean place to draft, publish, discover,
              and grow without burying the work under clutter.
            </p>
          </div>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row landing-reveal landing-delay-2">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group h-12 w-full rounded-md px-6 text-sm font-semibold shadow-lg shadow-primary/20 sm:min-w-48"
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
                className="h-12 w-full rounded-md border-border/70 bg-background/70 px-6 text-sm font-semibold backdrop-blur-md sm:min-w-48"
              >
                <BookOpenText className="mr-2 h-4 w-4" />
                Read articles
              </Button>
            </Link>
          </div>

          <div className="mt-10 w-full max-w-5xl landing-reveal landing-delay-3">
            <div className="overflow-hidden rounded-lg border border-border/70 bg-card/75 text-left shadow-2xl shadow-black/5 backdrop-blur-xl dark:shadow-black/20">
              <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-medium text-muted-foreground">
                  draft.pilput.net
                </span>
              </div>
              <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="space-y-5 p-5 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md bg-primary/10 px-2 py-1 font-semibold text-primary">
                      Draft
                    </span>
                    <span>7 min read</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span>Ready to publish</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-5 w-4/5 rounded bg-foreground/90" />
                    <div className="h-5 w-2/3 rounded bg-foreground/80" />
                    <div className="mt-4 h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-[92%] rounded bg-muted" />
                    <div className="h-3 w-[76%] rounded bg-muted" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {["Outline", "Media", "Tags"].map((label) => (
                      <div
                        key={label}
                        className="rounded-md border border-border/70 bg-background/60 px-3 py-2 text-xs font-medium text-muted-foreground"
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border/70 bg-muted/30 p-5 sm:p-7 lg:border-l lg:border-t-0">
                  <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Publishing flow
                  </div>
                  <div className="space-y-3">
                    {trustItems.map((item) => (
                      <div key={item.title} className="flex gap-3 rounded-md bg-background/70 p-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">
                            {item.title}
                          </h3>
                          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-30 landing-float">
        <ChevronDown className="h-5 w-5" />
      </div>
    </section>
  );
};

export default Hero;
