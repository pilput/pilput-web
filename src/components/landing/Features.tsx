import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bot,
  MessageCircle,
  PenTool,
  PieChart,
  Star,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  background: ReactNode;
  stats: string;
  cta: string;
  href: string;
  glowColor?: "primary" | "blue" | "purple" | "green" | "yellow";
  accentIcon?: LucideIcon;
}

const glowClassByColor = {
  primary: "hover:shadow-primary/20",
  blue: "hover:shadow-blue-500/20",
  purple: "hover:shadow-purple-500/20",
  green: "hover:shadow-green-500/20",
  yellow: "hover:shadow-yellow-500/20",
} as const;

const Features = () => {
  const features: Feature[] = [
    {
      id: "content-creation",
      icon: BookOpen,
      title: "Immersive Writing",
      description:
        "Craft stories that captivate with high-performance writing tools. Enjoy a clean space with instant formatting and media integration.",
      background: (
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 right-0 p-8">
            <PenTool className="w-32 h-32 text-primary" />
          </div>
        </div>
      ),
      stats: "Clean & Simple",
      cta: "Start writing",
      href: "/dashboard/posts/create",
      glowColor: "primary",
      accentIcon: Star,
    },
    {
      id: "ai-chat",
      icon: Bot,
      title: "Creative Companion",
      description:
        "Never stare at a blank page again. Our smart assistant helps you brainstorm topics, outline ideas, and refine your tone as you write.",
      background: (
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute bottom-0 left-0 p-8">
            <MessageCircle className="w-32 h-32 text-primary" />
          </div>
        </div>
      ),
      stats: "Smart Assistant",
      cta: "Try Assistant",
      href: "/chat",
      glowColor: "primary",
      accentIcon: TrendingUp,
    },
    {
      id: "holdings",
      icon: PieChart,
      title: "Personal Dashboard",
      description:
        "Stay organized and track your progress. Manage your stories and get clear insights into how your content is performing.",
      background: (
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 p-8">
            <TrendingUp className="w-32 h-32 text-primary" />
          </div>
        </div>
      ),
      stats: "All-in-one",
      cta: "Go to Dashboard",
      href: "/dashboard/holdings",
      glowColor: "primary",
      accentIcon: PieChart,
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-muted/25 py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10 flex flex-col gap-5 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-5">
            <div className="landing-reveal">
              <Badge variant="secondary" className="h-8 rounded-md border-none bg-primary/10 px-3 text-xs font-semibold text-primary">
                Platform tools
              </Badge>
            </div>
            <h2 className="text-3xl font-black leading-tight tracking-tight landing-reveal landing-delay-1 sm:text-4xl lg:text-6xl">
              A practical workspace for writers who ship.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-muted-foreground landing-reveal landing-delay-2 sm:text-lg">
            Compose, improve, and manage your work with tools that feel fast
            enough to disappear while you use them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Link
              key={feature.id}
              href={feature.href}
              className="block landing-reveal"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <article
                className={cn(
                  "group relative h-[340px] w-full overflow-hidden rounded-lg",
                  "border border-border/70 bg-card/90 backdrop-blur-xl",
                  "shadow-sm transition-all duration-500",
                  "hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl",
                  feature.glowColor ? glowClassByColor[feature.glowColor] : glowClassByColor.primary
                )}
              >
                {feature.background}
                <div className="relative h-full flex flex-col p-6 sm:p-8">
                  <div className="mb-auto">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-500">
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <Badge variant="outline" className="rounded-md border-primary/20 text-[10px] uppercase tracking-widest font-bold">
                        {feature.stats}
                      </Badge>
                    </div>
                    <h3 className="mb-4 text-xl font-bold tracking-tight sm:text-2xl">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center text-sm font-bold text-primary group/btn">
                    <span className="mr-2">{feature.cta}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
