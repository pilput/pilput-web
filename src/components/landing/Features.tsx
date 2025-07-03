"use client";
import { motion, useInView } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { useRef } from "react";
import { 
  BookOpen, 
  MessageSquare, 
  Users, 
  Zap, 
  Sparkles,
  Code
} from "lucide-react";

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: BookOpen,
      title: "Rich Content Creation",
      description: "Create and share engaging blog posts with our powerful editor featuring markdown support and real-time preview.",
      color: "from-blue-500/20 via-blue-400/30 to-cyan-400/20",
      darkColor: "from-blue-400/30 via-blue-300/40 to-cyan-300/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      shadowColor: "shadow-blue-200/20 dark:shadow-blue-400/10",
      badge: "Popular",
      delay: 0
    },
    {
      icon: MessageSquare,
      title: "Interactive Chat",
      description: "Connect with the community through our real-time chat system. Share ideas and collaborate instantly.",
      color: "from-purple-500/20 via-purple-400/30 to-pink-400/20",
      darkColor: "from-purple-400/30 via-purple-300/40 to-pink-300/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      shadowColor: "shadow-purple-200/20 dark:shadow-purple-400/10",
      badge: "New",
      delay: 0.1
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a vibrant community of writers, developers, and creators. Build meaningful connections.",
      color: "from-green-500/20 via-green-400/30 to-emerald-400/20",
      darkColor: "from-green-400/30 via-green-300/40 to-emerald-300/30",
      iconColor: "text-green-600 dark:text-green-400",
      shadowColor: "shadow-green-200/20 dark:shadow-green-400/10",
      badge: "Growing",
      delay: 0.2
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built with Next.js and optimized for performance. Experience blazing fast load times and smooth interactions.",
      color: "from-yellow-500/20 via-yellow-400/30 to-orange-400/20",
      darkColor: "from-yellow-400/30 via-yellow-300/40 to-orange-300/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      shadowColor: "shadow-yellow-200/20 dark:shadow-yellow-400/10",
      badge: "Fast",
      delay: 0.3
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Built by developers, for developers. Syntax highlighting, code blocks, and technical writing support.",
      color: "from-indigo-500/20 via-indigo-400/30 to-blue-400/20",
      darkColor: "from-indigo-400/30 via-indigo-300/40 to-blue-300/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      shadowColor: "shadow-indigo-200/20 dark:shadow-indigo-400/10",
      badge: "Dev",
      delay: 0.4
    }
  ];

  // Variants defined directly in the component



  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background/95 dark:to-muted/10">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/30 dark:from-background dark:via-background/98 dark:to-muted/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Floating Elements */}
      <motion.div 
        animate={{
          y: [-10, 10, -10],
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded-full blur-sm"
      />
      <motion.div 
        animate={{
          y: [-10, 10, -10],
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }
        }}
        className="absolute top-40 right-20 w-6 h-6 bg-secondary/20 rounded-full blur-sm"
      />
      <motion.div 
        animate={{
          y: [-10, 10, -10],
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }
        }}
        className="absolute bottom-40 left-20 w-3 h-3 bg-accent/20 rounded-full blur-sm"
      />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
              }
            }
          }}
          className="text-center mb-20"
        >
          <motion.div 
            variants={{
              hidden: { 
                opacity: 0, 
                y: 60,
                scale: 0.8,
                rotateX: -15
              },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  mass: 1
                }
              }
            }} 
            className="inline-flex items-center gap-3 mb-6">
            <motion.div
                variants={{
                  hidden: { scale: 0, rotate: -180 },
                  visible: {
                    scale: 1,
                    rotate: 0,
                    transition: {
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.3
                    }
                  },
                  hover: {
                    scale: 1.1,
                    rotate: 360,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }
                }}
                className="p-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm"
              >
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>
            <Badge variant="secondary" className="text-sm px-4 py-1 bg-background/50 backdrop-blur-sm border border-primary/20">
              Why Choose PILPUT
            </Badge>
          </motion.div>
          <motion.h2 
            variants={{
              hidden: { 
                opacity: 0, 
                y: 60,
                scale: 0.8,
                rotateX: -15
              },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  mass: 1
                }
              }
            }}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 dark:from-foreground dark:via-foreground/95 dark:to-foreground/85 bg-clip-text text-transparent">
              Powerful Features for
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary dark:from-primary dark:via-primary/90 dark:to-secondary/90 bg-clip-text text-transparent relative">
              Modern Creators
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-secondary/50 dark:from-primary/70 dark:to-secondary/70 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isInView ? 1 : 0 }}
                transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
              />
            </span>
          </motion.h2>
          <motion.p 
            variants={{
              hidden: { 
                opacity: 0, 
                y: 60,
                scale: 0.8,
                rotateX: -15
              },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  mass: 1
                }
              }
            }}
            className="text-xl md:text-2xl text-muted-foreground dark:text-muted-foreground/95 max-w-4xl mx-auto leading-relaxed font-light"
          >
            Everything you need to create, share, and connect. Built with the latest technologies 
            and designed for the modern web experience.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Optimized grid layout for 5 features */}
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div 
                key={index} 
                custom={feature.delay}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                whileHover="hover"
                variants={{
                  hidden: { 
                    opacity: 0, 
                    y: 50,
                    scale: 0.9
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 120,
                      damping: 20,
                      delay: feature.delay,
                      duration: 0.6
                    }
                  },
                  hover: {
                    y: -8,
                    scale: 1.02,
                    rotateY: 5,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }
                }}
                className="group perspective-1000"
              >
                <div className="h-full relative bg-white dark:bg-card rounded-2xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-md border-l-4 border-l-transparent group-hover:border-l-primary dark:shadow-lg dark:shadow-primary/5">
                    {/* Geometric background pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-5 dark:opacity-10">
                      <div className={`w-full h-full bg-gradient-to-br ${feature.color} dark:bg-gradient-to-br dark:${feature.darkColor} rounded-full transform rotate-45 scale-150`} />
                    </div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 opacity-10 dark:opacity-15">
                      <div className={`w-full h-full bg-gradient-to-tr ${feature.color} dark:bg-gradient-to-tr dark:${feature.darkColor} rounded-full transform -rotate-12`} />
                    </div>
                    
                    <div className="relative z-10 p-6">
                    <div className="pb-4">
                       <div className="flex items-center justify-between mb-6">
                         <motion.div 
                             variants={{
                               hidden: { scale: 0, rotate: -180 },
                               visible: {
                                 scale: 1,
                                 rotate: 0,
                                 transition: {
                                   type: "spring",
                                   stiffness: 200,
                                   damping: 15,
                                   delay: 0.3
                                 }
                               },
                               hover: {
                                 scale: 1.1,
                                 rotate: 360,
                                 transition: {
                                   type: "spring",
                                   stiffness: 300,
                                   damping: 20
                                 }
                               }
                             }}
                             whileHover="hover"
                             className={`relative p-4 rounded-2xl bg-gradient-to-r ${feature.color} dark:bg-gradient-to-r dark:${feature.darkColor} transition-all duration-300 group-hover:scale-105 backdrop-blur-sm`}
                           >
                             <IconComponent className={`h-7 w-7 ${feature.iconColor}`} />
                             <div className="absolute inset-0 bg-white/10 dark:bg-black/5 rounded-2xl" />
                           </motion.div>
                         <Badge 
                             variant="outline" 
                             className={`text-xs px-4 py-2 rounded-full bg-gradient-to-r ${feature.color} dark:bg-gradient-to-r dark:${feature.darkColor} ${feature.iconColor} border-0 font-semibold shadow-md dark:shadow-lg dark:shadow-primary/10`}
                           >
                             {feature.badge}
                           </Badge>
                       </div>
                       <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-3">
                          {feature.title}
                        </h3>
                        <div className={`w-12 h-1 bg-gradient-to-r ${feature.color} dark:bg-gradient-to-r dark:${feature.darkColor} rounded-full mb-4`} />
                      </div>
                      <div>
                        <p className="text-base leading-relaxed text-muted-foreground/80 dark:text-muted-foreground/90 mb-6">
                          {feature.description}
                        </p>
                       

                     </div>
                  </div>
                 </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
