import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Github, Twitter, Linkedin, Mail, LucideIcon } from "lucide-react";

interface SocialLink {
  name: string;
  url: string;
  icon: LucideIcon;
  description: string;
  color: string;
  hoverColor: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/cecep31",
    icon: Github,
    description: "Check out my open source projects",
    color: "text-gray-800 dark:text-gray-200",
    hoverColor: "hover:bg-gray-500/10",
  },
  {
    name: "Twitter",
    url: "https://x.com/cecep_januardi",
    icon: Twitter,
    description: "Follow me for tech updates",
    color: "text-blue-500 dark:text-blue-400",
    hoverColor: "hover:bg-blue-500/10",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/cecep31",
    icon: Linkedin,
    description: "Connect with me professionally",
    color: "text-blue-600 dark:text-blue-500",
    hoverColor: "hover:bg-blue-500/10",
  },
  {
    name: "Email",
    url: "mailto:cecepjanuardi@proton.me",
    icon: Mail,
    description: "Drop me a message",
    color: "text-green-600 dark:text-green-500",
    hoverColor: "hover:bg-green-500/10",
  },
];

export default function Social() {
  return (
    <section className="w-full border-t border-border/50 bg-gradient-to-b from-background to-primary/5 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100/[0.02] dark:bg-grid-slate-700/[0.02] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <CardHeader className="text-center pb-12">
          <CardTitle className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            Let&apos;s Connect!
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find me across the web and let&apos;s start a conversation. I'm always open to discussing new projects, ideas, or just tech in general.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {socialLinks.map((social, index) => (
              <Button
                key={social.name}
                variant="outline"
                className={cn(
                  "group h-auto py-8 px-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-lg border-border/50 bg-card/50 backdrop-blur-sm",
                  social.hoverColor,
                )}
                asChild
              >
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <div className="p-4 rounded-full bg-background/80 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <social.icon
                      className={cn(
                        "h-8 w-8 transition-colors duration-300",
                        social.color,
                      )}
                    />
                  </div>
                  <div className="space-y-1 text-center">
                    <span className="font-bold text-lg text-foreground block">{social.name}</span>
                    <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                      {social.description}
                    </p>
                  </div>
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </div>
    </section>
  );
}
