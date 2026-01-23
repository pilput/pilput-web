import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet, TrendingUp } from "lucide-react";
import type { Holding } from "@/types/holding";
import { formatCurrency } from "@/lib/utils";

interface HoldingSummaryCardsProps {
  holdings: Holding[];
  isLoading: boolean;
  hideValues?: boolean;
}

export default function HoldingSummaryCards({
  holdings,
  isLoading,
  hideValues = false,
}: HoldingSummaryCardsProps) {
  const totalInvested = holdings.reduce(
    (sum, holding) => sum + parseFloat(holding.invested_amount),
    0
  );
  const totalCurrent = holdings.reduce(
    (sum, holding) => sum + parseFloat(holding.current_value),
    0
  );
  const totalRealized = totalCurrent - totalInvested;
  const totalPercent =
    totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0;

  // Get the most common currency from holdings, default to IDR
  const mostCommonCurrency =
    holdings.length > 0
      ? holdings.reduce((acc, holding) => {
          acc[holding.currency] = (acc[holding.currency] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      : {};
  const primaryCurrency =
    Object.keys(mostCommonCurrency).length > 0
      ? Object.entries(mostCommonCurrency).sort((a, b) => b[1] - a[1])[0][0]
      : "IDR";

  const maskValue = () => "••••••";

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <div className="h-3 sm:h-4 w-16 sm:w-24 bg-muted rounded" />
              <div className="h-3 sm:h-4 w-3 sm:w-4 bg-muted rounded" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="h-6 sm:h-8 w-20 sm:w-32 bg-muted rounded mb-1" />
              <div className="h-2 sm:h-3 w-12 sm:w-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      <Card className="border-none shadow-none bg-muted/30 hover:bg-muted/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-[10px] sm:text-xs font-semibold text-blue-600/80 dark:text-blue-400/80 uppercase tracking-wider truncate pr-1">
            Total Invested
          </CardTitle>
          <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500/40 shrink-0" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight break-words">
            {hideValues ? maskValue() : formatCurrency(totalInvested, primaryCurrency)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none bg-muted/30 hover:bg-muted/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-[10px] sm:text-xs font-semibold text-purple-600/80 dark:text-purple-400/80 uppercase tracking-wider truncate pr-1">
            Current Value
          </CardTitle>
          <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500/40 shrink-0" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight break-words">
            {hideValues ? maskValue() : formatCurrency(totalCurrent, primaryCurrency)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none bg-muted/30 hover:bg-muted/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider truncate pr-1">
            P/L (Amount)
          </CardTitle>
          {totalRealized >= 0 ? (
            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500/70 shrink-0" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-500/70 shrink-0" />
          )}
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div
            className={`text-lg sm:text-xl lg:text-2xl font-bold tracking-tight break-words ${
              hideValues ? "" : totalRealized >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {hideValues
              ? maskValue()
              : `${totalRealized > 0 ? "+" : ""}${formatCurrency(Math.abs(totalRealized), primaryCurrency)}`}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none bg-muted/30 hover:bg-muted/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider truncate pr-1">
            P/L (%)
          </CardTitle>
          <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/50 shrink-0" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div
            className={`text-lg sm:text-xl lg:text-2xl font-bold tracking-tight break-words ${
              hideValues ? "" : totalPercent >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {hideValues ? maskValue() : `${totalPercent > 0 ? "+" : ""}${totalPercent.toFixed(2)}%`}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
