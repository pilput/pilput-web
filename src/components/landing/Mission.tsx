"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Target, Lightbulb, Heart } from "lucide-react";

const MissionSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  const values = [
    {
      icon: <Sparkles className="h-8 w-8 text-yellow-500" />,
      title: "Innovation",
      description: "Pushing the boundaries of what's possible in digital publishing",
    },
    {
      icon: <Target className="h-8 w-8 text-blue-500" />,
      title: "Accessibility",
      description: "Making publishing accessible to everyone, everywhere",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-orange-500" />,
      title: "Creativity",
      description: "Empowering creators to express their unique voices",
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Community",
      description: "Building meaningful connections between creators and readers",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-slate-100/[0.02] dark:bg-grid-slate-700/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-6">
            <Badge variant="secondary" className="mb-4 mx-auto">
              Our Mission
            </Badge>
          </motion.div>
          
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6"
          >
            Building the Future of Publishing
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            We're on a mission to democratize publishing and empower creators worldwide 
            to share their stories without barriers. Our platform combines cutting-edge 
            technology with intuitive design to create the ultimate publishing experience.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 h-full">
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
                    <p className="text-sm text-muted-foreground">What drives us forward</p>
                  </div>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We envision a world where every voice can be heard, where creators 
                    have the tools and platform they need to reach global audiences 
                    without gatekeepers or barriers.
                  </p>
                  <p>
                    Our commitment to open source and accessibility ensures that 
                    quality publishing tools are available to everyone, regardless 
                    of their background or resources.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 h-full">
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Our Commitment</h3>
                    <p className="text-sm text-muted-foreground">What we stand for</p>
                  </div>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We're committed to building a sustainable, ethical platform that 
                    prioritizes creator rights, data privacy, and community well-being 
                    over profit.
                  </p>
                  <p>
                    Every feature we build, every decision we make, is guided by our 
                    core values of transparency, inclusivity, and innovation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {values.map((value, index) => (
            <motion.div key={value.title} className="group" whileHover={{ y: -4 }} variants={itemVariants}>
              <Card className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-6 group-hover:bg-card/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
              <CardContent className="text-center space-y-4">
                  <motion.div
                    className="w-16 h-16 bg-background/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {value.icon}
                  </motion.div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">{value.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;