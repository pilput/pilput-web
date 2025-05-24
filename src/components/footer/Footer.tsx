import Link from "next/link";
import React from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 py-6 mt-10 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-base text-slate-700 dark:text-slate-200">About</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/about" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-base text-slate-700 dark:text-slate-200">Get Involved</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://github.com/cecep31"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  Contribute
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/cecep31/pilput.dev/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  Submit Bugs
                </a>
              </li>
              <li>
                <Link href="/support" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  Support Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-base text-slate-700 dark:text-slate-200">Documentation</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/docs/guidelines" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  Guidelines
                </Link>
              </li>
              <li>
                <a
                  href="https://wiki.pilput.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  Wiki
                </a>
              </li>
              <li>
                <Link href="/docs/api" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-base text-slate-700 dark:text-slate-200">Legal</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/legal/license" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  Licensing
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-4 bg-slate-100 dark:bg-slate-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {currentYear} pilput.me. All rights reserved.
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <a
                href="https://github.com/cecep31"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <a
                href="https://twitter.com/pilput_dev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <a
                href="https://linkedin.com/in/pilput"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <a
                href="mailto:cecepjanuardi@proton.me"
                className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
