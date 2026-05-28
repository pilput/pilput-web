"use client";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import ButtonLogged from "./ButtonLogged";
import { usePathname } from "next/navigation";
import DarkModeButton from "./Darkmode";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { getCookie } from "cookies-next";
import { getMainNavItems } from "./nav-items";

const Navbar = () => {
  const pathname = usePathname();
  const [showmenu, setshowmenu] = useState(false);
  const loggedIn = Boolean(getCookie("token"));

  const navigation = useMemo(() => getMainNavItems(loggedIn), [loggedIn]);

  function toggleMenu() {
    setshowmenu((prev) => !prev);
  }

  return (
    <header className="sticky top-0 z-50 w-full glass-navbar transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className="flex h-16 items-center justify-between w-full gap-4 transition-all duration-300"
          aria-label="Main navigation"
        >
          {/* Logo Branding - Always visible for consistency */}
          <Link
            href="/"
            className="rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shrink-0 group transition-all"
            aria-label="Pilput home"
          >
            <span className="text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
              pilput<span className="text-primary font-black animate-pulse-slow">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center max-w-lg mx-auto">
            <NavigationMenu className="w-full">
              <NavigationMenuList className="flex gap-1.5">
                {navigation.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <NavigationMenuItem key={`${item.href}-${item.name}`}>
                      <Link
                        href={item.href}
                        className={cn(
                          "px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer border border-transparent",
                          active
                            ? "bg-primary/8 text-primary ring-1 ring-primary/10 shadow-xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                      >
                        {item.name}
                      </Link>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side Actions - Desktop */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <DarkModeButton />
            <ButtonLogged />
          </div>

          {/* Mobile menu toggle button */}
          <button
            type="button"
            onClick={toggleMenu}
            className="md:hidden rounded-xl border border-border/50 bg-background/80 p-2 shadow-xs transition-colors hover:bg-muted/65 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shrink-0 cursor-pointer"
            aria-label={showmenu ? "Close menu" : "Open menu"}
            aria-expanded={showmenu}
          >
            {showmenu ? <X className="h-4.5 w-4.5 text-foreground" /> : <Menu className="h-4.5 w-4.5 text-foreground" />}
          </button>
        </nav>

        {/* Mobile Expandable Navigation Menu */}
        {showmenu && (
          <div
            className="md:hidden border-t border-border/45 bg-background/95 backdrop-blur-xl py-3 px-2 space-y-1"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="py-2.5 space-y-1">
              {navigation.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={`${item.href}-${item.name}`}
                    href={item.href}
                    onClick={() => setshowmenu(false)}
                    className={cn(
                      "block mx-2 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all",
                      active
                        ? "bg-primary/10 text-primary border-l-2 border-primary pl-4.5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="flex items-center justify-between mx-2 px-3 pt-3.5 pb-1.5 border-t border-border/50">
                <DarkModeButton />
                <ButtonLogged />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
