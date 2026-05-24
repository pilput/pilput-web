"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { holdingFormSchema } from "@/lib/validation";
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
  RefreshCw,
} from "lucide-react";

const DEFAULT_CURRENCY = "IDR";

type HeaderActionsProps = {
  hideValues: boolean;
  onToggleHide: () => void;
  onOpenDuplicate: () => void;
  onOpenAdd: () => void;
  onExportCsv: () => void;
  canExport: boolean;
  onSyncPrices: () => void;
  isSyncing: boolean;
};

const HeaderActions = ({
  hideValues,
  onToggleHide,
  onOpenDuplicate,
  onOpenAdd,
  onExportCsv,
  canExport,
  onSyncPrices,
  isSyncing,
}: HeaderActionsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center gap-1 rounded-xl border border-border/60 bg-card/60 p-1 shadow-sm dark:bg-muted/20">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs sm:text-sm hover:bg-muted/80 rounded-lg transition-colors"
          onClick={onSyncPrices}
          disabled={isSyncing}
          title="Fetch latest prices for holdings with symbols (current calendar month)"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`}
          />
          <span className="hidden md:inline">Sync</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs sm:text-sm hover:bg-muted/80 rounded-lg transition-colors"
          onClick={onOpenDuplicate}
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Duplicate</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs sm:text-sm hover:bg-muted/80 rounded-lg transition-colors"
          onClick={onExportCsv}
          disabled={!canExport}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Export</span>
        </Button>
        <div className="mx-0.5 h-5 w-px bg-border/70" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 hover:bg-muted/80 rounded-lg transition-colors"
          onClick={onToggleHide}
          title={hideValues ? "Show values" : "Hide values"}
          aria-label={hideValues ? "Show values" : "Hide values"}
        >
          {hideValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>
      <Button
        size="sm"
        className="h-9 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold shadow-sm"
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
    summary,
    isLoading,
    isSyncing,
    expandedRows,
    fetchHoldings,
    fetchHoldingTypes,
    syncHoldings,
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
    symbol: "",
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
      symbol: "",
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
    const isDuplicate = holding.id === 0;
    setEditingHolding(isDuplicate ? null : holding);
    setFormData({
      name: holding.name,
      symbol: holding.symbol || "",
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

    const result = holdingFormSchema.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.issues[0];
      toast.error(firstError?.message ?? "Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        symbol: formData.symbol?.trim() || null,
        platform: formData.platform,
        holding_type_id: parseInt(formData.holding_type_id, 10),
        currency: formData.currency,
        invested_amount: formData.invested_amount,
        current_value: formData.current_value,
        units: formData.units?.trim() || null,
        avg_buy_price: formData.avg_buy_price?.trim() || null,
        current_price: formData.current_price?.trim() || null,
        month: parseInt(formData.month, 10),
        year: parseInt(formData.year, 10),
        notes: formData.notes?.trim() || null,
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

  const handleSyncPrices = useCallback(async () => {
    try {
      await syncHoldings();
    } catch {
      // Toasts handled in store
    }
  }, [syncHoldings]);

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
        "symbol",
        "platform",
        "holding_type",
        "currency",
        "invested_amount",
        "current_value",
        "gain_amount",
        "gain_percent",
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
        holding.symbol ?? "",
        holding.platform,
        holding.holding_type?.name ?? "",
        holding.currency,
        holding.invested_amount,
        holding.current_value,
        holding.gain_amount ?? "",
        holding.gain_percent ?? "",
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

  const activeMonth = parseInt(filterMonth, 10);
  const activeYear = parseInt(filterYear, 10);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <HoldingHeader month={activeMonth} year={activeYear} />
          <HeaderActions
            hideValues={hideValues}
            onToggleHide={() => setHideValues(!hideValues)}
            onOpenDuplicate={openDuplicateModal}
            onOpenAdd={openAddModal}
            onExportCsv={handleExportCsv}
            canExport={!isLoading && filteredHoldings.length > 0}
            onSyncPrices={handleSyncPrices}
            isSyncing={isSyncing}
          />
        </div>

        {/* Filter Section */}
        <div className="rounded-xl border border-border/70 bg-card/60 px-3 py-2.5 sm:px-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-muted/20 dark:shadow-none">
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
      <section>
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            Portfolio Summary
          </h2>
          <div className="flex-1 h-px bg-border/50" />
        </div>
        <HoldingSummaryCards
          holdings={holdings}
          summary={summary}
          isLoading={isLoading}
          hideValues={hideValues}
        />
      </section>

      {/* Holdings Table Card */}
      <Card className="glass-card border-glow-hover shadow-premium rounded-2xl overflow-hidden transition-all duration-300">
        <CardHeader className="border-b border-border/60 py-5 px-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg font-semibold tracking-tight">
                Holdings Inventory
              </CardTitle>
              <CardDescription className="mt-1 text-xs sm:text-sm text-muted-foreground/90">
                {filteredHoldings.length === 0
                  ? "No holdings for the selected period yet."
                  : `${filteredHoldings.length} holding${filteredHoldings.length === 1 ? "" : "s"} tracked for this period.`}
              </CardDescription>
            </div>
            {filteredHoldings.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live view
              </span>
            )}
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
