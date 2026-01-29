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
      <div className="flex items-center whitespace-nowrap">
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
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Filter Tabs */}
      <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 space-y-3">
        {/* Main Filter Tabs: ALL, Platform, Type */}
        <Tabs value={filterType} onValueChange={handleFilterTypeChange}>
          <TabsList className="w-full sm:w-auto flex-wrap h-auto bg-muted/50 p-1">
            <TabsTrigger 
              value="all" 
              className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              All Holdings
            </TabsTrigger>
            <TabsTrigger 
              value="platform" 
              className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              By Platform
            </TabsTrigger>
            <TabsTrigger 
              value="type" 
              className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              By Type
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Sub-filters based on selected main filter */}
        {filterType === "platform" && uniquePlatforms.length > 0 && (
          <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <TabsList className="flex-wrap h-auto gap-1 w-full sm:w-auto bg-transparent p-0">
              <TabsTrigger 
                value="all" 
                className="text-xs sm:text-sm bg-muted/30 hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                All Platforms
              </TabsTrigger>
              {uniquePlatforms.map((platform) => (
                <TabsTrigger 
                  key={platform} 
                  value={platform} 
                  className="text-xs sm:text-sm bg-muted/30 hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {platform}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {filterType === "type" && uniqueTypes.length > 0 && (
          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="flex-wrap h-auto gap-1 w-full sm:w-auto bg-transparent p-0">
              <TabsTrigger 
                value="all" 
                className="text-xs sm:text-sm bg-muted/30 hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                All Types
              </TabsTrigger>
              {uniqueTypes.map((type) => (
                <TabsTrigger 
                  key={type.id} 
                  value={type.id.toString()} 
                  className="text-xs sm:text-sm bg-muted/30 hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {type.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* Filter Summary */}
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{sortedHoldings.length}</span>
            {" "}of{" "}
            <span className="font-medium text-foreground">{holdings.length}</span>
            {" "}holdings
            {filterType !== "all" && (
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Filtered
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/50 border-b-2">
              <TableHead className="w-10 sm:w-12 font-semibold text-xs sm:text-sm text-center">#</TableHead>
              <HeaderCell label="Name" columnKey="name" className="text-xs sm:text-sm min-w-[140px]" />
              <HeaderCell label="Platform" columnKey="platform" className="text-xs sm:text-sm" />
              <HeaderCell label="Type" columnKey="holding_type" className="text-xs sm:text-sm" />
              <HeaderCell label="Invested" columnKey="invested_amount" className="text-xs sm:text-sm text-right" />
              <HeaderCell label="Current" columnKey="current_value" className="text-xs sm:text-sm text-right" />
              <HeaderCell label="P/L" columnKey="realized_value" className="text-xs sm:text-sm text-right" />
              <HeaderCell label="Return" columnKey="realized_percent" className="text-xs sm:text-sm text-right" />
              <TableHead className="w-10 text-center"></TableHead>
              <TableHead className="w-20 sm:w-24 font-semibold text-xs sm:text-sm text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-muted/30">
                  <TableCell><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16 mx-auto" /></TableCell>
                </TableRow>
              ))
            ) : sortedHoldings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">No holdings found</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Try another month/year or add a new holding
                      </p>
                    </div>
                  </div>
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
    </div>
  );
}
