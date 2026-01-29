import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Holding } from "@/types/holding";
import HoldingActionComponent from "./action";
import HoldingExpandedRow from "./HoldingExpandedRow";
import { formatCurrency } from "@/lib/utils";

function getHoldingTypeColor(typeName: string) {
  const colors: Record<string, string> = {
    // Financial Instruments
    Stock: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
    Crypto: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800",
    Bond: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
    ETF: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800",
    "Mutual Fund": "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800",
    
    // Commodities & Physical Assets
    Commodity: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
    Gold: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800/50",
    Silver: "bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    "Real Estate": "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800",
    
    // Cash & Equivalents
    Cash: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800",
    Savings: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-800",
    Deposit: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800",
    Deposito: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800",
    
    // Retirement & Long-term
    Pension: "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900/40 dark:text-stone-300 dark:border-stone-800",
    Insurance: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800",
    
    // Alternative & Specialized
    Collectibles: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-800",
    Venture: "bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-900/40 dark:text-lime-300 dark:border-lime-800",
    "Private Equity": "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-800",
    Debt: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800",
  };

  const normalizedTypeName = typeName.trim();
  return colors[normalizedTypeName] || "bg-secondary text-secondary-foreground";
}

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
  const realized = current - invested;
  const percent = invested > 0 ? ((current - invested) / invested) * 100 : 0;

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
        <span className="text-sm text-muted-foreground">{holding.platform}</span>
      </TableCell>
      <TableCell>
        <Badge 
          variant="secondary"
          className={`${getHoldingTypeColor(holding.holding_type.name)} font-medium text-[10px] sm:text-xs px-2 py-0.5`}
        >
          {holding.holding_type.name}
        </Badge>
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
