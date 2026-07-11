"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, CalendarRange, Coins, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarMonthNav from "@/components/dashboard/holdings/calendar/CalendarMonthNav";
import CorporateActionCalendarGrid from "@/components/dashboard/holdings/calendar/CorporateActionCalendarGrid";
import CorporateActionDayPanel from "@/components/dashboard/holdings/calendar/CorporateActionDayPanel";
import { useCorporateActionsStore } from "@/stores/corporateActionsStore";
import { cn } from "@/lib/utils";
import type { CorporateActionItem, CorporateActionType } from "@/types/corporate-action";

type TypeFilter = "all" | CorporateActionType;

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CorporateActionsCalendarPage() {
  const { actions, isLoading, cached, fetchCalendar } = useCorporateActionsStore();

  const now = useMemo(() => new Date(), []);
  const [appliedMonth, setAppliedMonth] = useState(now.getMonth() + 1);
  const [appliedYear, setAppliedYear] = useState(now.getFullYear());
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(
    format(now, "yyyy-MM-dd")
  );

  useEffect(() => {
    fetchCalendar({ month: appliedMonth, year: appliedYear });
  }, [appliedMonth, appliedYear, fetchCalendar]);

  function applyPeriod(m: number, y: number) {
    setAppliedMonth(m);
    setAppliedYear(y);

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === y && today.getMonth() + 1 === m;
    setSelectedDate(
      isCurrentMonth ? format(today, "yyyy-MM-dd") : format(new Date(y, m - 1, 1), "yyyy-MM-dd")
    );
  }

  function handlePrevMonth() {
    const m = appliedMonth === 1 ? 12 : appliedMonth - 1;
    const y = appliedMonth === 1 ? appliedYear - 1 : appliedYear;
    applyPeriod(m, y);
  }

  function handleNextMonth() {
    const m = appliedMonth === 12 ? 1 : appliedMonth + 1;
    const y = appliedMonth === 12 ? appliedYear + 1 : appliedYear;
    applyPeriod(m, y);
  }

  function handleToday() {
    applyPeriod(now.getMonth() + 1, now.getFullYear());
  }

  const isCurrentMonth =
    appliedMonth === now.getMonth() + 1 && appliedYear === now.getFullYear();

  const filteredActions = useMemo<CorporateActionItem[]>(
    () => (typeFilter === "all" ? actions : actions.filter((a) => a.type === typeFilter)),
    [actions, typeFilter]
  );

  const actionsByDate = useMemo(() => {
    const map: Record<string, CorporateActionItem[]> = {};
    for (const action of filteredActions) {
      (map[action.date] ??= []).push(action);
    }
    return map;
  }, [filteredActions]);

  const selectedActions = selectedDate ? actionsByDate[selectedDate] ?? [] : [];

  const stats = useMemo(() => {
    const dividendCount = filteredActions.filter((a) => a.type === "dividend").length;
    const rupsCount = filteredActions.filter((a) => a.type === "rups").length;
    return { dividendCount, rupsCount };
  }, [filteredActions]);

  const monthLabel =
    appliedMonth >= 1 && appliedMonth <= 12
      ? `${MONTH_LABELS[appliedMonth - 1]} ${appliedYear}`
      : `${appliedMonth}/${appliedYear}`;

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" className="shrink-0 -ml-2" asChild>
              <Link href="/dashboard/holdings/overview" aria-label="Back to overview">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
                Corporate Actions Calendar
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 hidden sm:block">
                Dividend ex-dates and RUPS meetings for stocks on the IDX exchange.
              </p>
            </div>
          </div>
        </div>

        {/* Month nav */}
        <CalendarMonthNav
          label={monthLabel}
          isCurrentMonth={isCurrentMonth}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
          onToday={handleToday}
        />

        {/* Type filter + stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="dividend">Dividends</TabsTrigger>
              <TabsTrigger value="rups">RUPS</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium">
              <Coins className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              {stats.dividendCount} dividend{stats.dividendCount === 1 ? "" : "s"}
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium">
              <Users className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
              {stats.rupsCount} RUPS
            </div>
            {cached && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <CalendarRange className="h-3.5 w-3.5" />
                Cached
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar + day panel */}
      <div className="grid gap-4 md:gap-5 lg:grid-cols-3">
        <div
          className={cn(
            "lg:col-span-2 min-w-0 transition-opacity",
            isLoading && "opacity-60 pointer-events-none"
          )}
        >
          <CorporateActionCalendarGrid
            month={appliedMonth}
            year={appliedYear}
            actionsByDate={actionsByDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
        <CorporateActionDayPanel date={selectedDate} actions={selectedActions} />
      </div>
    </div>
  );
}
