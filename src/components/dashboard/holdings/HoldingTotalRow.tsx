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
  const hasGainAmounts = holdings.every(
    (h) => h.gain_amount != null && h.gain_amount !== ""
  );
  const totalRealized = hasGainAmounts
    ? holdings.reduce(
        (sum, holding) => sum + parseFloat(holding.gain_amount ?? "0"),
        0
      )
    : totalCurrent - totalInvested;
  const totalPercent =
    totalInvested > 0
      ? hasGainAmounts
        ? (totalRealized / totalInvested) * 100
        : ((totalCurrent - totalInvested) / totalInvested) * 100
      : 0;

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
    <TableRow className="bg-muted/50 border-t-2 border-border font-semibold">
      <TableCell colSpan={4} className="text-right font-bold text-foreground">
        <span className="flex items-center justify-end gap-2">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Total
        </span>
      </TableCell>
      <TableCell className="font-bold font-mono text-right text-sm">
        {hideValues ? maskValue() : formatCurrency(totalInvested, primaryCurrency, { showSymbol: false })}
      </TableCell>
      <TableCell className="font-bold font-mono text-right text-sm">
        {hideValues ? maskValue() : formatCurrency(totalCurrent, primaryCurrency, { showSymbol: false })}
      </TableCell>
      <TableCell
        className={`font-bold font-mono text-right text-sm ${
          hideValues
            ? ""
            : totalRealized > 0
            ? "text-emerald-600 dark:text-emerald-400"
            : totalRealized < 0
            ? "text-rose-600 dark:text-rose-400"
            : "text-muted-foreground"
        }`}
      >
        {hideValues
          ? maskValue()
          : `${totalRealized > 0 ? "+" : ""}${formatCurrency(Math.abs(totalRealized), primaryCurrency, { showSymbol: false })}`}
      </TableCell>
      <TableCell
        className={`font-bold text-right text-sm ${
          hideValues
            ? ""
            : totalPercent > 0
            ? "text-emerald-600 dark:text-emerald-400"
            : totalPercent < 0
            ? "text-rose-600 dark:text-rose-400"
            : "text-muted-foreground"
        }`}
      >
        {hideValues ? maskValue() : (
          <span className="inline-flex items-center gap-1">
            {totalPercent > 0 ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : totalPercent < 0 ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            ) : null}
            {Math.abs(totalPercent).toFixed(2)}%
          </span>
        )}
      </TableCell>
      <TableCell colSpan={2}></TableCell>
    </TableRow>
  );
}