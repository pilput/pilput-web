"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Target, Lightbulb, Heart, Users, ArrowRight, Star, Coffee } from "lucide-react";

const MissionSection = () => {
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
    <section className="py-20 md:py-28 bg-linear-to-br from-background via-primary/5 to-background relative overflow-hidden border-t border-border/40">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-slate-100/[0.02] dark:bg-grid-slate-700/[0.02] bg-size-[50px_50px]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4 mx-auto bg-linear-to-r from-primary/20 to-secondary/20 border-primary/30">
              <Star className="inline-block mr-2 h-3 w-3" />
              Our Mission
            </Badge>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-6 leading-tight">
            Building the Future of Publishing
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We&apos;re on a mission to simplify publishing and empower creators worldwide
            to share their stories without barriers. Our platform combines intuitive
            tools with elegant design to create an effortless creative experience.
          </p>
        </div>

        {/* Writing Illustration Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-50/50 via-background to-orange-50/30 dark:from-amber-950/20 dark:via-background dark:to-orange-950/10 border border-border/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Text Content */}
              <div className="p-8 lg:p-12 space-y-6 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium">
                  <Coffee className="h-4 w-4" />
                  <span>The Writing Experience</span>
                </div>

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                  Where Ideas Flow and Stories Come to Life
                </h3>

                <p className="text-muted-foreground text-lg leading-relaxed">
                  We believe the best writing happens in a space that feels comfortable and inspiring. 
                  Our platform is designed to recreate that cozy corner café atmosphere where creativity 
                  flourishes and words flow effortlessly.
                </p>

                <div className="flex flex-wrap gap-3">
                  {["Distraction-free", "Intuitive", "Beautiful"].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className="relative h-75 sm:h-100 lg:h-112.5 order-1 lg:order-2 overflow-hidden">
                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80"
                    alt="Cozy writing experience with coffee and stationery"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {/* Decorative overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-l from-transparent via-transparent to-background/20 dark:to-background/40 pointer-events-none" />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-24 h-24 bg-amber-200/20 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl px-8 h-full transition-all duration-300 hover:border-primary/40">
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-linear-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Our Vision</h3>
                    <p className="text-sm text-muted-foreground">What drives us forward</p>
                  </div>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We envision a world where every voice can be heard, where creators
                    have the tools and platform they need to reach global audiences
                    easily and effectively.
                  </p>
                  <p>
                    Our commitment to community and accessibility ensures that
                    premium publishing tools are available to everyone, regardless
                    of their technical background.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl px-8 h-full transition-all duration-300 hover:border-secondary/40">
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-linear-to-br from-secondary/20 to-purple-500/20 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Our Commitment</h3>
                    <p className="text-sm text-muted-foreground">What we stand for</p>
                  </div>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We&apos;re committed to building a sustainable, community-first platform that
                    prioritizes creator rights, privacy, and meaningful connections.
                  </p>
                  <p>
                    Every feature we build is designed to make your writing journey
                    smoother, more enjoyable, and more impactful.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-16">
          {values.map((value, index) => {
            const colors = [
              { bg: "from-yellow-500/10 to-orange-500/10", border: "border-yellow-500/20" },
              { bg: "from-blue-500/10 to-indigo-500/10", border: "border-blue-500/20" },
              { bg: "from-orange-500/10 to-red-500/10", border: "border-orange-500/20" },
              { bg: "from-red-500/10 to-pink-500/10", border: "border-red-500/20" }
            ][index % 4];

            return (
              <div key={value.title} className="group">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1">
                  <CardContent className={`p-6 rounded-xl bg-linear-to-br ${colors.bg} ${colors.border} border space-y-4`}>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="inline-block"
                    >
                      {value.icon}
                    </motion.div>
                    <h4 className="text-lg font-semibold">{value.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-linear-to-r from-primary/10 via-secondary/10 to-purple-500/10 rounded-3xl p-12 backdrop-blur-sm border border-border/50">
            <h3 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
              Join Our Journey
            </h3>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Whether you&apos;re a writer, storyteller, or simply someone who
              believes in the power of shared ideas, there&apos;s a place for you here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-6 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Link href="/register">
                  <Users className="mr-2 h-5 w-5" />
                  Become a Creator
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-6 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Link href="/explore">
                  Explore Stories
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
