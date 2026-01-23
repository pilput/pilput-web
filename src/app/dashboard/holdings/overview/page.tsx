"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { useHoldingsStore } from "@/stores/holdingsStore";
import HoldingSummaryCards from "@/components/dashboard/holdings/HoldingSummaryCards";
import OverviewChart from "@/components/dashboard/holdings/OverviewChart";
import HoldingFilter from "@/components/dashboard/holdings/HoldingFilter";

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

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
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
            <Card className="h-full border-none shadow-none bg-muted/30">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  Quick Insights
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Portfolio composition metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-background border border-border/40 hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <Wallet className="h-4 w-4 text-blue-500/60 shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground truncate">
                      Total Assets
                    </span>
                  </div>
                  <span className="text-sm sm:text-base font-semibold ml-2 shrink-0">
                    {holdings.length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-background border border-border/40 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <DollarSign className="h-4 w-4 text-purple-500/60 shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground truncate">
                      Platforms
                    </span>
                  </div>
                  <span className="text-sm sm:text-base font-semibold ml-2 shrink-0">
                    {new Set(holdings.map((h) => h.platform)).size}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-background border border-border/40 hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <TrendingUp className="h-4 w-4 text-emerald-500/60 shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground truncate">
                      Asset Types
                    </span>
                  </div>
                  <span className="text-sm sm:text-base font-semibold ml-2 shrink-0">
                    {new Set(holdings.map((h) => h.holding_type?.name)).size}
                  </span>
                </div>

                <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg border border-border/40 bg-background/50">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                    Strategy Note
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your portfolio is distributed across{" "}
                    {new Set(holdings.map((h) => h.platform)).size} platforms.
                    Consider rebalancing if any single asset type exceeds 40% of
                    total value.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
