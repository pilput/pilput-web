import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wallet, DollarSign } from "lucide-react";
import type { ComparisonSummary } from "@/types/holding-comparison";

interface ComparisonTablesProps {
  data: ComparisonSummary;
  hideValues?: boolean;
}

export default function ComparisonTables({ data, hideValues = false }: ComparisonTablesProps) {
  const { typeComparison } = data; // Removed 'summary', 'toMonth', 'fromMonth' as they are not used here

  const maskValue = () => "••••••";
  const formatNumber = (num: number) => hideValues ? maskValue() : num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formatPercentage = (num: number) => hideValues ? maskValue() : `${num > 0 ? "+" : ""}${num.toFixed(2)}%`;

  const getChangeColor = (value: number) => {
    if (hideValues) return "";
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  return (
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
  );
}