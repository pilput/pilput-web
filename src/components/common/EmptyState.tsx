import * as React from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
}

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actions?: EmptyStateAction[];
  className?: string;
  compact?: boolean;
}

/**
 * Shared empty-state pattern for all dashboard pages:
 * illustration (icon in soft circle) + title + description + clear CTAs.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actions = [],
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2.5 py-8" : "gap-3 py-12",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-muted/60 ring-1 ring-border/50",
          compact ? "h-11 w-11" : "h-14 w-14"
        )}
        aria-hidden="true"
      >
        <Icon
          className={cn(
            "text-muted-foreground",
            compact ? "h-5 w-5" : "h-6 w-6"
          )}
        />
      </div>
      <div className="max-w-sm space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description ? (
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {description}
          </p>
        ) : null}
      </div>
      {actions.length > 0 ? (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {actions.map((action) =>
            action.href ? (
              <Button
                key={action.label}
                variant={action.variant ?? "default"}
                size="sm"
                asChild
              >
                <a href={action.href}>{action.label}</a>
              </Button>
            ) : (
              <Button
                key={action.label}
                variant={action.variant ?? "default"}
                size="sm"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}
