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
    <div className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-white/10 dark:bg-zinc-900/10 border-b border-white/10 dark:border-zinc-700/20 supports-[backdrop-filter]:bg-white/5 dark:supports-[backdrop-filter]:bg-zinc-900/5 shadow-lg shadow-black/5">
      <nav className="relative select-none lg:flex lg:items-stretch w-full max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-zinc-800 dark:text-zinc-100 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            PILPUT
          </Link>

          <button
            onClick={toggleMenu}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-white/20 dark:hover:bg-zinc-800/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/20 dark:focus:ring-zinc-600/20 transition-all duration-200 backdrop-blur-sm"
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
              ? "absolute top-16 left-0 right-0 bg-white/15 dark:bg-zinc-900/15 backdrop-blur-2xl border-b border-white/10 dark:border-zinc-700/20 rounded-b-xl lg:border-none shadow-lg shadow-black/10"
              : "hidden lg:flex"
          )}
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 p-4 lg:p-0">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  "hover:bg-white/15 dark:hover:bg-zinc-800/15 hover:text-zinc-700 dark:hover:text-zinc-200 backdrop-blur-sm rounded-lg transition-all duration-200",
                  pathname === item.href
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-zinc-500 dark:text-zinc-400"
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
