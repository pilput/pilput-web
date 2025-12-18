import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Holding } from "@/types/holding";
import HoldingTableRow from "./HoldingTableRow";
import HoldingTotalRow from "./HoldingTotalRow";

interface HoldingTableProps {
  holdings: Holding[];
  isLoading: boolean;
  expandedRows: Set<bigint>;
  toggleExpand: (id: bigint) => void;
  onEdit: (holding: Holding) => void;
}

export default function HoldingTable({
  holdings,
  isLoading,
  expandedRows,
  toggleExpand,
  onEdit,
}: HoldingTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/60">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Platform</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Currency</TableHead>
            <TableHead className="font-semibold">Invested Amount</TableHead>
            <TableHead className="font-semibold">Current Value</TableHead>
            <TableHead className="font-semibold">Realized Value</TableHead>
            <TableHead className="font-semibold">Realized %</TableHead>
            <TableHead className="font-semibold">Month</TableHead>
            <TableHead className="font-semibold">Year</TableHead>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[120px] font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-muted/50">
                <TableCell>
                  <Skeleton className="h-4 w-[150px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[50px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[50px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[50px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[20px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-[80px]" />
                </TableCell>
              </TableRow>
            ))
          ) : holdings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center text-muted-foreground py-10">
                No holdings found for this period. Try another month/year or add a holding.
              </TableCell>
            </TableRow>
          ) : (
            <>
              {holdings.map((holding) => (
                <HoldingTableRow
                  key={holding.id.toString()}
                  holding={holding}
                  expandedRows={expandedRows}
                  toggleExpand={toggleExpand}
                  onEdit={onEdit}
                />
              ))}
              <HoldingTotalRow holdings={holdings} />
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}