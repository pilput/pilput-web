"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useHoldingsStore } from "@/stores/holdingsStore";
import HoldingSummaryCards from "@/components/dashboard/holdings/HoldingSummaryCards";
import MonthlyHoldingsChart from "@/components/dashboard/holdings/MonthlyHoldingsChart";
import HoldingComparison from "@/components/dashboard/holdings/HoldingComparison";
import HoldingFilter from "@/components/dashboard/holdings/HoldingFilter";
import UpcomingCorporateActions from "@/components/dashboard/holdings/calendar/UpcomingCorporateActions";
import { useCollapsedSections } from "./hooks/useCollapsedSections";
import { usePortfolioStatistics } from "./hooks/usePortfolioStatistics";
import { CollapsibleSection } from "./components/CollapsibleSection";
import { OverviewHero } from "./components/OverviewHero";
import { AllocationSection } from "./components/AllocationSection";
import { PerformanceSection } from "./components/PerformanceSection";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function HoldingOverviewPage() {
  const { holdings, summary, isLoading, fetchHoldings, fetchHoldingTypes } =
    useHoldingsStore();

  const [filterMonth, setFilterMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [hideValues, setHideValues] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hideHoldingValues") === "true";
    }
    return false;
  });

  const { collapsed, toggleSection } = useCollapsedSections();
  const statistics = usePortfolioStatistics(holdings, summary);

  useEffect(() => {
    fetchHoldings();
    fetchHoldingTypes();
  }, [fetchHoldings, fetchHoldingTypes]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hideHoldingValues", hideValues.toString());
    }
  }, [hideValues]);

  async function handleFilter(monthOverride?: number, yearOverride?: number) {
    const month = monthOverride ?? parseInt(filterMonth, 10);
    const year = yearOverride ?? parseInt(filterYear, 10);
    await fetchHoldings({ month, year });
  }

  const monthLabel = useMemo(() => {
    const m = parseInt(filterMonth, 10);
    if (m >= 1 && m <= 12) return `${MONTH_NAMES[m - 1]} ${filterYear}`;
    return `${filterMonth}/${filterYear}`;
  }, [filterMonth, filterYear]);

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" className="shrink-0 -ml-2" asChild>
              <Link href="/dashboard/holdings" aria-label="Back to holdings">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
                  Portfolio Overview
                </h1>
                <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[10px] sm:text-xs font-medium tracking-wide text-muted-foreground">
                  {monthLabel}
                </span>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 hidden sm:block">
                Analyze your investment performance across all assets.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setHideValues(!hideValues)}
            title={hideValues ? "Show values" : "Hide values"}
            className="shrink-0"
          >
            {hideValues ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="rounded-xl border border-border/70 bg-muted/30 px-3 py-2.5 sm:px-4">
          <HoldingFilter
            month={filterMonth}
            year={filterYear}
            onMonthChange={setFilterMonth}
            onYearChange={setFilterYear}
            onFilter={handleFilter}
          />
        </div>

        {statistics && (
          <OverviewHero statistics={statistics} hideValues={hideValues} />
        )}
      </div>

      {/* ── Section: Summary ────────────────────────────── */}
      <CollapsibleSection id="summary" label="Summary" collapsed={!!collapsed.summary} onToggle={toggleSection}>
        <HoldingSummaryCards
          holdings={holdings}
          summary={summary}
          isLoading={isLoading}
          hideValues={hideValues}
        />
      </CollapsibleSection>

      {/* ── Section: Corporate Actions ──────────────────── */}
      <CollapsibleSection id="actions" label="Corporate Actions" collapsed={!!collapsed.actions} onToggle={toggleSection}>
        <UpcomingCorporateActions />
      </CollapsibleSection>

      {/* ── Section: Allocation ─────────────────────────── */}
      <CollapsibleSection id="allocation" label="Allocation" collapsed={!!collapsed.allocation} onToggle={toggleSection}>
        <AllocationSection
          statistics={statistics}
          holdings={holdings}
          hideValues={hideValues}
        />
      </CollapsibleSection>

      {/* ── Section: Performance ────────────────────────── */}
      {statistics && (
        <CollapsibleSection id="performance" label="Performance" collapsed={!!collapsed.performance} onToggle={toggleSection}>
          <PerformanceSection statistics={statistics} hideValues={hideValues} />
        </CollapsibleSection>
      )}

      {/* ── Section: Trends ─────────────────────────────── */}
      <CollapsibleSection id="trends" label="Trends" collapsed={!!collapsed.trends} onToggle={toggleSection}>
        <div className="space-y-4 md:space-y-5">
          <MonthlyHoldingsChart />
          <div className="glass-card border-glow-hover rounded-2xl p-3 sm:p-4 lg:p-5 transition-all duration-300">
            <HoldingComparison
              isOpen={true}
              targetMonth={parseInt(filterMonth)}
              targetYear={parseInt(filterYear)}
              hideValues={hideValues}
            />
          </div>
        </div>
      </CollapsibleSection>

    </div>
  );
}
