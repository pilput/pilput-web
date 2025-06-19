"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";
import Link from "next/link";

const CallToAction = () => {
  const stats = [
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Posts Created", value: "50K+", icon: Sparkles },
    { label: "Communities", value: "100+", icon: Zap }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
            style={{
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
              left: `${10 + i * 30}%`,
              top: `${10 + i * 20}%`,
              backgroundColor: `hsl(${220 + i * 20}, 70%, 60%)`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="text-sm px-4 py-1">
              Join the Community
            </Badge>
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight"
          >
            Ready to Start Your
            <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Creative Journey?
            </span>
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Join thousands of creators, developers, and writers who are already building 
            amazing content and connections on PILPUT.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link href="/register">
              <Button 
                size="lg" 
                className="group px-8 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/blog">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold border-2 hover:bg-muted/50 transition-all duration-300"
              >
                Explore Content
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground">
              No credit card required • Free forever • Join in 30 seconds
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;