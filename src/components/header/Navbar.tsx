"use client";
import Link from "next/link";
import React, { useState } from "react";
import ButtonLogged from "./ButtonLogged";
import { usePathname } from "next/navigation";
import DarkModeButton from "./Darkmode";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Chat", href: "/chat" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [showmenu, setshowmenu] = useState(false);

  function toggleMenu() {
    setshowmenu((prev) => !prev);
  }

  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200/80 dark:border-zinc-700/80 supports-[backdrop-filter]:bg-white/50">
      <nav className="relative select-none lg:flex lg:items-stretch w-full max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-purple-500/80 to-blue-400/80 bg-clip-text text-transparent hover:from-purple-400 hover:to-blue-300 transition-colors"
          >
            PILPUT
          </Link>

          <button
            onClick={toggleMenu}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-300 transition-colors"
          >
            <span className="sr-only">Open main menu</span>
            {showmenu ? (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        <div
          className={cn(
            "lg:flex lg:items-center lg:flex-1 lg:justify-end",
            showmenu
              ? "absolute top-16 left-0 right-0 bg-white/95 dark:bg-zinc-900/95 border-b border-zinc-200/80 dark:border-zinc-700/80 rounded-b-xl lg:border-none"
              : "hidden lg:flex"
          )}
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 p-4 lg:p-0">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  "hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 hover:text-purple-500 dark:hover:text-purple-300",
                  pathname === item.href
                    ? "text-purple-500 dark:text-purple-300 bg-purple-50/80 dark:bg-purple-900/40 border border-purple-200/50 dark:border-purple-700/50"
                    : "text-zinc-600 dark:text-zinc-300"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4 lg:ml-4">
              <ButtonLogged />
              <DarkModeButton />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
