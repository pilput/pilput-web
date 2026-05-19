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
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  AlignLeft,
  Code,
  Image as ImageIcon,
  Quote,
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
      <div className="absolute inset-0 bg-linear-to-b from-muted/45 via-background to-background dark:from-muted/20" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

      <HeroBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="landing-reveal">
            <Badge
              variant="outline"
              className="h-8 rounded-md border-primary/25 bg-background/80 px-3 text-xs font-semibold text-primary shadow-sm backdrop-blur-md"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Built for focused publishing
            </Badge>
          </div>

          <div className="mt-7 max-w-5xl space-y-5 landing-reveal landing-delay-1">
            <h1 className="text-4xl font-black leading-[1.03] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
              Write and publish
              <span className="block text-primary">
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
                className="group h-12 w-full rounded-md px-6 text-sm font-semibold shadow-md shadow-primary/15 sm:min-w-48"
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
            <div className="overflow-hidden rounded-lg border border-border/70 bg-card/90 text-left shadow-xl shadow-black/5 backdrop-blur-xl dark:shadow-black/20">
              <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-primary/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary/45" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                <span className="ml-3 text-xs font-medium text-muted-foreground">
                  Pilput editor preview
                </span>
              </div>
              <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-1.5 border-b border-border/70 px-4 py-2 bg-muted/20">
                    <button type="button" className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                    <button type="button" className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                    <button type="button" className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer" title="Underline"><Underline className="w-3.5 h-3.5" /></button>
                    <span className="h-4 w-px bg-border mx-1" />
                    <button type="button" className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer" title="Heading 1"><Heading1 className="w-3.5 h-3.5" /></button>
                    <button type="button" className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer" title="Heading 2"><Heading2 className="w-3.5 h-3.5" /></button>
                    <span className="h-4 w-px bg-border mx-1" />
                    <button type="button" className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer" title="Bullet List"><List className="w-3.5 h-3.5" /></button>
                    <button type="button" className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer" title="Align Left"><AlignLeft className="w-3.5 h-3.5" /></button>
                    <button type="button" className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer" title="Code"><Code className="w-3.5 h-3.5" /></button>
                    <button type="button" className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer" title="Add Image"><ImageIcon className="w-3.5 h-3.5" /></button>
                    <button type="button" className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer" title="Quote"><Quote className="w-3.5 h-3.5" /></button>
                  </div>
                  
                  <div className="relative space-y-4 p-5 sm:p-7 min-h-[300px] flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                          Saved
                        </span>
                        <span>5 min read</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                        <span>Ready to publish</span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                        The Future of Developer Platforms
                      </h2>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Publishing should be simple. Writers deserve a clean workspace that focuses purely on content creation. That&apos;s why we built a markdown-first editor with zero distractions.
                      </p>

                      <div className="relative">
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          With Pilput, you get{" "}
                          <span className="bg-primary/15 text-foreground px-1 py-0.5 rounded cursor-pointer relative group/hl font-semibold">
                            lightning-fast loading speeds
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover/hl:flex items-center gap-1.5 bg-card text-foreground border border-border rounded-lg px-2.5 py-1.5 shadow-lg z-30 whitespace-nowrap text-[11px] transition-all">
                              <span className="font-bold text-primary">Bold</span>
                              <span className="text-border">|</span>
                              <span className="font-semibold hover:text-primary">Link</span>
                              <span className="text-border">|</span>
                              <span className="font-semibold hover:text-primary">Comment</span>
                            </span>
                          </span>{" "}
                          out of the box. No bloated scripts, just clean HTML and dynamic layouts.
                        </p>
                      </div>

                      <div className="border-l-2 border-primary pl-4 my-4 italic text-xs sm:text-sm text-muted-foreground/90 bg-muted/20 py-2.5 pr-2 rounded-r">
                        &ldquo;The best writing happens when the tool fades into the background, leaving you alone with your thoughts.&rdquo;
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border/40">
                      {["Markdown", "WebDev", "Writing"].map((tag) => (
                        <div
                          key={tag}
                          className="rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary"
                        >
                          #{tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-border/70 bg-muted/30 p-5 sm:p-7 lg:border-l lg:border-t-0">
                  <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Publishing flow
                  </div>
                  <div className="space-y-3">
                    {trustItems.map((item) => (
                      <div key={item.title} className="flex gap-3 rounded-md border border-border/50 bg-background/80 p-3">
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
