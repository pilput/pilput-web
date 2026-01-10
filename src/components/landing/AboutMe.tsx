"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Globe, MapPin, Code2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AboutMe = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="py-20 bg-background/50 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Creator</h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="relative group">
              <div className="relative z-10 bg-card border border-border rounded-2xl p-2 shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
                 <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                    <Image 
                      src="https://avatars.githubusercontent.com/u/48351693?v=4" 
                      alt="Cecep Januardi"
                      fill
                      className="object-cover"
                    />
                 </div>
              </div>
              <div className="absolute -top-4 -left-4 w-full h-full bg-primary/10 rounded-2xl -z-0 transition-transform duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2" />
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-purple-500/10 rounded-2xl -z-0 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold mb-2">Cecep Januardi</h3>
                <p className="text-xl text-primary font-medium">Full Stack Developer</p>
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4" />
                  <span>West Sumatera, Indonesia</span>
                </div>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">
                I am a passionate Full Stack Developer specializing in building scalable web applications. 
                With expertise in the JavaScript ecosystem and Go, I love creating open-source tools 
                and platforms that help developers and creators.
              </p>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["TypeScript", "Go", "React", "Next.js", "Laravel", "Node.js"].map((tech) => (
                    <Badge key={tech} variant="secondary" className="px-3 py-1 hover:bg-primary/20 transition-colors cursor-default">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button variant="outline" size="icon" asChild className="hover:text-primary hover:border-primary/50 transition-colors">
                  <Link href="https://github.com/cecep31" target="_blank" aria-label="GitHub Profile">
                    <Github className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild className="hover:text-blue-600 hover:border-blue-600/50 transition-colors">
                  <Link href="https://www.linkedin.com/in/cecep31/" target="_blank" aria-label="LinkedIn Profile">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild className="hover:text-sky-500 hover:border-sky-500/50 transition-colors">
                  <Link href="https://twitter.com/cecep_januardi" target="_blank" aria-label="Twitter Profile">
                    <Twitter className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild className="hover:text-purple-500 hover:border-purple-500/50 transition-colors">
                  <Link href="https://pilput.me" target="_blank" aria-label="Personal Website">
                    <Globe className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutMe;
