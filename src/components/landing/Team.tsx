"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Code, Brush, Rocket } from "lucide-react";

const TeamSection = () => {
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

  const teamMembers = [
    {
      name: "Creative Design",
      icon: <Brush className="h-8 w-8 text-primary" />,
      description: "Beautiful, intuitive interfaces that make publishing a joy",
      stats: [
        { label: "UI/UX Design", value: "Pixel Perfect" },
        { label: "Responsive", value: "100%" },
        { label: "Accessibility", value: "WCAG AA" },
      ],
    },
    {
      name: "Engineering",
      icon: <Code className="h-8 w-8 text-secondary" />,
      description: "Cutting-edge technology built with modern frameworks and best practices",
      stats: [
        { label: "Performance", value: "90+ Lighthouse" },
        { label: "Security", value: "Top Tier" },
        { label: "Scalability", value: "Global" },
      ],
    },
    {
      name: "Community",
      icon: <Users className="h-8 w-8 text-green-500" />,
      description: "Supportive ecosystem of creators, developers, and enthusiasts",
      stats: [
        { label: "Active Users", value: "10K+" },
        { label: "Contributors", value: "100+" },
        { label: "Countries", value: "50+" },
      ],
    },
    {
      name: "Innovation",
      icon: <Rocket className="h-8 w-8 text-purple-500" />,
      description: "Always pushing boundaries with new features and improvements",
      stats: [
        { label: "Updates", value: "Weekly" },
        { label: "Features", value: "User-Driven" },
        { label: "Vision", value: "Future-Ready" },
      ],
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-linear-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-slate-100/[0.02] dark:bg-grid-slate-700/[0.02] bg-size-[50px_50px]" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-2xl" />

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
              Our Team & Values
            </Badge>
          </motion.div>
          
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6"
          >
            Powered by Passion & Innovation
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Our diverse team of creators, developers, and visionaries work together 
            to build the publishing platform of tomorrow. We believe in open collaboration, 
            continuous learning, and making a positive impact on the creative community.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {teamMembers.map((member, index) => (
            <motion.div key={member.name} variants={itemVariants} className="group">
              <Card className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-8 group-hover:bg-card/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/20 h-full">
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-background/50 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors group-hover:scale-110">
                      {member.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">What we excel at</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed text-lg">{member.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    {member.stats.map((stat, statIndex) => (
                      <div key={stat.label} className="text-center group-hover:scale-105 transition-transform">
                        <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-20 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={itemVariants}
        >
          <div className="bg-linear-to-r from-primary/10 via-secondary/10 to-purple/10 rounded-3xl p-12 backdrop-blur-sm border border-border/50">
            <motion.h3
              className="text-3xl md:text-4xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Join Our Journey
            </motion.h3>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Whether you're a writer, developer, designer, or simply someone who 
              believes in the power of open publishing, there's a place for you here.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
                Contribute on GitHub
              </button>
              <button className="border border-border hover:border-primary/50 hover:bg-primary/5 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
                Join Our Community
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;