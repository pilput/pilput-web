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
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-3">
        <nav
          className="flex h-14 items-center justify-between w-full gap-4 px-5 sm:px-6 rounded-2xl border border-border/45 bg-background/70 backdrop-blur-md shadow-premium hover:border-primary/20 transition-all duration-300"
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
            className="md:hidden mt-2 rounded-2xl border border-border/50 bg-background/90 backdrop-blur-xl shadow-premium p-1.5"
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
