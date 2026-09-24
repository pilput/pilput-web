import { DollarSign, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "cn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Holding } from "@/types/holding";
import OverviewChart from "@/components/dashboard/holdings/OverviewChart";
import { AllocationBreakdown } from "./AllocationBreakdown";
import type { PortfolioStatistics } from "../hooks/usePortfolioStatistics";

function mask() {
  return "••••••";
}

interface AllocationSectionProps {
  statistics: PortfolioStatistics | null;
  holdings: Holding[];
  hideValues: boolean;
}

export function AllocationSection({ statistics, holdings, hideValues }: AllocationSectionProps) {
  return (
    <>
      {statistics?.currencyCount && statistics.currencyCount > 1 ? (
        <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
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
          <div className="lg:col-span-2 min-w-0">
            <OverviewChart
              holdings={holdings}
              currency={statistics?.primaryCurrency ?? "IDR"}
              hideValues={hideValues}
            />
          </div>

          <AllocationBreakdown
            platformDistribution={statistics?.platformDistribution ?? []}
          />
        </div>
      )}

      {statistics && Object.keys(statistics.currencyBreakdown).length > 1 && (
        <Card className="mt-4 md:mt-5 glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
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
    </>
  );
}
