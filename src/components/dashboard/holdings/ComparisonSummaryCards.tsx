import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Wallet, DollarSign, Layers } from "lucide-react";
import type { ComparisonSummary } from "@/types/holding-comparison";

interface ComparisonSummaryCardsProps {
  data: ComparisonSummary;
}

export default function ComparisonSummaryCards({ data }: ComparisonSummaryCardsProps) {
  const { summary, typeComparison, toMonth, fromMonth } = data;

  if (!summary || !toMonth || !fromMonth) {
    return null;
  }

  const formatNumber = (num: number) => num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
              Previous: {formatNumber(summary.from.totalInvested)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Current Value</CardTitle>
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
              Previous: {formatNumber(summary.from.totalCurrentValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
            {summary.to.totalProfitLoss > 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : summary.to.totalProfitLoss < 0 ? (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getChangeColor(summary.to.totalProfitLoss)}`}>
              {summary.to.totalProfitLoss > 0 ? "+" : ""}{formatNumber(summary.to.totalProfitLoss)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {getChangeIcon(summary.profitLossDiff)}
              <span className={`text-xs font-medium ${getChangeColor(summary.profitLossDiff)}`}>
                 {summary.profitLossDiff > 0 ? "+" : ""}{formatNumber(summary.profitLossDiff)} (Diff)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Previous: {formatNumber(summary.from.totalProfitLoss)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return on Investment</CardTitle>
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
                Previous: {summary.from.totalProfitLossPercentage > 0 ? "+" : ""}{summary.from.totalProfitLossPercentage.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Current ROI vs Last Month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Holdings</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.to.holdingsCount}
            </div>
             <div className="flex items-center gap-1 mt-1">
              {getChangeIcon(summary.holdingsCountDiff)}
              <span className={`text-xs font-medium ${getChangeColor(summary.holdingsCountDiff)}`}>
                {summary.holdingsCountDiff > 0 ? "+" : ""}{summary.holdingsCountDiff}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Previous: {summary.from.holdingsCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <Accordion type="multiple" defaultValue={["type-breakdown", "platform-breakdown"]} className="w-full space-y-4">
        <AccordionItem value="type-breakdown" className="border rounded-lg bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Performance by Asset Type</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Invested</TableHead>
                    <TableHead className="text-right">Current Value</TableHead>
                    <TableHead className="text-right">Profit/Loss</TableHead>
                    <TableHead className="text-right">Previous Value</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead className="text-right">Change %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typeComparison && typeComparison.length > 0 ? (
                    typeComparison.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{formatNumber(item.to.invested)}</TableCell>
                        <TableCell className="text-right font-bold">{formatNumber(item.to.current)}</TableCell>
                        <TableCell className={`text-right ${getChangeColor(item.to.profitLoss)}`}>
                          {item.to.profitLoss > 0 ? "+" : ""}{formatNumber(item.to.profitLoss)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">{formatNumber(item.from.current)}</TableCell>
                        <TableCell className={`text-right ${getChangeColor(item.currentValueDiff)}`}>
                          {item.currentValueDiff > 0 ? "+" : ""}{formatNumber(item.currentValueDiff)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={getChangeColor(item.currentValueDiff)}>
                            {formatPercentage(item.currentValueDiffPercentage)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No type breakdown available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="platform-breakdown" className="border rounded-lg bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Performance by Platform</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead className="text-right">Invested</TableHead>
                    <TableHead className="text-right">Current Value</TableHead>
                     <TableHead className="text-right">Profit/Loss</TableHead>
                    <TableHead className="text-right">Previous Value</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead className="text-right">Change %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.platformComparison && data.platformComparison.length > 0 ? (
                    data.platformComparison.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{formatNumber(item.to.invested)}</TableCell>
                         <TableCell className="text-right font-bold">{formatNumber(item.to.current)}</TableCell>
                         <TableCell className={`text-right ${getChangeColor(item.to.profitLoss)}`}>
                          {item.to.profitLoss > 0 ? "+" : ""}{formatNumber(item.to.profitLoss)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">{formatNumber(item.from.current)}</TableCell>
                        <TableCell className={`text-right ${getChangeColor(item.currentValueDiff)}`}>
                          {item.currentValueDiff > 0 ? "+" : ""}{formatNumber(item.currentValueDiff)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={getChangeColor(item.currentValueDiff)}>
                            {formatPercentage(item.currentValueDiffPercentage)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No platform breakdown available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
