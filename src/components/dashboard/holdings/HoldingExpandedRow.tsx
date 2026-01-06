import { TableCell, TableRow } from "@/components/ui/table";
import type { Holding } from "@/types/holding";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface HoldingExpandedRowProps {
  holding: Holding;
  hideValues?: boolean;
}

export default function HoldingExpandedRow({ holding, hideValues = false }: HoldingExpandedRowProps) {
  const maskValue = () => "••••••";

  return (
    <TableRow key={`${holding.id}-expanded`}>
      <TableCell colSpan={12} className="bg-muted/20 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <strong className="text-muted-foreground">Units:</strong>
            <div className="font-mono text-base">
              {hideValues
                ? maskValue()
                : holding.units
                ? formatNumber(holding.units, 4)
                : "-"}
            </div>
          </div>
          <div className="space-y-1">
            <strong className="text-muted-foreground">Avg Buy Price:</strong>
            <div className="font-mono text-base">
              {hideValues
                ? maskValue()
                : holding.avg_buy_price
                ? formatCurrency(holding.avg_buy_price, holding.currency, { showSymbol: false })
                : "-"}
            </div>
          </div>
          <div className="space-y-1">
            <strong className="text-muted-foreground">Current Price:</strong>
            <div className="font-mono text-base">
              {hideValues
                ? maskValue()
                : holding.current_price
                ? formatCurrency(holding.current_price, holding.currency, { showSymbol: false })
                : "-"}
            </div>
          </div>
          {holding.notes && (
            <div className="md:col-span-3 space-y-1">
              <strong className="text-muted-foreground">Notes:</strong>
              <div className="text-base">{holding.notes}</div>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}