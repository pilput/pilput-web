import { ArrowDownRight, ArrowUpRight, Award, Building2, Layers, Wallet } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { PortfolioStatistics } from "../hooks/usePortfolioStatistics";

interface OverviewHeroProps {
  statistics: PortfolioStatistics;
  hideValues: boolean;
}

function mask() {
  return "••••••";
}

export function OverviewHero({ statistics, hideValues }: OverviewHeroProps) {
  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-card p-4 sm:p-6 dark:bg-gradient-to-br dark:from-primary/5 dark:via-card dark:to-card">
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/15 rounded-full blur-2xl pointer-events-none" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              Portfolio Value
            </p>
            <div className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight tabular-nums">
              {hideValues
                ? mask()
                : formatCurrency(statistics.totalCurrent, statistics.primaryCurrency)}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {statistics.totalAssets} asset{statistics.totalAssets === 1 ? "" : "s"} across {statistics.totalPlatforms} platform{statistics.totalPlatforms === 1 ? "" : "s"}
            </p>
          </div>

          <div className="sm:border-l sm:border-border/50 sm:pl-6">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              Total Invested
            </p>
            <div className="mt-1.5 text-xl sm:text-2xl font-semibold tracking-tight tabular-nums text-foreground/90">
              {hideValues
                ? mask()
                : formatCurrency(statistics.totalInvested, statistics.primaryCurrency)}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Cost basis
            </p>
          </div>

          <div className="sm:border-l sm:border-border/50 sm:pl-6">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              Total Return
            </p>
            <div
              className={cn(
                "mt-1.5 flex items-baseline gap-2 tabular-nums",
                statistics.totalReturn >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-destructive"
              )}
            >
              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                {hideValues
                  ? mask()
                  : `${statistics.totalReturn >= 0 ? "+" : ""}${formatCurrency(Math.abs(statistics.totalReturn), statistics.primaryCurrency)}`}
              </span>
            </div>
            <p
              className={cn(
                "mt-1 inline-flex items-center gap-1 text-[11px] font-semibold",
                statistics.totalReturnPercent >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-destructive"
              )}
            >
              {statistics.totalReturnPercent >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {hideValues
                ? mask()
                : `${statistics.totalReturnPercent >= 0 ? "+" : ""}${statistics.totalReturnPercent.toFixed(2)}%`}
            </p>
          </div>
        </div>
      </div>

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
    </>
  );
}
