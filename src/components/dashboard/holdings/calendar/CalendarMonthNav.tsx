"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarMonthNavProps {
  label: string;
  isCurrentMonth: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function CalendarMonthNav({
  label,
  isCurrentMonth,
  onPrev,
  onNext,
  onToday,
}: CalendarMonthNavProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onPrev}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="min-w-[9ch] text-center text-base sm:text-lg font-semibold tracking-tight tabular-nums">
          {label}
        </h2>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onNext}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("h-8 px-3 text-xs font-medium", isCurrentMonth && "text-muted-foreground")}
        onClick={onToday}
        disabled={isCurrentMonth}
      >
        Today
      </Button>
    </div>
  );
}
