import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { ComparisonItem } from "@/types/holding-comparison";

interface ComparisonTableProps {
  data: ComparisonItem[];
  title: string;
}

export default function ComparisonTable({ data, title }: ComparisonTableProps) {
  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (num: number) => `${num > 0 ? "+" : ""}${num.toFixed(2)}%`;

  const getChangeIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">To Invested</TableHead>
              <TableHead className="text-right">To Value</TableHead>
              <TableHead className="text-right">To P/L</TableHead>
              <TableHead className="text-right">From Invested</TableHead>
              <TableHead className="text-right">From Value</TableHead>
              <TableHead className="text-right">From P/L</TableHead>
              <TableHead className="text-right">Invested Change</TableHead>
              <TableHead className="text-right">Value Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right">{formatNumber(item.to.invested)}</TableCell>
                <TableCell className="text-right">{formatNumber(item.to.current)}</TableCell>
                <TableCell className={`text-right ${getChangeColor(item.to.profitLoss)}`}>
                  {item.to.profitLoss > 0 ? "+" : ""}{formatNumber(item.to.profitLoss)}
                  <span className="ml-1">({formatPercentage(item.to.profitLossPercentage)})</span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{formatNumber(item.from.invested)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatNumber(item.from.current)}</TableCell>
                <TableCell className={`text-right text-muted-foreground ${getChangeColor(item.from.profitLoss)}`}>
                  {item.from.profitLoss > 0 ? "+" : ""}{formatNumber(item.from.profitLoss)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {getChangeIcon(item.investedDiff)}
                    <span className={`font-medium ${getChangeColor(item.investedDiff)}`}>
                      {formatNumber(item.investedDiff)}
                    </span>
                  </div>
                  <span className={`text-xs ${getChangeColor(item.investedDiffPercentage)}`}>
                    ({formatPercentage(item.investedDiffPercentage)})
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {getChangeIcon(item.currentValueDiff)}
                    <span className={`font-medium ${getChangeColor(item.currentValueDiff)}`}>
                      {formatNumber(item.currentValueDiff)}
                    </span>
                  </div>
                  <span className={`text-xs ${getChangeColor(item.currentValueDiffPercentage)}`}>
                    ({formatPercentage(item.currentValueDiffPercentage)})
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
