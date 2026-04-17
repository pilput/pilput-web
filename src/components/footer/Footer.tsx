"use client";

import Link from "next/link";
import { BriefcaseBusiness, Mail, PenLine, ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { XIcon } from "@/components/icons/XIcon";
import { motion, type Variants } from "framer-motion";

const navColumns = [
  {
    heading: "Platform",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/explore", label: "Explore" },
      { href: "/register", label: "Start writing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

const socials = [
  { href: "https://github.com/pilput", label: "GitHub", icon: GitHubIcon },
  { href: "https://x.com/pilput_dev", label: "X / Twitter", icon: XIcon },
  {
    href: "https://linkedin.com/in/cecep31",
    label: "LinkedIn",
    icon: BriefcaseBusiness,
  },
  { href: "mailto:cecepjanuardi@proton.me", label: "Email", icon: Mail },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/60 bg-background/80 backdrop-blur-xl overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/6 rounded-full blur-[100px]" />

      <motion.div
        className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand block */}
          <motion.div className="space-y-5" variants={itemVariants}>
            <Link
              href="/"
              className="inline-block text-xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            >
              pilput.net
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A calm, fast publishing home for people who want to write and ship
              without friction.
            </p>

            {/* Write CTA */}
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/8 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/15 hover:border-primary/50 transition-all"
            >
              <PenLine className="h-4 w-4" />
              Start writing
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>

          {/* Nav columns */}
          {navColumns.map((col) => (
            <motion.div key={col.heading} className="space-y-4" variants={itemVariants}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-primary/40"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          className="my-10 h-px w-full bg-linear-to-r from-transparent via-border/70 to-transparent"
          variants={itemVariants}
        />

        {/* Bottom bar */}
        <motion.div
          className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
          variants={itemVariants}
        >
          <p className="text-xs text-muted-foreground/70">
            &copy; {currentYear} pilput.net &mdash; Built for focus, performance &amp; creators.
          </p>

          {/* Socials */}
          <div className="flex items-center gap-2">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("mailto") ? undefined : "_blank"}
                rel={
                  item.href.startsWith("mailto")
                    ? undefined
                    : "noopener noreferrer"
                }
                aria-label={item.label}
                className="group inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/8 transition-all"
              >
                <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
