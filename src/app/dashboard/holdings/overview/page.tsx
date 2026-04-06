"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Wallet,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Award,
  BarChart3,
  Coins,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Layers,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useHoldingsStore } from "@/stores/holdingsStore";
import HoldingSummaryCards from "@/components/dashboard/holdings/HoldingSummaryCards";
import OverviewChart from "@/components/dashboard/holdings/OverviewChart";
import MonthlyHoldingsChart from "@/components/dashboard/holdings/MonthlyHoldingsChart";
import HoldingComparison from "@/components/dashboard/holdings/HoldingComparison";
import HoldingFilter from "@/components/dashboard/holdings/HoldingFilter";
import { cn, formatCurrency } from "@/lib/utils";

function holdingsChartColorVar(index: number) {
  return `var(--chart-${(index % 5) + 1})`;
}

const STORAGE_KEY = "overview-sections-collapsed";

type SectionKey = "summary" | "allocation" | "performance" | "trends";

function loadCollapsed(): Record<SectionKey, boolean> {
  if (typeof window === "undefined")
    return { summary: false, allocation: false, performance: false, trends: false };
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return { summary: false, allocation: false, performance: false, trends: false };
  }
}

function CollapsibleSection({
  id,
  label,
  collapsed,
  onToggle,
  children,
}: {
  id: SectionKey;
  label: string;
  collapsed: boolean;
  onToggle: (id: SectionKey) => void;
  children: React.ReactNode;
}) {
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

function AllocationBreakdown({
  platformDistribution,
}: {
  platformDistribution: { platform: string; value: number; percent: number }[];
}) {
  const items = platformDistribution.map((d) => ({ label: d.platform, percent: d.percent }));

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="px-4 pb-3 pt-4 sm:px-5">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          Platform Allocation
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-5">
        <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: holdingsChartColorVar(index) }}
                />
                <span className="truncate font-medium">{item.label}</span>
              </div>
              <span className="font-bold ml-2 shrink-0 tabular-nums">
                {item.percent.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.percent}%`,
                  backgroundColor: holdingsChartColorVar(index),
                }}
              />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No data</p>
        )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function HoldingOverviewPage() {
  const { holdings, isLoading, fetchHoldings, fetchHoldingTypes } =
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

  const [collapsed, setCollapsed] = useState<Record<SectionKey, boolean>>(loadCollapsed);

  function toggleSection(id: SectionKey) {
    setCollapsed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }

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

  const statistics = useMemo(() => {
    if (!holdings || holdings.length === 0) return null;

    const totalInvested = holdings.reduce(
      (sum, h) => sum + parseFloat(h.invested_amount),
      0
    );
    const totalCurrent = holdings.reduce(
      (sum, h) => sum + parseFloat(h.current_value),
      0
    );
    const hasGainAmounts = holdings.every(
      (h) => h.gain_amount != null && h.gain_amount !== ""
    );
    const totalReturn = hasGainAmounts
      ? holdings.reduce((sum, h) => sum + parseFloat(h.gain_amount ?? "0"), 0)
      : totalCurrent - totalInvested;
    const totalReturnPercent =
      totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    const currencyBreakdown = holdings.reduce((acc, h) => {
      const currency = h.currency || "Unknown";
      const invested = parseFloat(h.invested_amount);
      const current = parseFloat(h.current_value);
      const returnAmount =
        h.gain_amount != null && h.gain_amount !== ""
          ? parseFloat(h.gain_amount)
          : current - invested;
      if (!acc[currency])
        acc[currency] = { invested: 0, current: 0, returnAmount: 0, count: 0 };
      acc[currency].invested += invested;
      acc[currency].current += current;
      acc[currency].returnAmount += returnAmount;
      acc[currency].count += 1;
      return acc;
    }, {} as Record<string, { invested: number; current: number; returnAmount: number; count: number }>);

    const assetTypePerformance = holdings.reduce((acc, h) => {
      const typeName = h.holding_type?.name || "Unknown";
      const invested = parseFloat(h.invested_amount);
      const current = parseFloat(h.current_value);
      const returnAmount =
        h.gain_amount != null && h.gain_amount !== ""
          ? parseFloat(h.gain_amount)
          : current - invested;
      if (!acc[typeName])
        acc[typeName] = {
          invested: 0,
          current: 0,
          returnAmount: 0,
          count: 0,
          avgReturnPercent: 0,
        };
      acc[typeName].invested += invested;
      acc[typeName].current += current;
      acc[typeName].returnAmount += returnAmount;
      acc[typeName].count += 1;
      acc[typeName].avgReturnPercent =
        acc[typeName].invested > 0
          ? (acc[typeName].returnAmount / acc[typeName].invested) * 100
          : 0;
      return acc;
    }, {} as Record<string, { invested: number; current: number; returnAmount: number; count: number; avgReturnPercent: number }>);

    const holdingsWithReturn = holdings
      .map((h) => {
        const invested = parseFloat(h.invested_amount);
        const current = parseFloat(h.current_value);
        const returnAmount =
          h.gain_amount != null && h.gain_amount !== ""
            ? parseFloat(h.gain_amount)
            : current - invested;
        const returnPercent =
          h.gain_percent != null && h.gain_percent !== ""
            ? parseFloat(h.gain_percent)
            : invested > 0
              ? (returnAmount / invested) * 100
              : 0;
        return { ...h, returnAmount, returnPercent };
      })
      .sort((a, b) => b.returnPercent - a.returnPercent);

    const topPerformers = holdingsWithReturn.slice(0, 5);
    const worstPerformers = holdingsWithReturn.slice(-3).reverse();

    const platformStats = holdings.reduce((acc, h) => {
      const platform = h.platform || "Unknown";
      const current = parseFloat(h.current_value);
      if (!acc[platform]) acc[platform] = { value: 0, count: 0 };
      acc[platform].value += current;
      acc[platform].count += 1;
      return acc;
    }, {} as Record<string, { value: number; count: number }>);

    const topPlatform = Object.entries(platformStats).sort(
      (a, b) => b[1].value - a[1].value
    )[0];

    const assetTypeEntries = Object.entries(assetTypePerformance)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.avgReturnPercent - a.avgReturnPercent);

    const mostCommonCurrency =
      Object.keys(currencyBreakdown).length > 0
        ? Object.entries(currencyBreakdown).sort(
            (a, b) => b[1].count - a[1].count
          )[0][0]
        : "IDR";

    const platformDistribution = Object.entries(
      holdings.reduce((acc, h) => {
        const platform = h.platform || "Unknown";
        const value = parseFloat(h.current_value);
        if (!acc[platform]) acc[platform] = 0;
        acc[platform] += value;
        return acc;
      }, {} as Record<string, number>)
    )
      .map(([platform, value]) => ({
        platform,
        value,
        percent: totalCurrent > 0 ? (value / totalCurrent) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    const assetTypeDistribution = Object.entries(
      holdings.reduce((acc, h) => {
        const typeName = h.holding_type?.name || "Unknown";
        const value = parseFloat(h.current_value);
        if (!acc[typeName]) acc[typeName] = 0;
        acc[typeName] += value;
        return acc;
      }, {} as Record<string, number>)
    )
      .map(([typeName, value]) => ({
        typeName,
        value,
        percent: totalCurrent > 0 ? (value / totalCurrent) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    return {
      totalInvested,
      totalCurrent,
      totalReturn,
      totalReturnPercent,
      currencyBreakdown,
      currencyCount: Object.keys(currencyBreakdown).length,
      assetTypePerformance,
      topPerformers,
      worstPerformers,
      topPlatform,
      bestAssetType: assetTypeEntries[0],
      worstAssetType: assetTypeEntries[assetTypeEntries.length - 1],
      primaryCurrency: mostCommonCurrency,
      totalAssets: holdings.length,
      totalPlatforms: new Set(holdings.map((h) => h.platform)).size,
      totalAssetTypes: new Set(holdings.map((h) => h.holding_type?.name)).size,
      platformDistribution,
      assetTypeDistribution,
    };
  }, [holdings]);

  const mask = () => "••••••";

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
              <Link href="/dashboard/holdings">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
                Portfolio Overview
              </h1>
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

        {/* Filter bar */}
        <div className="rounded-xl border border-border/70 bg-muted/30 px-3 py-2.5 sm:px-4">
          <HoldingFilter
            month={filterMonth}
            year={filterYear}
            onMonthChange={setFilterMonth}
            onYearChange={setFilterYear}
            onFilter={handleFilter}
          />
        </div>

        {/* Quick-stat chips */}
        {statistics && (
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Wallet, label: `${statistics.totalAssets} assets`, color: "text-chart-1" },
              { icon: Building2, label: `${statistics.totalPlatforms} platforms`, color: "text-chart-2" },
              { icon: Layers, label: `${statistics.totalAssetTypes} types`, color: "text-chart-3" },
              ...(statistics.topPlatform
                ? [{ icon: Award, label: `Top: ${statistics.topPlatform[0]}`, color: "text-chart-4" }]
                : []),
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium"
              >
                <Icon className={cn("h-3.5 w-3.5", color)} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Section: Summary ────────────────────────────── */}
      <CollapsibleSection id="summary" label="Summary" collapsed={!!collapsed.summary} onToggle={toggleSection}>
        <HoldingSummaryCards
          holdings={holdings}
          isLoading={isLoading}
          hideValues={hideValues}
        />
      </CollapsibleSection>

      {/* ── Section: Allocation ─────────────────────────── */}
      <CollapsibleSection id="allocation" label="Allocation" collapsed={!!collapsed.allocation} onToggle={toggleSection}>
        {statistics?.currencyCount && statistics.currencyCount > 1 ? (
          <Card className="border-border/60 bg-card">
            <CardHeader className="px-4 pb-3 pt-4 sm:px-5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Info className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                Allocation unavailable across mixed currencies
              </CardTitle>
              <CardDescription className="text-xs">
                This portfolio contains multiple currencies, so allocation by value would be misleading without a shared base currency.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-5">
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use the currency breakdown below for now, or add converted base values before showing portfolio-wide allocation again.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:gap-5 lg:grid-cols-3">
            {/* Main chart — takes 2/3 on large screens */}
            <div className="lg:col-span-2 min-w-0">
              <OverviewChart
                holdings={holdings}
                currency={statistics?.primaryCurrency ?? "IDR"}
                hideValues={hideValues}
              />
            </div>

            {/* Distribution bars — right column */}
            <AllocationBreakdown
              platformDistribution={statistics?.platformDistribution ?? []}
            />
          </div>
        )}

        {/* Currency breakdown (only shown when multiple currencies) */}
        {statistics && Object.keys(statistics.currencyBreakdown).length > 1 && (
          <Card className="mt-4 border-border/60 bg-card md:mt-5">
            <CardHeader className="px-4 pb-3 pt-4 sm:px-5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                Currency Breakdown
              </CardTitle>
              <CardDescription className="text-xs">
                Grouped by holding currency. Values are shown per currency and not summed across currencies.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(statistics.currencyBreakdown)
                  .sort((a, b) => b[1].current - a[1].current)
                  .map(([currency, data]) => {
                    const assetShare =
                      statistics.totalAssets > 0
                        ? (data.count / statistics.totalAssets) * 100
                        : 0;
                    const retPct =
                      data.invested > 0
                        ? (data.returnAmount / data.invested) * 100
                        : 0;
                    return (
                      <div
                        key={currency}
                        className="rounded-lg border border-border/50 bg-muted/20 p-3 hover:bg-accent/30 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold">{currency}</span>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {assetShare.toFixed(1)}% of assets
                          </span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Value</span>
                            <span className="font-medium tabular-nums">
                              {hideValues ? mask() : formatCurrency(data.current, currency)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-border/40">
                            <span className="text-muted-foreground">Return</span>
                            <span
                              className={cn(
                                "font-semibold tabular-nums",
                                retPct >= 0
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-destructive"
                              )}
                            >
                              {hideValues
                                ? mask()
                                : `${retPct >= 0 ? "+" : ""}${retPct.toFixed(1)}%`}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground pt-0.5">
                            {data.count} asset{data.count !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </CollapsibleSection>

      {/* ── Section: Performance ────────────────────────── */}
      {statistics && (
        <CollapsibleSection id="performance" label="Performance" collapsed={!!collapsed.performance} onToggle={toggleSection}>
          <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* Top Performers */}
            <Card className="border-border/60">
              <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Top Performers
                </CardTitle>
                <CardDescription className="text-xs">Best returns this period</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-5 pb-4 space-y-2">
                {statistics.topPerformers.map((holding, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[10px] font-bold text-muted-foreground/60 shrink-0 w-4">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{holding.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{holding.platform}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end ml-2 shrink-0">
                      <span
                        className={cn(
                          "text-xs font-bold tabular-nums",
                          holding.returnPercent >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-destructive"
                        )}
                      >
                        {hideValues
                          ? mask()
                          : `${holding.returnPercent >= 0 ? "+" : ""}${holding.returnPercent.toFixed(1)}%`}
                      </span>
                      {!hideValues && (
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          {formatCurrency(Math.abs(holding.returnAmount), holding.currency)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Worst Performers */}
            <Card className="border-border/60">
              <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <TrendingDown className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                  Needs Review
                </CardTitle>
                <CardDescription className="text-xs">Lowest returns this period</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-5 pb-4 space-y-2">
                {statistics.worstPerformers.map((holding, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[10px] font-bold text-muted-foreground/60 shrink-0 w-4">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{holding.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{holding.platform}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end ml-2 shrink-0">
                      <span
                        className={cn(
                          "text-xs font-bold tabular-nums",
                          holding.returnPercent >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-destructive"
                        )}
                      >
                        {hideValues
                          ? mask()
                          : `${holding.returnPercent >= 0 ? "+" : ""}${holding.returnPercent.toFixed(1)}%`}
                      </span>
                      {!hideValues && (
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          {formatCurrency(Math.abs(holding.returnAmount), holding.currency)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Asset Type Performance + Strategy */}
            <div className="space-y-4">
              {statistics.bestAssetType && statistics.worstAssetType && (
                <Card className="border-border/60">
                  <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Coins className="h-3.5 w-3.5 text-muted-foreground" />
                      Asset Type
                    </CardTitle>
                    <CardDescription className="text-xs">Best &amp; worst category</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-5 pb-4 space-y-2.5">
                    <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-2.5 dark:bg-emerald-500/10">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <ArrowUpRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 truncate">
                            {statistics.bestAssetType.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums shrink-0 ml-2">
                          {hideValues
                            ? mask()
                            : `${statistics.bestAssetType.avgReturnPercent >= 0 ? "+" : ""}${statistics.bestAssetType.avgReturnPercent.toFixed(1)}%`}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {statistics.bestAssetType.count} assets
                      </p>
                    </div>

                    <div className="rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2.5 dark:bg-destructive/10">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <ArrowDownRight className="h-3 w-3 text-destructive shrink-0" />
                          <span className="text-xs font-semibold text-destructive truncate">
                            {statistics.worstAssetType.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-destructive tabular-nums shrink-0 ml-2">
                          {hideValues
                            ? mask()
                            : `${statistics.worstAssetType.avgReturnPercent >= 0 ? "+" : ""}${statistics.worstAssetType.avgReturnPercent.toFixed(1)}%`}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {statistics.worstAssetType.count} assets
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Strategy Insights */}
              <Card className="border-border/60">
                <CardHeader className="pb-2 pt-4 px-4 sm:px-5">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-5 pb-4">
                  <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                    <p>
                      Portfolio spans{" "}
                      <span className="font-semibold text-foreground">
                        {statistics.totalPlatforms} platforms
                      </span>{" "}
                      &amp;{" "}
                      <span className="font-semibold text-foreground">
                        {statistics.totalAssetTypes} asset types
                      </span>
                      .
                    </p>
                    {statistics.totalReturnPercent > 0 ? (
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Performing well —{" "}
                        {hideValues ? mask() : `${statistics.totalReturnPercent.toFixed(1)}%`} total
                        return.
                      </p>
                    ) : (
                      <p className="text-destructive font-medium">
                        Consider reviewing underperforming assets.
                      </p>
                    )}
                    <p>
                      {Object.keys(statistics.currencyBreakdown).length > 1
                        ? "Multi-currency portfolio — watch exchange rate impact."
                        : "Single-currency portfolio."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* ── Section: Trends ─────────────────────────────── */}
      <CollapsibleSection id="trends" label="Trends" collapsed={!!collapsed.trends} onToggle={toggleSection}>
        <div className="space-y-4 md:space-y-5">
          <MonthlyHoldingsChart />
          <div className="rounded-2xl border border-border/70 bg-card/80 p-3 sm:p-4 lg:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-none dark:bg-muted/20 backdrop-blur-sm">
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
