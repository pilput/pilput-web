"use client";
import { motion, useInView } from "framer-motion";
import React, { useRef, useState, useCallback } from "react";
import {
  BookOpen,
  Bot,
  Users,
  Zap,
  Sparkles,
  LucideIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const FeatureList: React.FC<BentoGridProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "flex flex-col w-full gap-12 sm:gap-16 lg:gap-20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  "aria-label"?: string;
}

const FeatureCard: React.FC<BentoCardProps> = ({
  children,
  className,
  onClick,
  role = "button",
  tabIndex = 0,
  "aria-label": ariaLabel,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ref.current.style.setProperty("--mouse-x", `${x}px`);
    ref.current.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }, [onClick]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl",
        "cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
        // hover effects
        "transition-all duration-300 ease-out hover:shadow-xl hover:shadow-primary/10",
        className
      )}
      {...props}
    >
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300" />

      {/* Mouse tracking glow effect */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-px opacity-0 transition duration-300 rounded-2xl",
          (isHovered) && "opacity-100"
        )}
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.08), transparent 40%)",
        }}
      />

      {/* Floating particles effect - optimized */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500 delay-100" />
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-700 delay-200" />
      </div>

      {children}
    </div>
  );
};

interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  background: React.ReactNode;
  stats: string;
  cta: string;
  delay: number;
  href?: string;
}

const Features: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features: Feature[] = [
    {
      id: "content-creation",
      icon: BookOpen,
      title: "Rich Content Creation",
      description: "Create and share engaging blog posts with our powerful editor featuring markdown support, real-time preview, and collaborative writing tools.",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" />,
      stats: "10K+ Posts Created",
      cta: "Start Writing",
      delay: 0.1,
      href: "/dashboard/posts/create",
    },
    {
      id: "ai-chat",
      icon: Bot,
      title: "AI-Powered Chat",
      description: "Engage with our intelligent AI assistant. Get help with writing, research, brainstorming, and creative problem-solving.",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />,
      stats: "1M+ Conversations",
      cta: "Try AI Chat",
      delay: 0.2,
      href: "/chat",
    },
    {
      id: "community",
      icon: Users,
      title: "Thriving Community",
      description: "Join a vibrant community of writers, developers, and creators. Share knowledge, collaborate on projects, and build meaningful connections.",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/10 via-transparent to-transparent" />,
      stats: "50K+ Active Users",
      cta: "Join Community",
      delay: 0.3,
      href: "/forum",
    },
    {
      id: "performance",
      icon: Zap,
      title: "Lightning Fast",
      description: "Built with Next.js and optimized for performance. Experience blazing fast load times and seamless interactions across all devices.",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent" />,
      stats: "< 100ms Load Time",
      cta: "Experience Speed",
      delay: 0.4,
    }
  ];

  const handleFeatureClick = useCallback((feature: Feature) => {
    if (feature.href) {
      // In a real app, you'd use Next.js router
      console.log(`Navigate to: ${feature.href}`);
    }
  }, []);

  return (
    <section
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-background dark:bg-black"
      aria-labelledby="features-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#1a365d,transparent)]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        {/* Header Section */}
        <motion.header
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="inline-flex items-center gap-2 mb-4 sm:mb-6"
          >
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" aria-hidden="true" />
            <Badge variant="outline" className="text-xs sm:text-sm">
              Why Choose PILPUT
            </Badge>
          </motion.div>
          <motion.h2
            id="features-heading"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } } }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
          >
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Modern Creators
            </span>
          </motion.h2>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } } }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need to create, share, and connect. Built with the latest technologies
            and designed for the modern web experience.
          </motion.p>
        </motion.header>

        {/* Features Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 hidden sm:block" />

          <FeatureList role="list" aria-label="Platform features">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                role="listitem"
                className="relative flex gap-4 sm:gap-6"
              >
                {/* Timeline Node */}
                <div className="flex-shrink-0 relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.4, delay: feature.delay + 0.2, type: "spring" }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary border-2 border-primary flex items-center justify-center"
                  >
                    <feature.icon
                      className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground"
                      aria-hidden="true"
                    />
                  </motion.div>
                  {/* Connection dot for next item */}
                  {index < features.length - 1 && (
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-primary/30 hidden sm:block" />
                  )}
                </div>

                {/* Content Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: feature.delay + 0.3 }}
                  className="flex-1 pb-8"
                >
                  <FeatureCard
                    onClick={() => handleFeatureClick(feature)}
                    aria-label={`${feature.title}: ${feature.description}`}
                    className="h-auto min-h-[160px] sm:min-h-[180px]"
                  >
                    {feature.background}
                    <div className="z-10 p-4 sm:p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-sm font-medium">
                          {feature.stats}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-neutral-700 dark:text-neutral-300 leading-tight">
                          {feature.title}
                        </h3>
                        <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </FeatureCard>
                </motion.div>
              </motion.div>
            ))}
          </FeatureList>
        </div>
      </div>
    </section>
  );
};

export default Features;
