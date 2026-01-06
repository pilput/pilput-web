import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet, TrendingUp } from "lucide-react";
import type { Holding } from "@/types/holding";

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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hideValues ? maskValue() : totalInvested.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Initial capital deployed
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hideValues ? maskValue() : totalCurrent.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Market value of holdings
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">P/L (Amount)</CardTitle>
          {totalRealized >= 0 ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              hideValues ? "" : totalRealized >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {hideValues ? maskValue() : `${totalRealized > 0 ? "+" : ""}${totalRealized.toLocaleString()}`}
          </div>
          <p className="text-xs text-muted-foreground">
            Unrealized profit/loss
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">P/L (%)</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              hideValues ? "" : totalPercent >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {hideValues ? maskValue() : `${totalPercent > 0 ? "+" : ""}${totalPercent.toFixed(2)}%`}
          </div>
          <p className="text-xs text-muted-foreground">
            Return on investment
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
