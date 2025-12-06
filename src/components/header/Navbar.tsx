"use client";
import Link from "next/link";
import React, { useState } from "react";
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

  // Close mobile menu when pathname changes (navigation occurs)
  React.useEffect(() => {
    setshowmenu(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between" aria-label="Main navigation">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:from-primary/90 hover:to-primary/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
            aria-label="Pilput home"
          >
            pilput
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        pathname === item.href
                          ? "bg-primary/10 text-primary border border-primary/30 shadow-sm"
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
          <div className="hidden md:flex items-center space-x-3">
            <DarkModeButton />
            <ButtonLogged />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg border border-border/70 bg-background/70 hover:bg-accent/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={showmenu ? "Close menu" : "Open menu"}
            aria-expanded={showmenu}
          >
            {showmenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {showmenu && (
          <div 
            className="md:hidden mt-2 rounded-2xl border border-border/70 bg-background/95 backdrop-blur-md shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setshowmenu(false)}
                  className={cn(
                    "block px-4 py-3 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                    pathname === item.href
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center justify-between px-4 pt-4 border-t border-border/60">
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
