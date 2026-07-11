"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { format, addDays } from "date-fns";
import { CalendarClock, Coins, Users, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCorporateActionsStore } from "@/stores/corporateActionsStore";
import { cn, formatCurrency } from "@/lib/utils";

const UPCOMING_DAYS = 30;
const MAX_ITEMS = 5;

export default function UpcomingCorporateActions() {
  const { actions, isLoading, fetchCalendar } = useCorporateActionsStore();

  useEffect(() => {
    const from = format(new Date(), "yyyy-MM-dd");
    const to = format(addDays(new Date(), UPCOMING_DAYS), "yyyy-MM-dd");
    fetchCalendar({ from, to });
  }, [fetchCalendar]);

  const upcoming = useMemo(
    () =>
      [...actions].sort((a, b) => a.date.localeCompare(b.date)).slice(0, MAX_ITEMS),
    [actions]
  );

  return (
    <Card className="glass-card border-glow-hover shadow-premium hover:shadow-premium-hover rounded-2xl overflow-hidden transition-all duration-300">
      <CardHeader className="px-4 pb-3 pt-4 sm:px-5 flex-row items-center justify-between gap-2">
        <div className="min-w-0">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
            Upcoming Corporate Actions
          </CardTitle>
          <CardDescription className="text-xs mt-1">
            Dividend &amp; RUPS events in the next {UPCOMING_DAYS} days
          </CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm" className="h-8 px-2.5 text-xs gap-1 shrink-0">
          <Link href="/dashboard/holdings/calendar">
            Full calendar
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-5">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No corporate actions in the next {UPCOMING_DAYS} days.
          </p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((action, idx) => (
              <div
                key={`${action.symbol}-${action.type}-${action.date}-${idx}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      action.type === "dividend"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                    )}
                  >
                    {action.type === "dividend" ? (
                      <Coins className="h-3.5 w-3.5" />
                    ) : (
                      <Users className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">
                      {action.symbol}{" "}
                      <span className="text-muted-foreground font-normal">
                        · {action.name}
                      </span>
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {action.type === "dividend" ? "Ex-date" : "RUPS"} ·{" "}
                      {format(new Date(action.date), "d MMM yyyy")}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {action.type === "dividend" && action.amount != null ? (
                    <span className="text-xs font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(action.amount, action.currency)}
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">Meeting</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
