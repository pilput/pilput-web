"use client";
import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import {
  BookOpen,
  Bot,
  Users,
  Zap,
  Sparkles,
  Code
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BentoGrid = ({ children, className }: { children: React.ReactNode; className?: string; }) => {
  return (
    <div className={cn("grid w-full auto-rows-[18rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6", className)}>
      {children}
    </div>
  );
};

const BentoCard = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ref.current.style.setProperty("--mouse-x", `${x}px`);
    ref.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
        // hover effects
        "transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10",
        className
      )}
      {...props}
    >
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Mouse tracking glow effect */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-px opacity-0 transition duration-300 rounded-xl",
          isHovered && "opacity-100"
        )}
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.08), transparent 40%)",
        }}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500 delay-100" />
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-700 delay-200" />
      </div>

      {children}
    </div>
  );
};

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: BookOpen,
      title: "Rich Content Creation",
      description: "Create and share engaging blog posts with our powerful editor featuring markdown support and real-time preview.",
      className: "col-span-1 md:col-span-1 lg:col-span-1",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" />,
      stats: "10K+ Posts Created",
      cta: "Start Writing",
      delay: 0.1,
    },
    {
      icon: Bot,
      title: "AI Chat",
      description: "Engage with our intelligent AI assistant. Ask questions, get help, and explore ideas.",
      className: "col-span-1 md:col-span-2 lg:col-span-2",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />,
      stats: "1M+ Conversations",
      cta: "Try AI Chat",
      delay: 0.2,
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a vibrant community of writers, developers, and creators. Build meaningful connections.",
      className: "col-span-1 md:col-span-2 lg:col-span-2",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/10 via-transparent to-transparent" />,
      stats: "50K+ Active Users",
      cta: "Join Community",
      delay: 0.3,
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built with Next.js and optimized for performance. Experience blazing fast load times.",
      className: "col-span-1 md:col-span-1 lg:col-span-1",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent" />,
      stats: "< 100ms Load Time",
      cta: "Experience Speed",
      delay: 0.4,
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Syntax highlighting, code blocks, and technical writing support.",
      className: "col-span-1 md:col-span-1 lg:col-span-1",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent" />,
      stats: "15+ Languages",
      cta: "Code Now",
      delay: 0.5,
    },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-background dark:bg-black">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="text-center mb-16"
        >
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Sparkles className="h-5 w-5 text-primary" />
            <Badge variant="outline" className="text-sm">
              Why Choose PILPUT
            </Badge>
          </motion.div>
          <motion.h2 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } } }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Powerful Features for Modern Creators
          </motion.h2>
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } } }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Everything you need to create, share, and connect. Built with the latest technologies 
            and designed for the modern web experience.
          </motion.p>
        </motion.div>

        <BentoGrid className="max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: feature.delay }}
            >
              <BentoCard className={feature.className}>
                {feature.background}
                <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-3 p-6 transition-all duration-300 group-hover:-translate-y-2 h-full">
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                    <Badge variant="secondary" className="text-xs font-medium">
                      {feature.stats}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="pointer-events-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                    >
                      {feature.cta}
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        →
                      </motion.div>
                    </motion.button>
                  </div>
                </div>
              </BentoCard>
            </motion.div>
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default Features;
