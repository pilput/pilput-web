import { useState, useMemo } from "react";
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
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface HoldingTableProps {
  holdings: Holding[];
  isLoading: boolean;
  expandedRows: Set<bigint>;
  toggleExpand: (id: bigint) => void;
  onEdit: (holding: Holding) => void;
  hideValues?: boolean;
}

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
};

export default function HoldingTable({
  holdings,
  isLoading,
  expandedRows,
  toggleExpand,
  onEdit,
  hideValues = false,
}: HoldingTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });

  const handleSort = (column: string) => {
    setSortConfig((current) => ({
      key: column,
      direction:
        current.key === column && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedHoldings = useMemo(() => {
    const sorted = [...holdings];
    return sorted.sort((a, b) => {
      const { key, direction } = sortConfig;
      let aValue: any;
      let bValue: any;

      if (key === "holding_type") {
        aValue = a.holding_type.name;
        bValue = b.holding_type.name;
      } else if (key === "realized_value") {
        aValue = parseFloat(a.current_value) - parseFloat(a.invested_amount);
        bValue = parseFloat(b.current_value) - parseFloat(b.invested_amount);
      } else if (key === "realized_percent") {
        const aInv = parseFloat(a.invested_amount);
        const bInv = parseFloat(b.invested_amount);
        aValue = aInv > 0 ? ((parseFloat(a.current_value) - aInv) / aInv) * 100 : 0;
        bValue = bInv > 0 ? ((parseFloat(b.current_value) - bInv) / bInv) * 100 : 0;
      } else {
        aValue = a[key as keyof Holding];
        bValue = b[key as keyof Holding];
      }

      // Handle numeric strings for base fields
      if (key === "invested_amount" || key === "current_value") {
        aValue = parseFloat(aValue as string) || 0;
        bValue = parseFloat(bValue as string) || 0;
      }

      // Handle strings (case-insensitive)
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle numbers
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [holdings, sortConfig]);

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column)
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const HeaderCell = ({ label, columnKey, className = "" }: { label: string; columnKey: string; className?: string }) => (
    <TableHead
      className={`font-semibold cursor-pointer hover:text-foreground transition-colors ${className}`}
      onClick={() => handleSort(columnKey)}
    >
      <div className="flex items-center">
        {label}
        <SortIcon column={columnKey} />
      </div>
    </TableHead>
  );

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/60">
            <HeaderCell label="Name" columnKey="name" />
            <HeaderCell label="Platform" columnKey="platform" />
            <HeaderCell label="Type" columnKey="holding_type" />
            <HeaderCell label="Currency" columnKey="currency" />
            <HeaderCell label="Invested Amount" columnKey="invested_amount" />
            <HeaderCell label="Current Value" columnKey="current_value" />
            <HeaderCell label="Realized Value" columnKey="realized_value" />
            <HeaderCell label="Realized %" columnKey="realized_percent" />
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
                  <Skeleton className="h-4 w-[20px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-[80px]" />
                </TableCell>
              </TableRow>
            ))
          ) : sortedHoldings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground py-10">
                No holdings found for this period. Try another month/year or add a holding.
              </TableCell>
            </TableRow>
          ) : (
            <>
              {sortedHoldings.map((holding) => (
                <HoldingTableRow
                  key={holding.id.toString()}
                  holding={holding}
                  expandedRows={expandedRows}
                  toggleExpand={toggleExpand}
                  onEdit={onEdit}
                  hideValues={hideValues}
                />
              ))}
              <HoldingTotalRow holdings={sortedHoldings} hideValues={hideValues} />
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}