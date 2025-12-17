import { TableCell, TableRow } from "@/components/ui/table";
import type { Holding } from "@/types/holding";

interface HoldingTotalRowProps {
  holdings: Holding[];
}

export default function HoldingTotalRow({ holdings }: HoldingTotalRowProps) {
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

  return (
    <TableRow className="bg-muted/30 border-t-2 font-semibold">
      <TableCell colSpan={4} className="text-right font-bold">
        Total
      </TableCell>
      <TableCell className="font-bold">{totalInvested.toLocaleString()}</TableCell>
      <TableCell className="font-bold">{totalCurrent.toLocaleString()}</TableCell>
      <TableCell
        className={`font-bold ${
          totalRealized > 0
            ? "text-green-600"
            : totalRealized < 0
            ? "text-red-600"
            : "text-gray-600"
        }`}
      >
        {totalRealized.toLocaleString()}
      </TableCell>
      <TableCell
        className={`font-bold ${
          totalPercent > 0
            ? "text-green-600"
            : totalPercent < 0
            ? "text-red-600"
            : "text-gray-600"
        }`}
      >
        {`${totalPercent > 0 ? "+" : ""}${totalPercent.toFixed(2)}%`}
      </TableCell>
      <TableCell colSpan={4}></TableCell>
    </TableRow>
  );
}