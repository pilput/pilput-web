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
  Award,
  BarChart3,
  PieChart,
  Coins,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useHoldingsStore } from "@/stores/holdingsStore";
import HoldingSummaryCards from "@/components/dashboard/holdings/HoldingSummaryCards";
import OverviewChart from "@/components/dashboard/holdings/OverviewChart";
import MonthlyHoldingsChart from "@/components/dashboard/holdings/MonthlyHoldingsChart";
import HoldingFilter from "@/components/dashboard/holdings/HoldingFilter";
import { formatCurrency } from "@/lib/utils";
import type { Holding } from "@/types/holding";

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
    // Load preference from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hideHoldingValues");
      return saved === "true";
    }
    return false;
  });

  useEffect(() => {
    fetchHoldings();
    fetchHoldingTypes();
  }, [fetchHoldings, fetchHoldingTypes]);

  useEffect(() => {
    // Save preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("hideHoldingValues", hideValues.toString());
    }
  }, [hideValues]);

  async function handleFilter(monthOverride?: number, yearOverride?: number) {
    const month = monthOverride ?? parseInt(filterMonth, 10);
    const year = yearOverride ?? parseInt(filterYear, 10);
    await fetchHoldings({ month, year });
  }

  // Calculate comprehensive statistics
  const statistics = useMemo(() => {
    if (!holdings || holdings.length === 0) {
      return null;
    }

    const totalInvested = holdings.reduce(
      (sum, h) => sum + parseFloat(h.invested_amount),
      0
    );
    const totalCurrent = holdings.reduce(
      (sum, h) => sum + parseFloat(h.current_value),
      0
    );
    const totalReturn = totalCurrent - totalInvested;
    const totalReturnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    // Currency breakdown
    const currencyBreakdown = holdings.reduce((acc, h) => {
      const currency = h.currency || "Unknown";
      const invested = parseFloat(h.invested_amount);
      const current = parseFloat(h.current_value);
      if (!acc[currency]) {
        acc[currency] = { invested: 0, current: 0, count: 0 };
      }
      acc[currency].invested += invested;
      acc[currency].current += current;
      acc[currency].count += 1;
      return acc;
    }, {} as Record<string, { invested: number; current: number; count: number }>);

    // Asset type performance
    const assetTypePerformance = holdings.reduce((acc, h) => {
      const typeName = h.holding_type?.name || "Unknown";
      const invested = parseFloat(h.invested_amount);
      const current = parseFloat(h.current_value);
      const returnAmount = current - invested;
      const returnPercent = invested > 0 ? (returnAmount / invested) * 100 : 0;

      if (!acc[typeName]) {
        acc[typeName] = {
          invested: 0,
          current: 0,
          returnAmount: 0,
          count: 0,
          avgReturnPercent: 0,
        };
      }
      acc[typeName].invested += invested;
      acc[typeName].current += current;
      acc[typeName].returnAmount += returnAmount;
      acc[typeName].count += 1;
      acc[typeName].avgReturnPercent = acc[typeName].invested > 0
        ? (acc[typeName].returnAmount / acc[typeName].invested) * 100
        : 0;
      return acc;
    }, {} as Record<string, {
      invested: number;
      current: number;
      returnAmount: number;
      count: number;
      avgReturnPercent: number;
    }>);

    // Top performing holdings (by return %)
    const holdingsWithReturn = holdings
      .map((h) => {
        const invested = parseFloat(h.invested_amount);
        const current = parseFloat(h.current_value);
        const returnAmount = current - invested;
        const returnPercent = invested > 0 ? (returnAmount / invested) * 100 : 0;
        return { ...h, returnAmount, returnPercent };
      })
      .sort((a, b) => b.returnPercent - a.returnPercent);

    const topPerformers = holdingsWithReturn.slice(0, 3);
    const worstPerformers = holdingsWithReturn.slice(-3).reverse();

    // Platform statistics
    const platformStats = holdings.reduce((acc, h) => {
      const platform = h.platform || "Unknown";
      const current = parseFloat(h.current_value);
      if (!acc[platform]) {
        acc[platform] = { value: 0, count: 0 };
      }
      acc[platform].value += current;
      acc[platform].count += 1;
      return acc;
    }, {} as Record<string, { value: number; count: number }>);

    const topPlatform = Object.entries(platformStats)
      .sort((a, b) => b[1].value - a[1].value)[0];

    // Best and worst asset types
    const assetTypeEntries = Object.entries(assetTypePerformance)
      .map(([name, data]) => ({
        name,
        ...data,
      }))
      .sort((a, b) => b.avgReturnPercent - a.avgReturnPercent);

    const bestAssetType = assetTypeEntries[0];
    const worstAssetType = assetTypeEntries[assetTypeEntries.length - 1];

    // Get most common currency
    const mostCommonCurrency =
      Object.keys(currencyBreakdown).length > 0
        ? Object.entries(currencyBreakdown).sort(
            (a, b) => b[1].count - a[1].count
          )[0][0]
        : "IDR";

    return {
      totalInvested,
      totalCurrent,
      totalReturn,
      totalReturnPercent,
      currencyBreakdown,
      assetTypePerformance,
      topPerformers,
      worstPerformers,
      topPlatform,
      bestAssetType,
      worstAssetType,
      primaryCurrency: mostCommonCurrency,
      totalAssets: holdings.length,
      totalPlatforms: new Set(holdings.map((h) => h.platform)).size,
      totalAssetTypes: new Set(holdings.map((h) => h.holding_type?.name)).size,
    };
  }, [holdings]);

  const maskValue = () => "••••••";

  return (
    <div className="container mx-auto space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/dashboard/holdings">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Portfolio Overview
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              Track and analyze your investment performance across all assets.
            </p>
          </div>
        </div>
        
        {/* Filter and Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pl-9 sm:pl-11">
          <div className="flex-1 min-w-0">
            <HoldingFilter
              month={filterMonth}
              year={filterYear}
              onMonthChange={setFilterMonth}
              onYearChange={setFilterYear}
              onFilter={handleFilter}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setHideValues(!hideValues)}
            title={hideValues ? "Show values" : "Hide values"}
            className="shrink-0 h-9 sm:h-10"
          >
            {hideValues ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 sm:gap-6">
        <HoldingSummaryCards
          holdings={holdings}
          isLoading={isLoading}
          hideValues={hideValues}
        />

        {/* Chart and Insights Grid */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 min-w-0">
            <OverviewChart holdings={holdings} hideValues={hideValues} />
          </div>
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Insights Card */}
            <Card className="border-none shadow-none bg-muted/30">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Portfolio Overview
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Key metrics and statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {statistics && (
                  <>
                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-background border border-border/40 hover:border-blue-500/30 transition-colors">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <Wallet className="h-4 w-4 text-blue-500/60 shrink-0" />
                        <span className="text-xs sm:text-sm text-muted-foreground truncate">
                          Total Assets
                        </span>
                      </div>
                      <span className="text-sm sm:text-base font-semibold ml-2 shrink-0">
                        {statistics.totalAssets}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-background border border-border/40 hover:border-purple-500/30 transition-colors">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <Building2 className="h-4 w-4 text-purple-500/60 shrink-0" />
                        <span className="text-xs sm:text-sm text-muted-foreground truncate">
                          Platforms
                        </span>
                      </div>
                      <span className="text-sm sm:text-base font-semibold ml-2 shrink-0">
                        {statistics.totalPlatforms}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-background border border-border/40 hover:border-emerald-500/30 transition-colors">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <PieChart className="h-4 w-4 text-emerald-500/60 shrink-0" />
                        <span className="text-xs sm:text-sm text-muted-foreground truncate">
                          Asset Types
                        </span>
                      </div>
                      <span className="text-sm sm:text-base font-semibold ml-2 shrink-0">
                        {statistics.totalAssetTypes}
                      </span>
                    </div>

                    {statistics.topPlatform && (
                      <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-background border border-border/40 hover:border-amber-500/30 transition-colors">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <Award className="h-4 w-4 text-amber-500/60 shrink-0" />
                          <span className="text-xs sm:text-sm text-muted-foreground truncate">
                            Top Platform
                          </span>
                        </div>
                        <div className="flex flex-col items-end ml-2 shrink-0">
                          <span className="text-xs sm:text-sm font-semibold truncate max-w-[100px]">
                            {statistics.topPlatform[0]}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {statistics.topPlatform[1].count} assets
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Performance Insights */}
            {statistics && statistics.topPerformers.length > 0 && (
              <Card className="border-none shadow-none bg-muted/30">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    Top Performers
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Best returns this period
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {statistics.topPerformers.map((holding, idx) => {
                    const invested = parseFloat(holding.invested_amount);
                    const current = parseFloat(holding.current_value);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border/40 hover:border-emerald-500/30 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate">
                            {holding.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {holding.platform}
                          </p>
                        </div>
                        <div className="flex flex-col items-end ml-2 shrink-0">
                          <span
                            className={`text-xs sm:text-sm font-semibold ${
                              holding.returnPercent >= 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {hideValues
                              ? maskValue()
                              : `${holding.returnPercent >= 0 ? "+" : ""}${holding.returnPercent.toFixed(1)}%`}
                          </span>
                          {!hideValues && (
                            <span className="text-[10px] text-muted-foreground">
                              {formatCurrency(
                                Math.abs(holding.returnAmount),
                                holding.currency
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Asset Type Performance */}
            {statistics &&
              statistics.bestAssetType &&
              statistics.worstAssetType && (
                <Card className="border-none shadow-none bg-muted/30">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      Asset Type Performance
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Best and worst performers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          Best: {statistics.bestAssetType.name}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">
                          {statistics.bestAssetType.count} assets
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {hideValues
                            ? maskValue()
                            : `${statistics.bestAssetType.avgReturnPercent >= 0 ? "+" : ""}${statistics.bestAssetType.avgReturnPercent.toFixed(1)}%`}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                          Needs Review: {statistics.worstAssetType.name}
                        </span>
                        <ArrowDownRight className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">
                          {statistics.worstAssetType.count} assets
                        </span>
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                          {hideValues
                            ? maskValue()
                            : `${statistics.worstAssetType.avgReturnPercent >= 0 ? "+" : ""}${statistics.worstAssetType.avgReturnPercent.toFixed(1)}%`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Strategy Insights */}
            {statistics && (
              <Card className="border-none shadow-none bg-muted/30">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Strategy Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                    <p>
                      Your portfolio spans{" "}
                      <span className="font-semibold text-foreground">
                        {statistics.totalPlatforms} platforms
                      </span>{" "}
                      with{" "}
                      <span className="font-semibold text-foreground">
                        {statistics.totalAssetTypes} asset types
                      </span>
                      .
                    </p>
                    {statistics.totalReturnPercent > 0 ? (
                      <p className="text-emerald-600 dark:text-emerald-400">
                        Portfolio is performing well with a{" "}
                        <span className="font-semibold">
                          {hideValues
                            ? maskValue()
                            : `${statistics.totalReturnPercent.toFixed(1)}%`}{" "}
                          return
                        </span>
                        .
                      </p>
                    ) : (
                      <p className="text-rose-600 dark:text-rose-400">
                        Consider reviewing underperforming assets and
                        rebalancing your portfolio.
                      </p>
                    )}
                    <p>
                      {Object.keys(statistics.currencyBreakdown).length > 1
                        ? "You're holding multiple currencies. Monitor exchange rate impacts."
                        : "Portfolio is concentrated in a single currency."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Monthly Holdings Trend */}
        <MonthlyHoldingsChart />

        {/* Currency Breakdown */}
        {statistics &&
          Object.keys(statistics.currencyBreakdown).length > 0 && (
            <Card className="border-none shadow-none bg-muted/30">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Currency Breakdown
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Portfolio distribution by currency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(statistics.currencyBreakdown)
                    .sort((a, b) => b[1].current - a[1].current)
                    .map(([currency, data]) => {
                      const currencyPercent =
                        statistics.totalCurrent > 0
                          ? (data.current / statistics.totalCurrent) * 100
                          : 0;
                      const currencyReturn = data.current - data.invested;
                      const currencyReturnPercent =
                        data.invested > 0
                          ? (currencyReturn / data.invested) * 100
                          : 0;

                      return (
                        <div
                          key={currency}
                          className="p-3 rounded-lg bg-background border border-border/40 hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold">
                              {currency}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {currencyPercent.toFixed(1)}%
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                Value:
                              </span>
                              <span className="font-medium">
                                {hideValues
                                  ? maskValue()
                                  : formatCurrency(data.current, currency)}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                Invested:
                              </span>
                              <span className="font-medium">
                                {hideValues
                                  ? maskValue()
                                  : formatCurrency(data.invested, currency)}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs pt-1 border-t border-border/40">
                              <span className="text-muted-foreground">
                                Return:
                              </span>
                              <span
                                className={`font-semibold ${
                                  currencyReturnPercent >= 0
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {hideValues
                                  ? maskValue()
                                  : `${currencyReturnPercent >= 0 ? "+" : ""}${currencyReturnPercent.toFixed(1)}%`}
                              </span>
                            </div>
                            <div className="text-[10px] text-muted-foreground pt-1">
                              {data.count} asset{data.count !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Percentage Distribution Cards */}
        {statistics && (
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Platform Percentage Distribution */}
            <Card className="border-none shadow-none bg-muted/30">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Platform Distribution (%)
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Portfolio allocation by platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    holdings.reduce((acc, h) => {
                      const platform = h.platform || "Unknown";
                      const value = parseFloat(h.current_value);
                      if (!acc[platform]) {
                        acc[platform] = 0;
                      }
                      acc[platform] += value;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .map(([platform, value]) => ({
                      platform,
                      value,
                      percent:
                        statistics.totalCurrent > 0
                          ? (value / statistics.totalCurrent) * 100
                          : 0,
                    }))
                    .sort((a, b) => b.value - a.value)
                    .map((item, index) => {
                      const CHART_COLORS = [
                        "#3b82f6", // Blue
                        "#8b5cf6", // Purple
                        "#ec4899", // Pink
                        "#f59e0b", // Amber
                        "#10b981", // Emerald
                        "#6366f1", // Indigo
                      ];
                      return (
                        <div
                          key={item.platform}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{
                                  backgroundColor:
                                    CHART_COLORS[index % CHART_COLORS.length],
                                }}
                              />
                              <span className="text-sm font-medium truncate">
                                {item.platform}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 ml-2 shrink-0">
                              <span className="text-xs text-muted-foreground">
                                {hideValues
                                  ? maskValue()
                                  : formatCurrency(item.value, statistics.primaryCurrency)}
                              </span>
                              <span className="text-sm font-bold min-w-[50px] text-right">
                                {hideValues ? "•••" : `${item.percent.toFixed(1)}%`}
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${item.percent}%`,
                                backgroundColor:
                                  CHART_COLORS[index % CHART_COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Asset Type Percentage Distribution */}
            <Card className="border-none shadow-none bg-muted/30">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Asset Type Distribution (%)
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Portfolio allocation by asset type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    holdings.reduce((acc, h) => {
                      const typeName = h.holding_type?.name || "Unknown";
                      const value = parseFloat(h.current_value);
                      if (!acc[typeName]) {
                        acc[typeName] = 0;
                      }
                      acc[typeName] += value;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .map(([typeName, value]) => ({
                      typeName,
                      value,
                      percent:
                        statistics.totalCurrent > 0
                          ? (value / statistics.totalCurrent) * 100
                          : 0,
                    }))
                    .sort((a, b) => b.value - a.value)
                    .map((item, index) => {
                      const CHART_COLORS = [
                        "#3b82f6", // Blue
                        "#8b5cf6", // Purple
                        "#ec4899", // Pink
                        "#f59e0b", // Amber
                        "#10b981", // Emerald
                        "#6366f1", // Indigo
                      ];
                      return (
                        <div
                          key={item.typeName}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{
                                  backgroundColor:
                                    CHART_COLORS[index % CHART_COLORS.length],
                                }}
                              />
                              <span className="text-sm font-medium truncate">
                                {item.typeName}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 ml-2 shrink-0">
                              <span className="text-xs text-muted-foreground">
                                {hideValues
                                  ? maskValue()
                                  : formatCurrency(item.value, statistics.primaryCurrency)}
                              </span>
                              <span className="text-sm font-bold min-w-[50px] text-right">
                                {hideValues ? "•••" : `${item.percent.toFixed(1)}%`}
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${item.percent}%`,
                                backgroundColor:
                                  CHART_COLORS[index % CHART_COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
