import RandomPosts from "@/components/post/RandomPosts";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function Community() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-background py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-grid-slate-100/[0.03] dark:bg-grid-white/[0.02] bg-[length:40px_40px]" />
      
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center text-center sm:mb-14">
          <Badge variant="outline" className="h-8 rounded-md border-primary/20 bg-primary/5 px-3 text-xs font-semibold text-primary backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            Fresh reads
          </Badge>
          
          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-6xl">
            Explore what the community is publishing.
          </h2>
          
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Read recent stories, essays, and experiments from people building
            their voice in public.
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
