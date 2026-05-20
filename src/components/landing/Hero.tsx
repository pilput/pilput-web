"use client";

import { useState, useEffect, useRef } from "react";
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
import { cn } from "@/lib/utils";

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

const articlesData: Record<
  string,
  {
    title: string;
    body1: string;
    highlight: string;
    body2: string;
    readTime: string;
  }
> = {
  Markdown: {
    title: "The Future of Developer Platforms",
    body1: "Publishing should be simple. Writers deserve a clean workspace that focuses purely on content creation. That's why we built a markdown-first editor with zero distractions.",
    highlight: "lightning-fast loading speeds",
    body2: "out of the box. No bloated scripts, just clean HTML and dynamic layouts.",
    readTime: "5 min read",
  },
  WebDev: {
    title: "Speeding up Next.js App Router Builds",
    body1: "Performance is a crucial feature. Users expect instantaneous page transitions and optimized bundle delivery. In this article, we outline best practices for minimizing client bundles.",
    highlight: "zero-latency page loads",
    body2: "by utilizing server components and streaming. Say goodbye to heavy spinners.",
    readTime: "4 min read",
  },
  Writing: {
    title: "How to Build a Lifelong Writing Routine",
    body1: "Consistency beats intensity every single time. Reserving just fifteen minutes a day to write down your thoughts compounds into a massive archive of shared knowledge.",
    highlight: "compound interest of publishing",
    body2: "where every idea published acts as a beacon for like-minded thinkers.",
    readTime: "3 min read",
  },
};

