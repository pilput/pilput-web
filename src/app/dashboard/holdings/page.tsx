"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import HoldingHeader from "@/components/dashboard/holdings/HoldingHeader";
import HoldingFormModal from "@/components/dashboard/holdings/HoldingFormModal";
import HoldingTable from "@/components/dashboard/holdings/HoldingTable";
import HoldingDuplicateModal from "@/components/dashboard/holdings/HoldingDuplicateModal";
import HoldingFilter from "@/components/dashboard/holdings/HoldingFilter";
import HoldingSummaryCards from "@/components/dashboard/holdings/HoldingSummaryCards";
import { useHoldingsStore } from "@/stores/holdingsStore";
import type { Holding } from "@/types/holding";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PlusCircle,
  Copy,
  Eye,
  EyeOff,
  Download,
} from "lucide-react";

const DEFAULT_CURRENCY = "IDR";

type HeaderActionsProps = {
  hideValues: boolean;
  onToggleHide: () => void;
  onOpenDuplicate: () => void;
  onOpenAdd: () => void;
  onExportCsv: () => void;
  canExport: boolean;
};

const HeaderActions = ({
  hideValues,
  onToggleHide,
  onOpenDuplicate,
  onOpenAdd,
  onExportCsv,
  canExport,
}: HeaderActionsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="shrink-0"
        onClick={onToggleHide}
        title={hideValues ? "Show values" : "Hide values"}
        aria-label={hideValues ? "Show values" : "Hide values"}
      >
        {hideValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm" 
        onClick={onOpenDuplicate}
      >
        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Duplicate</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
        onClick={onExportCsv}
        disabled={!canExport}
      >
        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Export CSV</span>
      </Button>
      <Button 
        size="sm"
        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold" 
        onClick={onOpenAdd}
      >
        <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden xs:inline sm:inline">Add Holding</span>
        <span className="xs:hidden">Add</span>
      </Button>
    </div>
  );
};

