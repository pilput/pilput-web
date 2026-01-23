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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type FilterType = "all" | "platform" | "type";

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
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Get unique platforms and types from holdings
  const uniquePlatforms = useMemo(() => {
    const platforms = [...new Set(holdings.map((h) => h.platform))];
    return platforms.sort((a, b) => a.localeCompare(b));
  }, [holdings]);

  const uniqueTypes = useMemo(() => {
    const types = holdings.reduce((acc, h) => {
      if (!acc.find((t) => t.id === h.holding_type.id)) {
        acc.push({ id: h.holding_type.id, name: h.holding_type.name });
      }
      return acc;
    }, [] as { id: number; name: string }[]);
    return types.sort((a, b) => a.name.localeCompare(b.name));
  }, [holdings]);

  const handleSort = (column: string) => {
    setSortConfig((current) => ({
      key: column,
      direction:
        current.key === column && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter holdings based on selected filter
  const filteredHoldings = useMemo(() => {
    if (filterType === "platform" && selectedPlatform !== "all") {
      return holdings.filter((h) => h.platform === selectedPlatform);
    }
    if (filterType === "type" && selectedType !== "all") {
      return holdings.filter((h) => h.holding_type.id.toString() === selectedType);
    }
    return holdings;
  }, [holdings, filterType, selectedPlatform, selectedType]);

  const sortedHoldings = useMemo(() => {
    const sorted = [...filteredHoldings];
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
        aValue =
          aInv > 0 ? ((parseFloat(a.current_value) - aInv) / aInv) * 100 : 0;
        bValue =
          bInv > 0 ? ((parseFloat(b.current_value) - bInv) / bInv) * 100 : 0;
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
  }, [filteredHoldings, sortConfig]);

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column)
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const HeaderCell = ({
    label,
    columnKey,
    className = "",
  }: {
    label: string;
    columnKey: string;
    className?: string;
  }) => (
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

  const handleFilterTypeChange = (value: string) => {
    setFilterType(value as FilterType);
    // Reset sub-filters when changing main filter type
    if (value === "all") {
      setSelectedPlatform("all");
      setSelectedType("all");
    }
  };

  return (
    <div>
      {/* Filter Tabs */}
      <div className="p-4 border-b bg-muted/20 space-y-3">
        {/* Main Filter Tabs: ALL, Platform, Type */}
        <Tabs value={filterType} onValueChange={handleFilterTypeChange}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="platform">By Platform</TabsTrigger>
            <TabsTrigger value="type">By Type</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Sub-filters based on selected main filter */}
        {filterType === "platform" && uniquePlatforms.length > 0 && (
          <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="all">All Platforms</TabsTrigger>
              {uniquePlatforms.map((platform) => (
                <TabsTrigger key={platform} value={platform}>
                  {platform}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {filterType === "type" && uniqueTypes.length > 0 && (
          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="all">All Types</TabsTrigger>
              {uniqueTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id.toString()}>
                  {type.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* Filter Summary */}
        {(filterType !== "all" || sortedHoldings.length !== holdings.length) && (
          <p className="text-sm text-muted-foreground">
            Showing {sortedHoldings.length} of {holdings.length} holdings
          </p>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/60">
            <TableHead className="w-16 font-semibold">#</TableHead>
            <HeaderCell label="Name" columnKey="name" />
            <HeaderCell label="Platform" columnKey="platform" />
            <HeaderCell label="Type" columnKey="holding_type" />
            <HeaderCell label="Invested Amount" columnKey="invested_amount" />
            <HeaderCell label="Current Value" columnKey="current_value" />
            <HeaderCell label="Realized Value" columnKey="realized_value" />
            <HeaderCell label="Realized %" columnKey="realized_percent" />
            <TableHead className="w-12.5"></TableHead>
            <TableHead className="w-30 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-muted/50">
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-37.5" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-25" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-25" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-25" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-25" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-25" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-5" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-20" />
                </TableCell>
              </TableRow>
            ))
          ) : sortedHoldings.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center text-muted-foreground py-10"
              >
                No holdings found for this period. Try another month/year or add
                a holding.
              </TableCell>
            </TableRow>
          ) : (
            <>
              {sortedHoldings.map((holding, index) => (
                <HoldingTableRow
                  key={holding.id.toString()}
                  holding={holding}
                  index={index + 1}
                  expandedRows={expandedRows}
                  toggleExpand={toggleExpand}
                  onEdit={onEdit}
                  hideValues={hideValues}
                />
              ))}
              <HoldingTotalRow
                holdings={sortedHoldings}
                hideValues={hideValues}
              />
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
