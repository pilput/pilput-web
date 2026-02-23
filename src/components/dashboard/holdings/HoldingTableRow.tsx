import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Holding } from "@/types/holding";
import HoldingActionComponent from "./action";
import HoldingExpandedRow from "./HoldingExpandedRow";
import { formatCurrency, getPlatformColor, getHoldingTypeColor, cn } from "@/lib/utils";

interface HoldingTableRowProps {
  holding: Holding;
  index: number;
  expandedRows: Set<bigint>;
  toggleExpand: (id: bigint) => void;
  onEdit: (holding: Holding) => void;
  hideValues?: boolean;
}

export default function HoldingTableRow({
  holding,
  index,
  expandedRows,
  toggleExpand,
  onEdit,
  hideValues = false,
}: HoldingTableRowProps) {
  const invested = parseFloat(holding.invested_amount);
  const current = parseFloat(holding.current_value);
  const realized =
    holding.gain_amount != null && holding.gain_amount !== ""
      ? parseFloat(holding.gain_amount)
      : current - invested;
  const percent =
    holding.gain_percent != null && holding.gain_percent !== ""
      ? parseFloat(holding.gain_percent)
      : invested > 0
        ? ((current - invested) / invested) * 100
        : 0;

  const maskValue = () => "••••••";

  const mainRow = (
    <TableRow 
      key={holding.id.toString()} 
      className="group hover:bg-muted/40 transition-colors border-b border-border/50"
    >
      <TableCell className="text-muted-foreground font-medium text-center w-10">{index}</TableCell>
      <TableCell className="font-medium min-w-[140px]">
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{holding.name}</span>
          {holding.notes && (
            <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">
              {holding.notes}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="secondary"
          className={`${getPlatformColor(holding.platform)} rounded-md font-bold uppercase tracking-wider text-[9px] sm:text-[10px] px-2 py-0.5 border shadow-sm`}
        >
          {holding.platform}
        </Badge>
      </TableCell>
      <TableCell>
        <span className={cn("font-medium text-[10px] sm:text-xs", getHoldingTypeColor(holding.holding_type.name))}>
          {holding.holding_type.name}
        </span>
      </TableCell>
      <TableCell className="font-mono text-right text-sm">
        {hideValues ? maskValue() : formatCurrency(invested, holding.currency, { showSymbol: false })}
      </TableCell>
      <TableCell className="font-mono text-right text-sm">
        {hideValues ? maskValue() : formatCurrency(current, holding.currency, { showSymbol: false })}
      </TableCell>
      <TableCell
        className={`font-mono text-right text-sm ${
          hideValues
            ? ""
            : realized > 0
            ? "text-emerald-600 dark:text-emerald-400 font-semibold"
            : realized < 0
            ? "text-rose-600 dark:text-rose-400 font-semibold"
            : "text-muted-foreground"
        }`}
      >
        {hideValues
          ? maskValue()
          : `${realized > 0 ? "+" : ""}${formatCurrency(Math.abs(realized), holding.currency, { showSymbol: false })}`}
      </TableCell>
      <TableCell
        className={`text-right text-sm font-medium ${
          hideValues
            ? ""
            : percent > 0
            ? "text-emerald-600 dark:text-emerald-400"
            : percent < 0
            ? "text-rose-600 dark:text-rose-400"
            : "text-muted-foreground"
        }`}
      >
        {hideValues ? maskValue() : (
          <span className="inline-flex items-center gap-1">
            {percent > 0 ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : percent < 0 ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            ) : null}
            {Math.abs(percent).toFixed(2)}%
          </span>
        )}
      </TableCell>
      <TableCell className="text-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-muted"
          onClick={() => toggleExpand(holding.id)}
        >
          {expandedRows.has(holding.id) ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </TableCell>
      <TableCell className="text-center">
        <HoldingActionComponent holding={holding} onEdit={onEdit} />
      </TableCell>
    </TableRow>
  );

  const expandedRow = expandedRows.has(holding.id) ? (
    <HoldingExpandedRow holding={holding} hideValues={hideValues} />
  ) : null;

  return (
    <>
      {mainRow}
      {expandedRow}
    </>
  );
}