export default function HoldingsPage() {
  const {
    holdings,
    holdingTypes,
    isLoading,
    expandedRows,
    fetchHoldings,
    fetchHoldingTypes,
    toggleExpand,
    duplicateHoldings,
  } = useHoldingsStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);
  
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [hideValues, setHideValues] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hideHoldingValues");
      return saved === "true";
    }
    return false;
  });

  const [formData, setFormData] = useState(() => ({
    name: "",
    platform: "",
    holding_type_id: "",
    currency: DEFAULT_CURRENCY,
    invested_amount: "",
    current_value: "",
    units: "",
    avg_buy_price: "",
    current_price: "",
    month: filterMonth,
    year: filterYear,
    notes: "",
  }));

  useEffect(() => {
    fetchHoldings();
    fetchHoldingTypes();
  }, [fetchHoldings, fetchHoldingTypes]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hideHoldingValues", hideValues.toString());
    }
  }, [hideValues]);

  const openAddModal = useCallback(() => {
    setEditingHolding(null);
    setFormData({
      name: "",
      platform: "",
      holding_type_id: "",
      currency: DEFAULT_CURRENCY,
      invested_amount: "",
      current_value: "",
      units: "",
      avg_buy_price: "",
      current_price: "",
      month: filterMonth,
      year: filterYear,
      notes: "",
    });
    setModalOpen(true);
  }, [filterMonth, filterYear]);

  const openDuplicateModal = useCallback(() => {
    setDuplicateOpen(true);
  }, []);

  const openEditModal = useCallback((holding: Holding) => {
    // Check if this is a duplicate (id = 0) - treat as new holding
    const isDuplicate = holding.id === BigInt(0);
    setEditingHolding(isDuplicate ? null : holding);
    setFormData({
      name: holding.name,
      platform: holding.platform,
      holding_type_id: holding.holding_type_id.toString(),
      currency: holding.currency,
      invested_amount: holding.invested_amount,
      current_value: holding.current_value,
      units: holding.units || "",
      avg_buy_price: holding.avg_buy_price || "",
      current_price: holding.current_price || "",
      month: holding.month.toString(),
      year: holding.year.toString(),
      notes: holding.notes || "",
    });
    setModalOpen(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        holding_type_id: parseInt(formData.holding_type_id, 10),
        invested_amount: parseFloat(formData.invested_amount),
        current_value: parseFloat(formData.current_value),
        units: formData.units ? parseFloat(formData.units) : null,
        avg_buy_price: formData.avg_buy_price ? parseFloat(formData.avg_buy_price) : null,
        current_price: formData.current_price ? parseFloat(formData.current_price) : null,
        month: parseInt(formData.month, 10),
        year: parseInt(formData.year, 10),
      };

      if (editingHolding) {
        await useHoldingsStore
          .getState()
          .updateHolding(editingHolding.id, payload);
      } else {
        await useHoldingsStore.getState().addHolding(payload);
      }

      setModalOpen(false);
    } catch (error) {
      // Error handling is done in the store
    }
  }

  async function handleDuplicateSubmit(data: {
    fromMonth: number;
    fromYear: number;
    toMonth: number;
    toYear: number;
    overwrite: boolean;
  }) {
    try {
      await duplicateHoldings(data);
      setDuplicateOpen(false);
    } catch (error) {
      // Error handling is done in the store
    }
  }

  const handleFilter = useCallback(
    async (monthOverride?: number, yearOverride?: number) => {
      const month = monthOverride ?? parseInt(filterMonth, 10);
      const year = yearOverride ?? parseInt(filterYear, 10);
      await fetchHoldings({ month, year });
    },
    [fetchHoldings, filterMonth, filterYear]
  );

  const filteredHoldings = useMemo(() => {
    const month = parseInt(filterMonth, 10);
    const year = parseInt(filterYear, 10);
    return holdings.filter((holding) => holding.month === month && holding.year === year);
  }, [filterMonth, filterYear, holdings]);

  const handleExportCsv = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const escapeCsv = (value: string) => {
      if (value.includes('"') || value.includes(",") || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const rows = [
      [
        "id",
        "name",
        "platform",
        "holding_type",
        "currency",
        "invested_amount",
        "current_value",
        "units",
        "avg_buy_price",
        "current_price",
        "month",
        "year",
        "notes",
        "last_updated",
      ],
      ...filteredHoldings.map((holding) => [
        holding.id.toString(),
        holding.name,
        holding.platform,
        holding.holding_type?.name ?? "",
        holding.currency,
        holding.invested_amount,
        holding.current_value,
        holding.units ?? "",
        holding.avg_buy_price ?? "",
        holding.current_price ?? "",
        holding.month.toString(),
        holding.year.toString(),
        holding.notes ?? "",
        holding.last_updated ?? "",
      ]),
    ];

    const csv = rows.map((row) => row.map((cell) => escapeCsv(String(cell))).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const paddedMonth = filterMonth.padStart(2, "0");
    link.href = url;
    link.download = `holdings-${filterYear}-${paddedMonth}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filterMonth, filterYear, filteredHoldings]);

  return (
    <div className="container mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <HoldingHeader />
          <HeaderActions
            hideValues={hideValues}
            onToggleHide={() => setHideValues(!hideValues)}
            onOpenDuplicate={openDuplicateModal}
            onOpenAdd={openAddModal}
            onExportCsv={handleExportCsv}
            canExport={!isLoading && filteredHoldings.length > 0}
          />
        </div>

        {/* Filter Section */}
        <div className="bg-card p-3 sm:p-4 rounded-lg border shadow-sm">
          <HoldingFilter
            month={filterMonth}
            year={filterYear}
            onMonthChange={setFilterMonth}
            onYearChange={setFilterYear}
            onFilter={handleFilter}
          />
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        <div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight mb-3 sm:mb-4 px-1">
            Portfolio Summary
          </h2>
          <HoldingSummaryCards holdings={holdings} isLoading={isLoading} hideValues={hideValues} />
        </div>
      </div>

      {/* Holdings Table Card */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/10 pb-3 sm:pb-4 px-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg">Holdings Inventory</CardTitle>
              <CardDescription className="mt-1 text-xs sm:text-sm">
                Review your investment performance for the selected period.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <HoldingTable
              holdings={holdings}
              isLoading={isLoading}
              expandedRows={expandedRows}
              toggleExpand={toggleExpand}
              onEdit={openEditModal}
              hideValues={hideValues}
            />
          </div>
        </CardContent>
      </Card>

      <HoldingFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingHolding={editingHolding}
        formData={formData}
        setFormData={setFormData}
        holdingTypes={holdingTypes}
        onSubmit={handleSubmit}
      />

      <HoldingDuplicateModal
        open={duplicateOpen}
        onOpenChange={setDuplicateOpen}
        onDuplicate={handleDuplicateSubmit}
      />
    </div>
  );
}
