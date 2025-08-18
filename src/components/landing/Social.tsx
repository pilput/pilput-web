import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Social() {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/cecep31",
      icon: Github,
      description: "Check out my open source projects",
    },
    {
      name: "Twitter",
      url: "https://x.com/cecep_januardi",
      icon: Twitter,
      description: "Follow me for tech updates",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/cecep31",
      icon: Linkedin,
      description: "Connect with me professionally",
    },
    {
      name: "Email",
      url: "mailto:cecepjanuardi@proton.me",
      icon: Mail,
      description: "Drop me a message",
    },
  ];

  const getIconColor = (name: string) => {
    switch (name) {
      case 'GitHub':
        return 'text-gray-800 dark:text-gray-200';
      case 'Twitter':
        return 'text-blue-500';
      case 'LinkedIn':
        return 'text-blue-600';
      case 'Email':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getHoverColor = (name: string) => {
    switch (name) {
      case 'GitHub':
        return 'hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600';
      case 'Twitter':
        return 'hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700';
      case 'LinkedIn':
        return 'hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700';
      case 'Email':
        return 'hover:bg-green-50 dark:hover:bg-green-950/30 hover:border-green-300 dark:hover:border-green-700';
      default:
        return 'hover:bg-accent';
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-sm supports-[backdrop-filter]:bg-background/40 border-t border-border/50">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Let&apos;s Connect!
        </CardTitle>
        <CardDescription className="text-xl text-muted-foreground mt-2 max-w-md mx-auto">
          Find me across the web and let&apos;s start a conversation
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {socialLinks.map((social, index) => (
            <Button
              key={social.name}
              variant="outline"
              size="lg"
              className={`group w-full h-auto py-6 px-8 flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-2 ${getHoverColor(social.name)} animate-in fade-in slide-in-from-bottom-4`}
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
                  <social.icon className={`h-6 w-6 transition-colors duration-300 ${getIconColor(social.name)} group-hover:scale-110`} />
                  <span className="font-bold text-lg">{social.name}</span>
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
