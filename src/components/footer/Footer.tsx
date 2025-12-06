import Link from "next/link";
import React from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12 space-y-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 max-w-xl">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            >
              pilput.me
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A calm, fast publishing home for people who want to write and ship without friction.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {[
              { href: "/about", label: "About" },
              { href: "/blog", label: "Blog" },
              { href: "/contact", label: "Contact" },
              { href: "/privacy", label: "Privacy" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-border/60 px-4 py-2 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {[
              { href: "https://github.com/pilput", label: "GitHub", icon: Github },
              { href: "https://twitter.com/pilput_dev", label: "Twitter", icon: Twitter },
              { href: "https://linkedin.com/in/cecep31", label: "LinkedIn", icon: Linkedin },
              { href: "mailto:cecepjanuardi@proton.me", label: "Email", icon: Mail },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("mailto") ? undefined : "_blank"}
                rel={item.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-card/70 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                aria-label={item.label}
              >
                <item.icon className="h-5 w-5 group-hover:scale-105 transition-transform" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border/60 pt-6 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <p className="order-2 lg:order-1">(c) {currentYear} pilput.me. All rights reserved.</p>
          <p className="order-1 lg:order-2 text-xs uppercase tracking-[0.08em] text-muted-foreground/80">
            Built for focus, performance, and creators.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
