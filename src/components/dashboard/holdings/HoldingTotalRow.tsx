import { TableCell, TableRow } from "@/components/ui/table";
import type { Holding } from "@/types/holding";
import { formatCurrency } from "@/lib/utils";

interface HoldingTotalRowProps {
  holdings: Holding[];
  hideValues?: boolean;
}

export default function HoldingTotalRow({ holdings, hideValues = false }: HoldingTotalRowProps) {
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

  return (
    <TableRow className="bg-muted/30 border-t-2 font-semibold">
      <TableCell colSpan={4} className="text-right font-bold">
        Total
      </TableCell>
      <TableCell className="font-bold font-mono">
        {hideValues ? maskValue() : formatCurrency(totalInvested, primaryCurrency, { showSymbol: false })}
      </TableCell>
      <TableCell className="font-bold font-mono">
        {hideValues ? maskValue() : formatCurrency(totalCurrent, primaryCurrency, { showSymbol: false })}
      </TableCell>
      <TableCell
        className={`font-bold font-mono ${
          hideValues
            ? ""
            : totalRealized > 0
            ? "text-green-600"
            : totalRealized < 0
            ? "text-red-600"
            : "text-gray-600"
        }`}
      >
        {hideValues
          ? maskValue()
          : `${totalRealized > 0 ? "+" : ""}${formatCurrency(Math.abs(totalRealized), primaryCurrency, { showSymbol: false })}`}
      </TableCell>
      <TableCell
        className={`font-bold ${
          hideValues
            ? ""
            : totalPercent > 0
            ? "text-green-600"
            : totalPercent < 0
            ? "text-red-600"
            : "text-gray-600"
        }`}
      >
        {hideValues ? maskValue() : `${totalPercent > 0 ? "+" : ""}${totalPercent.toFixed(2)}%`}
      </TableCell>
      <TableCell colSpan={2}></TableCell>
    </TableRow>
  );
}