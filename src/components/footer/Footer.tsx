import Link from "next/link";
import React from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand and description */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              pilput.me
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              Building digital experiences with modern web technologies.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-6 text-sm">
            <Link
              href="/about"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/legal/privacy"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Privacy
            </Link>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/cecep31"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/pilput_dev"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/pilput"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:cecepjanuardi@proton.me"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
            © {currentYear} pilput.me. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
