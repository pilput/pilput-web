import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

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
      url: "https://twitter.com/cecep31",
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
      url: "mailto:cecepjanuardi@outlook.com",
      icon: Mail,
      description: "Drop me a message",
    },
  ]

  return (
    <div className="w-full bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">Let's Connect!</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Find me across the web and let's start a conversation
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {socialLinks.map((social) => (
            <Button
              key={social.name}
              variant="outline"
              size="lg"
              className="w-full h-auto py-4 px-6 flex flex-col items-center gap-2 transition-all hover:scale-105 hover:bg-accent"
              asChild
            >
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="space-y-1"
              >
                <div className="flex items-center gap-2">
                  <social.icon className="h-5 w-5" />
                  <span className="font-semibold">{social.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{social.description}</p>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </div>
  )
}