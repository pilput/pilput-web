import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Wallet, DollarSign, Layers } from "lucide-react";
import type { ComparisonSummary } from "@/types/holding-comparison";

interface ComparisonSummaryCardsProps {
  data: ComparisonSummary;
  hideValues?: boolean;
}

export default function ComparisonSummaryCards({ data, hideValues = false }: ComparisonSummaryCardsProps) {
  const { summary, typeComparison, toMonth, fromMonth } = data;

  if (!summary || !toMonth || !fromMonth) {
    return null;
  }

  const maskValue = () => "••••••";
  const formatNumber = (num: number) => hideValues ? maskValue() : num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formatPercentage = (num: number) => hideValues ? maskValue() : `${num > 0 ? "+" : ""}${num.toFixed(2)}%`;

  const getChangeIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
  };

  const getChangeColor = (value: number) => {
    if (hideValues) return "";
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium truncate pr-1">Total Invested</CardTitle>
            <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold break-words">
              {formatNumber(summary.to.totalInvested)}
            </div>
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {getChangeIcon(summary.investedDiff)}
              <span className={`text-[10px] sm:text-xs font-medium ${getChangeColor(summary.investedDiff)} break-words`}>
                {formatNumber(summary.investedDiff)} ({formatPercentage(summary.investedDiffPercentage)})
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 break-words">
              Previous: {formatNumber(summary.from.totalInvested)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium truncate pr-1">Total Current Value</CardTitle>
            <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold break-words">
              {formatNumber(summary.to.totalCurrentValue)}
            </div>
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {getChangeIcon(summary.currentValueDiff)}
              <span className={`text-[10px] sm:text-xs font-medium ${getChangeColor(summary.currentValueDiff)} break-words`}>
                {formatNumber(summary.currentValueDiff)} ({formatPercentage(summary.currentValueDiffPercentage)})
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 break-words">
              Previous: {formatNumber(summary.from.totalCurrentValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium truncate pr-1">Total Profit/Loss</CardTitle>
            {summary.to.totalProfitLoss > 0 ? (
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 shrink-0" />
            ) : summary.to.totalProfitLoss < 0 ? (
              <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 shrink-0" />
            ) : (
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
            )}
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className={`text-lg sm:text-xl lg:text-2xl font-bold break-words ${getChangeColor(summary.to.totalProfitLoss)}`}>
              {summary.to.totalProfitLoss > 0 ? "+" : ""}{formatNumber(summary.to.totalProfitLoss)}
            </div>
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {getChangeIcon(summary.profitLossDiff)}
              <span className={`text-[10px] sm:text-xs font-medium ${getChangeColor(summary.profitLossDiff)} break-words`}>
                 {summary.profitLossDiff > 0 ? "+" : ""}{formatNumber(summary.profitLossDiff)} (Diff)
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 break-words">
              Previous: {formatNumber(summary.from.totalProfitLoss)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium truncate pr-1">Return on Investment</CardTitle>
            {summary.to.totalProfitLossPercentage >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 shrink-0" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 shrink-0" />
            )}
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className={`text-lg sm:text-xl lg:text-2xl font-bold break-words ${summary.to.totalProfitLossPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
              {summary.to.totalProfitLossPercentage > 0 ? "+" : ""}{summary.to.totalProfitLossPercentage.toFixed(2)}%
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-[10px] sm:text-xs font-medium ${summary.to.totalProfitLossPercentage >= summary.from.totalProfitLossPercentage ? "text-green-600" : "text-red-600"}`}>
                {summary.to.totalProfitLossPercentage >= summary.from.totalProfitLossPercentage ? "↑" : "↓"}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground break-words">
                Previous: {summary.from.totalProfitLossPercentage > 0 ? "+" : ""}{summary.from.totalProfitLossPercentage.toFixed(2)}%
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              Current ROI vs Last Month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium truncate pr-1">Active Holdings</CardTitle>
            <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">
              {summary.to.holdingsCount}
            </div>
             <div className="flex items-center gap-1 mt-1 flex-wrap">
              {getChangeIcon(summary.holdingsCountDiff)}
              <span className={`text-[10px] sm:text-xs font-medium ${getChangeColor(summary.holdingsCountDiff)}`}>
                {summary.holdingsCountDiff > 0 ? "+" : ""}{summary.holdingsCountDiff}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              Previous: {summary.from.holdingsCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <Accordion type="multiple" defaultValue={["type-breakdown", "platform-breakdown"]} className="w-full space-y-3 sm:space-y-4">
        <AccordionItem value="type-breakdown" className="border rounded-lg bg-card px-3 sm:px-4">
          <AccordionTrigger className="hover:no-underline py-3 sm:py-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
              <span className="font-semibold text-xs sm:text-sm">Performance by Asset Type</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 overflow-x-auto">
              <Table className="min-w-[600px] sm:min-w-0">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Type</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Invested</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Current Value</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Profit/Loss</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Previous Value</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Change</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Change %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typeComparison && typeComparison.length > 0 ? (
                    typeComparison.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell className="font-medium text-xs sm:text-sm">{item.name}</TableCell>
                        <TableCell className="text-right text-xs sm:text-sm">{formatNumber(item.to.invested)}</TableCell>
                        <TableCell className="text-right font-bold text-xs sm:text-sm">{formatNumber(item.to.current)}</TableCell>
                        <TableCell className={`text-right text-xs sm:text-sm ${getChangeColor(item.to.profitLoss)}`}>
                          {item.to.profitLoss > 0 ? "+" : ""}{formatNumber(item.to.profitLoss)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-xs sm:text-sm">{formatNumber(item.from.current)}</TableCell>
                        <TableCell className={`text-right text-xs sm:text-sm ${getChangeColor(item.currentValueDiff)}`}>
                          {item.currentValueDiff > 0 ? "+" : ""}{formatNumber(item.currentValueDiff)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={`text-[10px] sm:text-xs ${getChangeColor(item.currentValueDiff)}`}>
                            {formatPercentage(item.currentValueDiffPercentage)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground text-xs sm:text-sm py-4">
                        No type breakdown available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="platform-breakdown" className="border rounded-lg bg-card px-3 sm:px-4">
          <AccordionTrigger className="hover:no-underline py-3 sm:py-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
              <span className="font-semibold text-xs sm:text-sm">Performance by Platform</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 overflow-x-auto">
              <Table className="min-w-[600px] sm:min-w-0">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Platform</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Invested</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Current Value</TableHead>
                     <TableHead className="text-right text-xs sm:text-sm">Profit/Loss</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Previous Value</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Change</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Change %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.platformComparison && data.platformComparison.length > 0 ? (
                    data.platformComparison.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell className="font-medium text-xs sm:text-sm">{item.name}</TableCell>
                        <TableCell className="text-right text-xs sm:text-sm">{formatNumber(item.to.invested)}</TableCell>
                         <TableCell className="text-right font-bold text-xs sm:text-sm">{formatNumber(item.to.current)}</TableCell>
                         <TableCell className={`text-right text-xs sm:text-sm ${getChangeColor(item.to.profitLoss)}`}>
                          {item.to.profitLoss > 0 ? "+" : ""}{formatNumber(item.to.profitLoss)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-xs sm:text-sm">{formatNumber(item.from.current)}</TableCell>
                        <TableCell className={`text-right text-xs sm:text-sm ${getChangeColor(item.currentValueDiff)}`}>
                          {item.currentValueDiff > 0 ? "+" : ""}{formatNumber(item.currentValueDiff)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={`text-[10px] sm:text-xs ${getChangeColor(item.currentValueDiff)}`}>
                            {formatPercentage(item.currentValueDiffPercentage)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground text-xs sm:text-sm py-4">
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
