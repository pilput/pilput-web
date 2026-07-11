"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format, addMonths } from "date-fns";
import { CalendarClock, Coins, Users, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import { cn, formatCurrency } from "@/lib/utils";
import type {
  CorporateActionCalendarResponse,
  CorporateActionItem,
} from "@/types/corporate-action";

const MAX_ITEMS = 5;

async function fetchMonth(month: number, year: number): Promise<CorporateActionItem[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    data: CorporateActionCalendarResponse;
  }>("/api/holdings/calendar", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { month, year },
  });
  return data?.data?.actions ?? [];
}

export default function UpcomingCorporateActions() {
  const [actions, setActions] = useState<CorporateActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const now = new Date();
        const next = addMonths(now, 1);
        const [thisMonth, nextMonth] = await Promise.all([
          fetchMonth(now.getMonth() + 1, now.getFullYear()),
          fetchMonth(next.getMonth() + 1, next.getFullYear()),
        ]);
        if (cancelled) return;

        const today = format(now, "yyyy-MM-dd");
        setActions([...thisMonth, ...nextMonth].filter((a) => a.date >= today));
      } catch {
        if (!cancelled) setActions([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

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
            Dividend &amp; RUPS events coming up
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
            No upcoming corporate actions in the next two months.
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
