import {
  ArrowDownRight,
  ArrowUpRight,
  Coins,
  Info,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "cn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PortfolioStatistics } from "../hooks/usePortfolioStatistics";

function mask() {
  return "••••••";
}

interface PerformerRowProps {
  rank: number;
  name: string;
  platform: string;
  returnPercent: number;
  returnAmount: number;
  currency: string;
  hideValues: boolean;
}

function PerformerRow({
  rank,
  name,
  platform,
  returnPercent,
  returnAmount,
  currency,
  hideValues,
}: PerformerRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2 hover:bg-accent/30 transition-colors">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-[10px] font-bold text-muted-foreground/60 shrink-0 w-4">
          {rank}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate">{name}</p>
          <p className="text-[10px] text-muted-foreground truncate">{platform}</p>
        </div>
      </div>
      <div className="flex flex-col items-end ml-2 shrink-0">
        <span
          className={cn(
            "text-xs font-bold tabular-nums",
            returnPercent >= 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-destructive"
          )}
        >
          {hideValues
            ? mask()
            : `${returnPercent >= 0 ? "+" : ""}${returnPercent.toFixed(1)}%`}
        </span>
        {!hideValues && (
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {formatCurrency(Math.abs(returnAmount), currency)}
          </span>
        )}
      </div>
    </div>
  );
}

interface PerformanceSectionProps {
  statistics: PortfolioStatistics;
  hideValues: boolean;
}

export function PerformanceSection({ statistics, hideValues }: PerformanceSectionProps) {
  return (
    <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
        <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Top Performers
          </CardTitle>
          <CardDescription className="text-xs">Best returns this period</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-5 pb-4 space-y-2">
          {statistics.topPerformers.map((holding, idx) => (
            <PerformerRow
              key={holding.id ?? idx}
              rank={idx + 1}
              name={holding.name}
              platform={holding.platform}
              returnPercent={holding.returnPercent}
              returnAmount={holding.returnAmount}
              currency={holding.currency}
              hideValues={hideValues}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
        <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingDown className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
            Needs Review
          </CardTitle>
          <CardDescription className="text-xs">Lowest returns this period</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-5 pb-4 space-y-2">
          {statistics.worstPerformers.map((holding, idx) => (
            <PerformerRow
              key={holding.id ?? idx}
              rank={idx + 1}
              name={holding.name}
              platform={holding.platform}
              returnPercent={holding.returnPercent}
              returnAmount={holding.returnAmount}
              currency={holding.currency}
              hideValues={hideValues}
            />
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {statistics.bestAssetType && statistics.worstAssetType && (
          <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
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

        <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
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
  );
}
