"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, FileText, MessageCircle, Globe, Award } from "lucide-react";

const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    {
      icon: Users,
      label: "Active Users",
      value: 12500,
      suffix: "+",
      description: "Growing community",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FileText,
      label: "Posts Published",
      value: 48000,
      suffix: "+",
      description: "Knowledge shared",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MessageCircle,
      label: "Messages Sent",
      value: 250000,
      suffix: "+",
      description: "Conversations started",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Globe,
      label: "Countries",
      value: 85,
      suffix: "+",
      description: "Global reach",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Award,
      label: "Success Rate",
      value: 98,
      suffix: "%",
      description: "User satisfaction",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: TrendingUp,
      label: "Growth Rate",
      value: 150,
      suffix: "%",
      description: "Year over year",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isInView) return;

      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [isInView, value]);

    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
    };

    return (
      <span className="text-4xl md:text-5xl font-bold">
        {formatNumber(count)}{suffix}
      </span>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="text-sm">
              Platform Statistics
            </Badge>
          </motion.div>
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Trusted by Creators
            <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Worldwide
            </span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Our platform continues to grow, connecting creators and fostering innovation 
            across the globe. Here&apos;s what we&apos;ve achieved together.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full group hover:shadow-2xl transition-all duration-500 border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 relative overflow-hidden">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <CardContent className="p-8 text-center relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-foreground group-hover:text-primary transition-colors duration-300">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mt-2 group-hover:text-primary transition-colors duration-300">
                        {stat.label}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">
                Live statistics • Updated in real-time
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;