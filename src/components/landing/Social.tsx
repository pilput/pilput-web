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
    <div className="w-full border-t border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/40 py-20 backdrop-blur-sm supports-[backdrop-filter]:bg-background/40">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Let&apos;s Connect!
        </CardTitle>
        <CardDescription className="text-xl text-muted-foreground mt-2 max-w-md mx-auto">
          Find me across the web and let&apos;s start a conversation
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {socialLinks.map((social, index) => (
            <Button
              key={social.name}
              size="lg"
              className={cn(
                "group w-full h-auto py-6 px-8 flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-in fade-in slide-in-from-bottom-4",
                "bg-background/30 border border-white/10 backdrop-blur-sm rounded-xl",
                social.hoverColor,
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              asChild
            >
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="space-y-2 text-center w-full"
              >
                <div className="flex items-center justify-center gap-3">
                  <social.icon
                    className={cn(
                      "h-8 w-8 transition-colors duration-300 group-hover:scale-110",
                      social.color,
                    )}
                  />
                  <span className="font-bold text-lg text-foreground">{social.name}</span>
                </div>
                <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
                  {social.description}
                </p>
              </a>
            </Button>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground/70">
            Always open to new opportunities and collaborations
          </p>
        </div>
      </CardContent>
    </div>
  );
}
