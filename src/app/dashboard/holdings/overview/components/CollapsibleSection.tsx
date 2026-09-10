import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SectionKey } from "../hooks/useCollapsedSections";

interface CollapsibleSectionProps {
  id: SectionKey;
  label: string;
  collapsed: boolean;
  onToggle: (id: SectionKey) => void;
  children: React.ReactNode;
}

export function CollapsibleSection({
  id,
  label,
  collapsed,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <section>
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-center gap-3 mb-3 sm:mb-4 group"
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
          {label}
        </span>
        <div className="flex-1 h-px bg-border/50" />
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-all duration-200 shrink-0",
            collapsed && "-rotate-90"
          )}
        />
      </button>
      {!collapsed && children}
    </section>
  );
}
