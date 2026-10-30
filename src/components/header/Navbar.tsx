"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ButtonLogged from "./ButtonLogged";
import { usePathname } from "next/navigation";
import DarkModeButton from "./Darkmode";
import { cn } from "cn";
import { Menu, X } from "lucide-react";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { getMainNavItems, isNavItemActive } from "./nav-items";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const Navbar = () => {
  const pathname = usePathname();
  // Tracking the route the menu was opened on closes it on any navigation —
  // including browser back — without an effect that fights the compiler.
  const [menu, setMenu] = useState({ open: false, path: pathname });
  const showmenu = menu.open && menu.path === pathname;
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn } = useIsLoggedIn();
  const reduceMotion = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const navigation = useMemo(() => getMainNavItems(isLoggedIn), [isLoggedIn]);

  // Swap the bar to its glass surface only once content sits behind it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(
    () => setMenu({ open: false, path: pathname }),
    [pathname]
  );

  useEffect(() => {
    if (!showmenu) return;

    const header = headerRef.current;
    const focusables = () =>
      Array.from(
        header?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => el.offsetParent !== null);

    // Move focus into the panel so keyboard and screen-reader users land in the menu.
    header?.querySelector<HTMLElement>("#mobile-navigation a[href]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        toggleRef.current?.focus();
        return;
      }
      // Keep Tab inside the header while the page behind is covered.
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    // Hiding the scrollbar reclaims its width — pad it back so nothing shifts.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showmenu, closeMenu]);

  function toggleMenu() {
    setMenu({ open: !showmenu, path: pathname });
  }

  return (
    <header
        ref={headerRef}
        data-scrolled={scrolled || showmenu}
        className="nav-surface sticky top-0 z-50 w-full"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            className="flex h-16 w-full items-center justify-between gap-4"
            aria-label="Main navigation"
          >
            {/* Logo Branding - Always visible for consistency */}
            <Link
              href="/"
              className="group shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Pilput home"
            >
              <span className="flex items-baseline text-xl font-black tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
                pilput
                <span aria-hidden="true" className="ml-0.5 h-1.5 w-1.5 translate-y-0 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="relative mx-auto hidden items-center gap-1 rounded-full border border-border/50 bg-muted/60 p-1 md:flex">
              {navigation.map((item) => {
                const active = isNavItemActive(pathname, item.href);
                return (
                  <li key={`${item.href}-${item.name}`} className="relative">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block rounded-full px-4 py-1.5 text-sm font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-background shadow-sm ring-1 ring-border/60"
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 420, damping: 34 }
                          }
                        />
                      )}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right Side Actions - Desktop */}
            <div className="hidden shrink-0 items-center gap-2 md:flex">
              <DarkModeButton />
              <ButtonLogged />
            </div>

            {/* Mobile menu toggle button */}
            <button
              ref={toggleRef}
              type="button"
              onClick={toggleMenu}
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border/60 bg-background/80 outline-none transition-colors hover:bg-muted/65 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
              aria-label={showmenu ? "Close menu" : "Open menu"}
              aria-expanded={showmenu}
              aria-controls="mobile-navigation"
            >
              {showmenu ? (
                <X className="h-5 w-5 text-foreground" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" aria-hidden="true" />
              )}
            </button>
          </nav>
        </div>

        {/* Mobile Expandable Navigation Menu */}
        <AnimatePresence>
          {showmenu && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => closeMenu()}
                className="fixed inset-x-0 bottom-0 top-16 -z-10 bg-background/80 md:hidden"
                aria-hidden="true"
              />
              <motion.div
                key="panel"
                id="mobile-navigation"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                role="dialog"
                aria-modal="true"
                aria-label="Main menu"
                className="absolute inset-x-0 top-full origin-top border-b border-border/60 bg-background px-4 pb-4 pt-2 shadow-lg sm:px-6 md:hidden"
              >
                <ul className="space-y-1">
                  {navigation.map((item) => {
                    const active = isNavItemActive(pathname, item.href);
                    return (
                      <li key={`${item.href}-${item.name}`}>
                        <Link
                          href={item.href}
                          onClick={() => closeMenu()}
                          className={cn(
                            "flex min-h-11 items-center rounded-xl px-4 py-3 text-base font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring",
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/60 px-1 pt-3">
                  <DarkModeButton />
                  <ButtonLogged />
                </div>
              </motion.div>
            </>
          )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
