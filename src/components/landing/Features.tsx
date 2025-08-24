"use client";
import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import { 
  BookOpen, 
  Bot, 
  Users, 
  Zap, 
  Sparkles,
  Code,
  Palette
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BentoGrid = ({ children, className }: { children: React.ReactNode; className?: string; }) => {
  return (
    <div className={cn("grid w-full auto-rows-[18rem] grid-cols-3 gap-6", className)}>
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
        "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-px opacity-0 transition duration-300",
          isHovered && "opacity-100"
        )}
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)",
        }}
      />
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
      className: "col-span-3 lg:col-span-1",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" />,
    },
    {
      icon: Bot,
      title: "AI Chat",
      description: "Engage with our intelligent AI assistant. Ask questions, get help, and explore ideas.",
      className: "col-span-3 lg:col-span-2",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />,
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a vibrant community of writers, developers, and creators. Build meaningful connections.",
      className: "col-span-3 lg:col-span-2",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/10 via-transparent to-transparent" />,
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built with Next.js and optimized for performance. Experience blazing fast load times.",
      className: "col-span-3 lg:col-span-1",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent" />,
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Syntax highlighting, code blocks, and technical writing support.",
      className: "col-span-3 lg:col-span-1",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent" />,
    },
    {
      icon: Palette,
      title: "Customizable UI",
      description: "Tailor the look and feel of your space with customizable themes and layouts.",
      className: "col-span-3 lg:col-span-2",
      background: <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500/10 via-transparent to-transparent" />,
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
            <BentoCard key={index} className={feature.className}>
              {feature.background}
              <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-2">
                <feature.icon className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300">
                  {feature.title}
                </h3>
                <p className="max-w-lg text-neutral-500 dark:text-neutral-400">
                  {feature.description}
                </p>
              </div>
            </BentoCard>
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default Features;

