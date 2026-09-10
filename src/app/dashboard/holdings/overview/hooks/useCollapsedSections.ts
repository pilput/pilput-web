import { useState } from "react";

const STORAGE_KEY = "overview-sections-collapsed";

export type SectionKey = "summary" | "actions" | "allocation" | "performance" | "trends";

const DEFAULT_COLLAPSED: Record<SectionKey, boolean> = {
  summary: false,
  actions: false,
  allocation: false,
  performance: false,
  trends: false,
};

function loadCollapsed(): Record<SectionKey, boolean> {
  if (typeof window === "undefined") return { ...DEFAULT_COLLAPSED };
  try {
    return { ...DEFAULT_COLLAPSED, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") };
  } catch {
    return { ...DEFAULT_COLLAPSED };
  }
}

/** Persisted collapsible-section state (localStorage). */
export function useCollapsedSections() {
  const [collapsed, setCollapsed] =
    useState<Record<SectionKey, boolean>>(loadCollapsed);

  function toggleSection(id: SectionKey) {
    setCollapsed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }

  return { collapsed, toggleSection };
}
