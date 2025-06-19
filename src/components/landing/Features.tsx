"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  MessageSquare, 
  Users, 
  Zap, 
  Shield, 
  Sparkles,
  Code,
  Globe
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Rich Content Creation",
      description: "Create and share engaging blog posts with our powerful editor featuring markdown support and real-time preview.",
      color: "from-blue-500 to-cyan-500",
      badge: "Popular"
    },
    {
      icon: MessageSquare,
      title: "Interactive Chat",
      description: "Connect with the community through our real-time chat system. Share ideas and collaborate instantly.",
      color: "from-purple-500 to-pink-500",
      badge: "New"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a vibrant community of writers, developers, and creators. Build meaningful connections.",
      color: "from-green-500 to-emerald-500",
      badge: "Growing"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built with Next.js and optimized for performance. Experience blazing fast load times and smooth interactions.",
      color: "from-yellow-500 to-orange-500",
      badge: "Fast"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security. We prioritize your privacy and data protection.",
      color: "from-red-500 to-rose-500",
      badge: "Secure"
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Built by developers, for developers. Syntax highlighting, code blocks, and technical writing support.",
      color: "from-indigo-500 to-blue-500",
      badge: "Dev"
    }
  ];

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
    hidden: { opacity: 0, y: 20 },
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
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="text-sm">
              Why Choose PILPUT
            </Badge>
          </motion.div>
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            Powerful Features for
            <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Modern Creators
            </span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need to create, share, and connect. Built with the latest technologies 
            and designed for the modern web.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;