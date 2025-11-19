import Link from "next/link";
import React from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        {/* Main content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand and description */}
          <div className="flex-1">
            <Link href="/" className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2 inline-block">
              pilput.me
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Building digital experiences with modern web technologies.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-6 text-sm">
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/pilput"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/pilput_dev"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/cecep31"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:cecepjanuardi@proton.me"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            © {currentYear} pilput.me. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
