"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useRef, useState } from "react";

const Landing = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const [isHovered, setIsHovered] = useState(false);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div 
      ref={containerRef}
      className="relative min-h-[670px] w-full flex items-center justify-center overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background gradient with parallax effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted"
        style={{ y, opacity }}
      />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl"
            animate={{
              x: [0, 30, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
              backgroundColor: `hsl(${i * 60}, 70%, 95%)`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-20 container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge 
              variant="secondary" 
              className="mb-4 cursor-pointer"
              onClick={() => setIsHovered(!isHovered)}
            >
              Available for Freelance Work
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-2"
                >
                  👋
                </motion.span>
              )}
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50"
          >
            Hi, I&#x27;m <span className="font-extrabold">CECEP JANUARDI</span>
          </motion.h1>

          <motion.h2 
            variants={itemVariants}
            className="text-xl md:text-2xl lg:text-3xl font-semibold text-muted-foreground"
          >
            Full Stack Developer
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="max-w-[700px] text-muted-foreground md:text-lg"
          >
            Passionate about crafting elegant solutions through code. Specializing in modern web development
            with expertise in Next.js, React, and Node.js. Let&#x27;s turn your ideas into reality.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4"
          >
            <Button 
              asChild 
              size="lg"
              className="relative group overflow-hidden"
            >
              <Link href="/contact">
                <span className="relative z-10">Get in Touch</span>
                <motion.div
                  className="absolute inset-0 bg-primary-foreground"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "tween" }}
                />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              asChild 
              size="lg"
              className="group"
            >
              <Link href="/projects">
                <motion.span
                  initial={{ opacity: 1 }}
                  whileHover={{ opacity: 0.7 }}
                >
                  View My Work
                </motion.span>
              </Link>
            </Button>
          </motion.div>

          
        </div>
      </div>
    </motion.div>
  );
};

export default Landing;
