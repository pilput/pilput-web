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
    Stock: "bg-blue-100 text-blue-800 border-blue-200",
    Crypto: "bg-orange-100 text-orange-800 border-orange-200",
    Bond: "bg-green-100 text-green-800 border-green-200",
    ETF: "bg-purple-100 text-purple-800 border-purple-200",
    "Mutual Fund": "bg-indigo-100 text-indigo-800 border-indigo-200",
    Commodity: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Gold: "bg-yellow-400 text-yellow-900 border-yellow-500",
    "Real Estate": "bg-red-100 text-red-800 border-red-200",
    Cash: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return colors[typeName] || "bg-secondary text-secondary-foreground";
}

interface HoldingTableRowProps {
  holding: Holding;
  expandedRows: Set<bigint>;
  toggleExpand: (id: bigint) => void;
  onEdit: (holding: Holding) => void;
  hideValues?: boolean;
}

export default function HoldingTableRow({
  holding,
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
    <TableRow key={holding.id.toString()} className="hover:bg-muted/50">
      <TableCell className="font-medium">{holding.name}</TableCell>
      <TableCell>{holding.platform}</TableCell>
      <TableCell>
        <Badge className={getHoldingTypeColor(holding.holding_type.name)}>
          {holding.holding_type.name}
        </Badge>
      </TableCell>
      <TableCell className="font-medium">{holding.currency}</TableCell>
      <TableCell className="font-mono">
        {hideValues ? maskValue() : formatCurrency(invested, holding.currency, { showSymbol: false })}
      </TableCell>
      <TableCell className="font-mono">
        {hideValues ? maskValue() : formatCurrency(current, holding.currency, { showSymbol: false })}
      </TableCell>
      <TableCell
        className={`font-mono ${
          hideValues
            ? ""
            : realized > 0
            ? "text-green-600 font-medium"
            : realized < 0
            ? "text-red-600 font-medium"
            : "text-gray-600"
        }`}
      >
        {hideValues
          ? maskValue()
          : `${realized > 0 ? "+" : ""}${formatCurrency(Math.abs(realized), holding.currency, { showSymbol: false })}`}
      </TableCell>
      <TableCell
        className={
          hideValues
            ? ""
            : percent > 0
            ? "text-green-600 font-medium"
            : percent < 0
            ? "text-red-600 font-medium"
            : "text-gray-600"
        }
      >
        {hideValues ? maskValue() : `${percent > 0 ? "+" : ""}${percent.toFixed(2)}%`}
      </TableCell>
      <TableCell>
        {new Date(holding.year, holding.month - 1).toLocaleString("en-US", {
          month: "short",
        })}
      </TableCell>
      <TableCell>{holding.year}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleExpand(holding.id)}
        >
          {expandedRows.has(holding.id) ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </TableCell>
      <TableCell>
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
