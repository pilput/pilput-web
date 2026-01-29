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
    <TableRow key={`${holding.id}-expanded`} className="bg-muted/20 hover:bg-muted/20">
      <TableCell colSpan={10} className="p-0">
        <div className="p-4 border-t border-border/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Currency */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Currency
              </div>
              <div className="font-semibold text-sm bg-background/50 inline-flex px-2 py-0.5 rounded">
                {holding.currency}
              </div>
            </div>

            {/* Units */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                Units
              </div>
              <div className="font-mono text-sm">
                {hideValues
                  ? maskValue()
                  : holding.units
                  ? formatNumber(holding.units, 4)
                  : <span className="text-muted-foreground italic">Not set</span>}
              </div>
            </div>

            {/* Avg Buy Price */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Avg Buy Price
              </div>
              <div className="font-mono text-sm">
                {hideValues
                  ? maskValue()
                  : holding.avg_buy_price
                  ? formatCurrency(holding.avg_buy_price, holding.currency, { showSymbol: false })
                  : <span className="text-muted-foreground italic">Not set</span>}
              </div>
            </div>

            {/* Current Price */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                Current Price
              </div>
              <div className="font-mono text-sm">
                {hideValues
                  ? maskValue()
                  : holding.current_price
                  ? formatCurrency(holding.current_price, holding.currency, { showSymbol: false })
                  : <span className="text-muted-foreground italic">Not set</span>}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {holding.notes && (
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Notes</span>
                  <p className="text-sm text-foreground leading-relaxed">{holding.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}