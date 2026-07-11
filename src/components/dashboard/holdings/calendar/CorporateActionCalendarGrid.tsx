"use client";

import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import type { CorporateActionItem } from "@/types/corporate-action";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CorporateActionCalendarGridProps {
  /** 1-12 */
  month: number;
  year: number;
  actionsByDate: Record<string, CorporateActionItem[]>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export default function CorporateActionCalendarGrid({
  month,
  year,
  actionsByDate,
  selectedDate,
  onSelectDate,
}: CorporateActionCalendarGridProps) {
  const monthDate = useMemo(() => new Date(year, month - 1, 1), [year, month]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const gridStart = startOfWeek(monthStart);
    const gridEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [monthDate]);

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border/50 bg-muted/30">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="px-1 py-2 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayActions = actionsByDate[dateKey] ?? [];
          const dividendCount = dayActions.filter((a) => a.type === "dividend").length;
          const rupsCount = dayActions.filter((a) => a.type === "rups").length;
          const inMonth = isSameMonth(day, monthDate);
          const selected = selectedDate === dateKey;
          const today = isToday(day);

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(dateKey)}
              aria-pressed={selected}
              aria-label={`${format(day, "EEEE, d MMMM yyyy")}${dayActions.length ? `, ${dayActions.length} corporate action${dayActions.length === 1 ? "" : "s"}` : ""}`}
              className={cn(
                "relative flex min-h-[64px] sm:min-h-[84px] flex-col items-start gap-1 border-b border-r border-border/40 p-1.5 sm:p-2 text-left transition-colors [&:nth-child(7n)]:border-r-0 hover:bg-accent/40",
                !inMonth && "bg-muted/10 text-muted-foreground/40",
                selected && "bg-primary/10 ring-1 ring-inset ring-primary/40 hover:bg-primary/15"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[11px] sm:text-xs font-semibold tabular-nums",
                  today && "bg-primary text-primary-foreground",
                  !today && inMonth && "text-foreground"
                )}
              >
                {format(day, "d")}
              </span>

              {dayActions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {dividendCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {dividendCount}
                    </span>
                  )}
                  {rupsCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-violet-600 dark:text-violet-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                      {rupsCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
