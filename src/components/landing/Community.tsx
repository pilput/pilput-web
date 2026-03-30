import RandomPosts from "@/components/post/RandomPosts";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function Community() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid-slate-100/[0.03] dark:bg-grid-white/[0.02] bg-[length:40px_40px]" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16 sm:mb-24 space-y-6">
          <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary backdrop-blur-sm rounded-full">
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            Discover what&apos;s new
          </Badge>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
            Latest from our <br />
            <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              creative community.
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
            Explore the latest stories, insights, and perspectives shared by 
            passionate creators around the world.
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background pointer-events-none z-10 h-24 -bottom-1" />
          <RandomPosts />
        </div>
      </div>
    </section>
  );
}
