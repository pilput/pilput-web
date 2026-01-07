"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff, Wallet, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useHoldingsStore } from "@/stores/holdingsStore";
import HoldingSummaryCards from "@/components/dashboard/holdings/HoldingSummaryCards";
import OverviewChart from "@/components/dashboard/holdings/OverviewChart";
import HoldingFilter from "@/components/dashboard/holdings/HoldingFilter";

export default function HoldingOverviewPage() {
  const {
    holdings,
    isLoading,
    fetchHoldings,
    fetchHoldingTypes,
  } = useHoldingsStore();

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
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/holdings">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Portfolio Overview
            </h1>
            <p className="text-muted-foreground text-sm">
              Track and analyze your investment performance across all assets.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <HoldingFilter
            month={filterMonth}
            year={filterYear}
            onMonthChange={setFilterMonth}
            onYearChange={setFilterYear}
            onFilter={handleFilter}
          />
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
      </div>

      <div className="grid gap-6">
        <HoldingSummaryCards
          holdings={holdings}
          isLoading={isLoading}
          hideValues={hideValues}
        />
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <OverviewChart holdings={holdings} hideValues={hideValues} />
          </div>
          <div className="space-y-6">
            <Card className="h-full border-none shadow-none bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Insights</CardTitle>
                <CardDescription>Portfolio composition metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/40 hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-4 w-4 text-blue-500/60" />
                    <span className="text-sm text-muted-foreground">Total Assets</span>
                  </div>
                  <span className="text-base font-semibold">{holdings.length}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/40 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-purple-500/60" />
                    <span className="text-sm text-muted-foreground">Platforms</span>
                  </div>
                  <span className="text-base font-semibold">
                    {new Set(holdings.map(h => h.platform)).size}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/40 hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-emerald-500/60" />
                    <span className="text-sm text-muted-foreground">Asset Types</span>
                  </div>
                  <span className="text-base font-semibold">
                    {new Set(holdings.map(h => h.holding_type?.name)).size}
                  </span>
                </div>

                <div className="mt-4 p-4 rounded-lg border border-border/40 bg-background/50">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Strategy Note</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your portfolio is distributed across {new Set(holdings.map(h => h.platform)).size} platforms.
                    Consider rebalancing if any single asset type exceeds 40% of total value.
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