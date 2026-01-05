import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Wallet, DollarSign } from "lucide-react";
import type { ComparisonSummary } from "@/types/holding-comparison";

interface ComparisonSummaryCardsProps {
  data: ComparisonSummary;
}

export default function ComparisonSummaryCards({ data }: ComparisonSummaryCardsProps) {
  const { summary, toMonth, fromMonth } = data;

  if (!summary || !toMonth || !fromMonth) {
    return null;
  }

  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (num: number) => `${num > 0 ? "+" : ""}${num.toFixed(2)}%`;

  const getChangeIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Monthly Comparison</h3>
          <p className="text-sm text-muted-foreground">
            Comparing {fromMonth.month}/{fromMonth.year} → {toMonth.month}/{toMonth.year}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.to.totalInvested)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {getChangeIcon(summary.investedDiff)}
              <span className={`text-xs font-medium ${getChangeColor(summary.investedDiff)}`}>
                {formatNumber(summary.investedDiff)} ({formatPercentage(summary.investedDiffPercentage)})
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From: {formatNumber(summary.from.totalInvested)}
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
              {formatNumber(summary.to.totalCurrentValue)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {getChangeIcon(summary.currentValueDiff)}
              <span className={`text-xs font-medium ${getChangeColor(summary.currentValueDiff)}`}>
                {formatNumber(summary.currentValueDiff)} ({formatPercentage(summary.currentValueDiffPercentage)})
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From: {formatNumber(summary.from.totalCurrentValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">P/L Change</CardTitle>
            {summary.profitLossDiff > 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : summary.profitLossDiff < 0 ? (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getChangeColor(summary.profitLossDiff)}`}>
              {summary.profitLossDiff > 0 ? "+" : ""}{formatNumber(summary.profitLossDiff)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                To: {formatNumber(summary.to.totalProfitLoss)}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                From: {formatNumber(summary.from.totalProfitLoss)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Month-over-month profit/loss change
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current P/L %</CardTitle>
            {summary.to.totalProfitLossPercentage >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.to.totalProfitLossPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
              {summary.to.totalProfitLossPercentage > 0 ? "+" : ""}{summary.to.totalProfitLossPercentage.toFixed(2)}%
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium ${summary.to.totalProfitLossPercentage >= summary.from.totalProfitLossPercentage ? "text-green-600" : "text-red-600"}`}>
                {summary.to.totalProfitLossPercentage >= summary.from.totalProfitLossPercentage ? "↑" : "↓"}
              </span>
              <span className="text-xs text-muted-foreground">
                From: {summary.from.totalProfitLossPercentage > 0 ? "+" : ""}{summary.from.totalProfitLossPercentage.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Current month return percentage
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
