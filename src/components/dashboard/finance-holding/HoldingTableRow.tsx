import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Holding } from "@/types/holding";
import HoldingActionComponent from "./action";
import HoldingExpandedRow from "./HoldingExpandedRow";

interface HoldingTableRowProps {
  holding: Holding;
  expandedRows: Set<bigint>;
  toggleExpand: (id: bigint) => void;
  onEdit: (holding: Holding) => void;
}

export default function HoldingTableRow({
  holding,
  expandedRows,
  toggleExpand,
  onEdit,
}: HoldingTableRowProps) {
  const invested = parseFloat(holding.invested_amount);
  const current = parseFloat(holding.current_value);
  const realized = current - invested;
  const percent = invested > 0 ? ((current - invested) / invested) * 100 : 0;

  const mainRow = (
    <TableRow key={holding.id.toString()} className="hover:bg-muted/50">
      <TableCell className="font-medium">{holding.name}</TableCell>
      <TableCell>{holding.platform}</TableCell>
      <TableCell>
        <Badge variant="secondary">{holding.holding_types.name}</Badge>
      </TableCell>
      <TableCell>{holding.currency}</TableCell>
      <TableCell>{invested.toLocaleString()}</TableCell>
      <TableCell>{current.toLocaleString()}</TableCell>
      <TableCell
        className={
          realized > 0
            ? "text-green-600 font-medium"
            : realized < 0
            ? "text-red-600 font-medium"
            : "text-gray-600"
        }
      >
        {realized.toLocaleString()}
      </TableCell>
      <TableCell
        className={
          percent > 0
            ? "text-green-600 font-medium"
            : percent < 0
            ? "text-red-600 font-medium"
            : "text-gray-600"
        }
      >
        {`${percent > 0 ? "+" : ""}${percent.toFixed(2)}%`}
      </TableCell>
      <TableCell>{holding.month}</TableCell>
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
        <HoldingActionComponent
          holding={holding}
          onEdit={onEdit}
        />
      </TableCell>
    </TableRow>
  );

  const expandedRow = expandedRows.has(holding.id) ? (
    <HoldingExpandedRow holding={holding} />
  ) : null;

  return (
    <>
      {mainRow}
      {expandedRow}
    </>
  );
}
