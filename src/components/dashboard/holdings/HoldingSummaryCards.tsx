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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-4 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted rounded mb-1" />
              <div className="h-3 w-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-none shadow-none bg-muted/30 hover:bg-muted/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold text-blue-600/80 dark:text-blue-400/80 uppercase tracking-wider">Total Invested</CardTitle>
          <Wallet className="h-4 w-4 text-blue-500/40" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">
            {hideValues ? maskValue() : formatCurrency(totalInvested, primaryCurrency)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none bg-muted/30 hover:bg-muted/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold text-purple-600/80 dark:text-purple-400/80 uppercase tracking-wider">Current Value</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-500/40" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">
            {hideValues ? maskValue() : formatCurrency(totalCurrent, primaryCurrency)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none bg-muted/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">P/L (Amount)</CardTitle>
          {totalRealized >= 0 ? (
            <ArrowUpRight className="h-4 w-4 text-emerald-500/70" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-rose-500/70" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold tracking-tight ${
              hideValues ? "" : totalRealized >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {hideValues
              ? maskValue()
              : `${totalRealized > 0 ? "+" : ""}${formatCurrency(Math.abs(totalRealized), primaryCurrency)}`}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none bg-muted/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">P/L (%)</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground/50" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold tracking-tight ${
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
