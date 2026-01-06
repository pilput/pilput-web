import { TableCell, TableRow } from "@/components/ui/table";
import type { Holding } from "@/types/holding";

interface HoldingExpandedRowProps {
  holding: Holding;
  hideValues?: boolean;
}

export default function HoldingExpandedRow({ holding, hideValues = false }: HoldingExpandedRowProps) {
  const maskValue = () => "••••••";

  return (
    <TableRow key={`${holding.id}-expanded`}>
      <TableCell colSpan={12} className="bg-muted/20 p-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <strong>Units:</strong>{" "}
            {hideValues
              ? maskValue()
              : holding.units
              ? parseFloat(holding.units as string).toLocaleString()
              : "-"}
          </div>
          <div>
            <strong>Avg Buy Price:</strong>{" "}
            {hideValues
              ? maskValue()
              : holding.avg_buy_price
              ? parseFloat(holding.avg_buy_price as string).toLocaleString()
              : "-"}
          </div>
          <div>
            <strong>Current Price:</strong>{" "}
            {hideValues
              ? maskValue()
              : holding.current_price
              ? parseFloat(holding.current_price as string).toLocaleString()
              : "-"}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}