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
  navigationMenuTriggerStyle,
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
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b shadow-sm shadow-black/[0.02] backdrop-blur-xl",
        loggedIn
          ? "border-border/50 bg-background/95 supports-backdrop-filter:bg-background/80"
          : "border-border/70 bg-background/90"
      )}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <nav
          className={cn(
            "flex h-14 md:h-16 items-center w-full gap-3 md:gap-4",
            loggedIn ? "justify-end md:justify-between" : "justify-between"
          )}
          aria-label="Main navigation"
        >
          {!loggedIn && (
            <Link
              href="/"
              className="rounded-md text-xl font-bold tracking-tight text-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shrink-0"
              aria-label="Pilput home"
            >
              pilput
            </Link>
          )}

          {/* Desktop Navigation */}
          <div
            className={cn(
              "hidden md:flex",
              loggedIn ? "flex-1 justify-start min-w-0" : "flex-1 justify-center"
            )}
          >
            <NavigationMenu
              className={cn(loggedIn && "max-w-none flex-1 justify-start")}
            >
              <NavigationMenuList
                className={cn(
                  "flex-wrap",
                  loggedIn && "justify-start gap-0.5 sm:gap-1"
                )}
              >
                {navigation.map((item) => (
                  <NavigationMenuItem key={`${item.href}-${item.name}`}>
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "rounded-md",
                        loggedIn && "h-8 px-3 text-[13px] font-medium",
                        pathname === item.href
                          ? "bg-primary/10 text-primary ring-1 ring-primary/25 shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <DarkModeButton />
            <ButtonLogged />
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={toggleMenu}
            className="md:hidden rounded-md border border-border/70 bg-background/80 p-2 shadow-sm transition-colors hover:bg-accent/70 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shrink-0"
            aria-label={showmenu ? "Close menu" : "Open menu"}
            aria-expanded={showmenu}
          >
            {showmenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {showmenu && (
          <div
            className="md:hidden mt-2 rounded-lg border border-border/70 bg-background/95 backdrop-blur-md shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="py-3 sm:py-4 space-y-1.5 sm:space-y-2">
              {navigation.map((item) => (
                <Link
                  key={`${item.href}-${item.name}`}
                  href={item.href}
                  onClick={() => setshowmenu(false)}
                  className={cn(
                    "block px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                    pathname === item.href
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center justify-between px-3.5 sm:px-4 pt-3 sm:pt-4 pb-1 border-t border-border/60">
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
