"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PanelLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "guilds:sidebar-collapsed";

interface GuildsShellState {
  /** Desktop: the sidebar panel is shown. */
  desktopOpen: boolean;
  /** Mobile: the drawer is shown. */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  /** Toggles whichever of the two applies to the current viewport. */
  toggle: () => void;
}

const GuildsShellContext = createContext<GuildsShellState | null>(null);

export function useGuildsShell() {
  const ctx = useContext(GuildsShellContext);
  if (!ctx) throw new Error("useGuildsShell must be used inside GuildsShellProvider");
  return ctx;
}

export function GuildsShellProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Restore the desktop preference after hydration (storage is client-only).
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDesktopOpen(false);
      }
    } catch {
      // Storage blocked: keep the default.
    }
  }, []);

  const toggle = useCallback(() => {
    if (isMobile) {
      setMobileOpen((open) => !open);
      return;
    }
    setDesktopOpen((open) => {
      try {
        localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
      } catch {
        // Not persisted; the toggle still works for this visit.
      }
      return !open;
    });
  }, [isMobile]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  const value = useMemo(
    () => ({ desktopOpen, mobileOpen, setMobileOpen, toggle }),
    [desktopOpen, mobileOpen, toggle],
  );

  return <GuildsShellContext.Provider value={value}>{children}</GuildsShellContext.Provider>;
}

export function SidebarToggle({ className }: { className?: string }) {
  const { toggle, desktopOpen } = useGuildsShell();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle sidebar"
      title="Toggle sidebar (Ctrl+B)"
      className={cn(
        "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <PanelLeft
        className={cn("size-4 transition-transform duration-300", !desktopOpen && "md:rotate-180")}
      />
    </button>
  );
}