const Hero = () => {
  const [selectedTag, setSelectedTag] = useState("Markdown");
  const [titleText, setTitleText] = useState("");
  const [isTitleTyped, setIsTitleTyped] = useState(false);
  const [tiltStyle, setTiltStyle] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    heading: 0, // 0 = default, 1 = H1, 2 = H2
    code: false,
    quote: false,
  });

  const toggleFormat = (key: keyof typeof activeFormats) => {
    setActiveFormats((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    setTitleText("");
    setIsTitleTyped(false);
  };

  useEffect(() => {
    let active = true;
    const targetTitle = articlesData[selectedTag].title;

    let index = 0;
    const interval = setInterval(() => {
      if (!active) return;
      if (index < targetTitle.length) {
        setTitleText(targetTitle.slice(0, index + 1));
        index++;
      } else {
        setIsTitleTyped(true);
        clearInterval(interval);
      }
    }, 30);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [selectedTag]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    const angleX = (yc - y) / 32; // subtle tilt
    const angleY = (x - xc) / 32;

    setTiltStyle(
      `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.005, 1.005, 1.005)`
    );
  };

  const handleMouseLeave = () => {
    setTiltStyle(
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    );
  };

  return (
    <section className="relative flex min-h-[82vh] items-center justify-center overflow-hidden border-b border-border/60 py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-linear-to-b from-muted/45 via-background to-background dark:from-muted/20" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

      <HeroBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="landing-reveal">
            <Badge
              variant="outline"
              className="h-8 rounded-md border-primary/25 bg-primary/5 hover:bg-primary/10 px-3 text-xs font-semibold text-primary shadow-xs backdrop-blur-md transition-all duration-300 animate-pulse-slow cursor-default"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Built for focused publishing
            </Badge>
          </div>

          <div className="mt-7 max-w-5xl space-y-5 landing-reveal landing-delay-1">
            <h1 className="text-4xl font-black leading-[1.03] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
              Write and publish
              <span className="block bg-linear-to-r from-primary via-primary/90 to-purple-500 bg-clip-text text-transparent">
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
                className="group h-12 w-full rounded-md px-6 text-sm font-semibold shadow-md shadow-primary/20 bg-linear-to-r from-primary to-primary/95 text-primary-foreground hover:brightness-110 hover:shadow-primary/30 transition-all duration-300 sm:min-w-48 cursor-pointer"
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
                className="h-12 w-full rounded-md border-border/70 bg-background/70 px-6 text-sm font-semibold backdrop-blur-md hover:bg-muted/30 transition-colors sm:min-w-48 cursor-pointer"
              >
                <BookOpenText className="mr-2 h-4 w-4" />
                Read articles
              </Button>
            </Link>
          </div>

          <div className="relative mt-12 w-full max-w-5xl landing-reveal landing-delay-3 group">
            {/* Ambient glows behind the editor */}
            <div className="absolute -top-12 -left-12 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-blob-float pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-72 h-72 rounded-full bg-purple-500/25 blur-3xl animate-blob-float pointer-events-none" style={{ animationDelay: "-8s" }} />

            {/* Interactive macOS styled window preview */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: tiltStyle,
                transition: "transform 0.15s ease-out",
              }}
              className="overflow-hidden rounded-lg border border-border/70 bg-card/90 text-left shadow-2xl shadow-black/5 backdrop-blur-xl dark:shadow-black/25 relative z-10"
            >
              <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3 bg-muted/10">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs font-semibold text-muted-foreground select-none">
                  Pilput editor preview
                </span>
              </div>
              <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="flex flex-col border-b border-border/70 lg:border-b-0">
                  <div className="flex flex-wrap items-center gap-1.5 border-b border-border/70 px-4 py-2 bg-muted/20 select-none">
                    <button
                      type="button"
                      onClick={() => toggleFormat("bold")}
                      className={cn(
                        "p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer",
                        activeFormats.bold &&
                          "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary"
                      )}
                      title="Bold"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFormat("italic")}
                      className={cn(
                        "p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer",
                        activeFormats.italic &&
                          "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary"
                      )}
                      title="Italic"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFormat("underline")}
                      className={cn(
                        "p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer",
                        activeFormats.underline &&
                          "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary"
                      )}
                      title="Underline"
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                    <span className="h-4 w-px bg-border mx-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setActiveFormats((prev) => ({
                          ...prev,
                          heading: prev.heading === 1 ? 0 : 1,
                        }));
                      }}
                      className={cn(
                        "p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer",
                        activeFormats.heading === 1 &&
                          "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary"
                      )}
                      title="Heading 1"
                    >
                      <Heading1 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveFormats((prev) => ({
                          ...prev,
                          heading: prev.heading === 2 ? 0 : 2,
                        }));
                      }}
                      className={cn(
                        "p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer",
                        activeFormats.heading === 2 &&
                          "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary"
                      )}
                      title="Heading 2"
                    >
                      <Heading2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="h-4 w-px bg-border mx-1" />
                    <button
                      type="button"
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-not-allowed opacity-50"
                      title="Bullet List"
                      disabled
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-not-allowed opacity-50"
                      title="Align Left"
                      disabled
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFormat("code")}
                      className={cn(
                        "p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer",
                        activeFormats.code &&
                          "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary"
                      )}
                      title="Code Block"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-not-allowed opacity-50"
                      title="Add Image"
                      disabled
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFormat("quote")}
                      className={cn(
                        "p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition cursor-pointer",
                        activeFormats.quote &&
                          "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary"
                      )}
                      title="Quote"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="relative space-y-4 p-5 sm:p-7 min-h-[300px] flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                          Saved
                        </span>
                        <span>{articlesData[selectedTag].readTime}</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                        <span>Ready to publish</span>
                      </div>

                      <h2
                        className={cn(
                          "text-xl sm:text-2xl font-black tracking-tight text-foreground transition-all duration-300",
                          activeFormats.heading === 1 && "text-2xl sm:text-4xl",
                          activeFormats.heading === 2 && "text-lg sm:text-xl",
                          activeFormats.bold && "font-black scale-102 origin-left",
                          activeFormats.italic && "italic",
                          activeFormats.underline && "underline"
                        )}
                      >
                        {titleText}
                        <span className="inline-block w-0.5 h-6 ml-0.5 bg-primary animate-cursor-blink align-middle" />
                      </h2>

                      <div
                        className={cn(
                          "transition-all duration-750 delay-100",
                          isTitleTyped
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2"
                        )}
                      >
                        <p
                          className={cn(
                            "text-xs sm:text-sm text-muted-foreground leading-relaxed transition-all duration-300",
                            activeFormats.bold && "font-bold text-foreground",
                            activeFormats.italic && "italic",
                            activeFormats.underline && "underline",
                            activeFormats.code &&
                              "font-mono bg-muted/65 p-2 rounded border border-border"
                          )}
                        >
                          {articlesData[selectedTag].body1}
                        </p>
                      </div>

                      <div
                        className={cn(
                          "relative transition-all duration-750 delay-300",
                          isTitleTyped
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2"
                        )}
                      >
                        <p
                          className={cn(
                            "text-xs sm:text-sm text-muted-foreground leading-relaxed transition-all duration-300",
                            activeFormats.code &&
                              "font-mono bg-muted/65 p-2 rounded border border-border"
                          )}
                        >
                          With Pilput, you get{" "}
                          <span
                            className={cn(
                              "bg-primary/15 text-foreground px-1 py-0.5 rounded cursor-pointer relative group/hl font-semibold transition-all",
                              activeFormats.bold &&
                                "font-black text-primary bg-primary/20",
                              activeFormats.italic && "italic",
                              activeFormats.underline && "underline"
                            )}
                          >
                            {articlesData[selectedTag].highlight}
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover/hl:flex items-center gap-1.5 bg-card text-foreground border border-border rounded-lg px-2.5 py-1.5 shadow-lg z-30 whitespace-nowrap text-[11px] transition-all">
                              <span className="font-bold text-primary">
                                Bold
                              </span>
                              <span className="text-border">|</span>
                              <span className="font-semibold hover:text-primary">
                                Link
                              </span>
                              <span className="text-border">|</span>
                              <span className="font-semibold hover:text-primary">
                                Comment
                              </span>
                            </span>
                          </span>{" "}
                          {articlesData[selectedTag].body2}
                        </p>
                      </div>

                      <div
                        className={cn(
                          "transition-all duration-750 delay-500",
                          isTitleTyped
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2"
                        )}
                      >
                        <div
                          className={cn(
                            "border-l-2 border-primary pl-4 my-4 italic text-xs sm:text-sm text-muted-foreground/90 bg-muted/20 py-2.5 pr-2 rounded-r transition-all duration-300",
                            activeFormats.quote &&
                              "border-l-4 bg-primary/5 text-foreground scale-[1.01]"
                          )}
                        >
                          &ldquo;
                          {articlesData[selectedTag].highlight ===
                          "lightning-fast loading speeds"
                            ? "The best writing happens when the tool fades into the background, leaving you alone with your thoughts."
                            : articlesData[selectedTag].highlight ===
                              "zero-latency page loads"
                            ? "A fast site isn't just a convenience; it is a direct driver of user engagement."
                            : "Write first, edit later. Keep the creative flow moving before turning on the critical lens."}
                          &rdquo;
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border/40 select-none">
                      {["Markdown", "WebDev", "Writing"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagChange(tag)}
                          className={cn(
                            "rounded px-2.5 py-0.5 text-[10px] font-bold transition-all cursor-pointer border",
                            selectedTag === tag
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                          )}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-border/70 bg-muted/30 p-5 sm:p-7 lg:border-l lg:border-t-0 select-none">
                  <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Publishing flow
                  </div>
                  <div className="space-y-3">
                    {trustItems.map((item) => (
                      <div
                        key={item.title}
                        className="flex gap-3 rounded-md border border-border/50 bg-background/80 p-3 shadow-xs hover:border-primary/20 hover:shadow-md transition-all duration-300"
                      >
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

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-30 landing-float select-none pointer-events-none">
        <ChevronDown className="h-5 w-5" />
      </div>
    </section>
  );
};

export default Hero;
