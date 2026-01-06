"use client";

import { useEffect, useState } from "react";
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
import { PlusCircle, Copy, TrendingUp, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

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
  const [formData, setFormData] = useState({
    name: "",
    platform: "",
    holding_type_id: "",
    currency: "",
    invested_amount: "",
    current_value: "",
    units: "",
    avg_buy_price: "",
    current_price: "",
    month: "",
    year: "",
    notes: "",
  });
  
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [hideValues, setHideValues] = useState(() => {
    // Load preference from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hideHoldingValues");
      return saved === "true";
    }
    return false;
  });

  useEffect(() => {
    fetchHoldings();
    fetchHoldingTypes();
  }, [fetchHoldings, fetchHoldingTypes]);

  useEffect(() => {
    // Save preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("hideHoldingValues", hideValues.toString());
    }
  }, [hideValues]);

  function openAddModal() {
    setEditingHolding(null);
    setFormData({
      name: "",
      platform: "",
      holding_type_id: "",
      currency: "IDR",
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
  }

  function openDuplicateModal() {
    setDuplicateOpen(true);
  }

  function openEditModal(holding: Holding) {
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
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        holding_type_id: parseInt(formData.holding_type_id),
        invested_amount: parseFloat(formData.invested_amount),
        current_value: parseFloat(formData.current_value),
        units: formData.units ? parseFloat(formData.units) : null,
        avg_buy_price: formData.avg_buy_price
          ? parseFloat(formData.avg_buy_price)
          : null,
        current_price: formData.current_price
          ? parseFloat(formData.current_price)
          : null,
        month: parseInt(formData.month),
        year: parseInt(formData.year),
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

  async function handleFilter(monthOverride?: number, yearOverride?: number) {
    const month = monthOverride ?? parseInt(filterMonth, 10);
    const year = yearOverride ?? parseInt(filterYear, 10);
    await fetchHoldings({ month, year });
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <HoldingHeader />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="flex items-center gap-2"
            onClick={() => setHideValues(!hideValues)}
            title={hideValues ? "Show values" : "Hide values"}
          >
            {hideValues ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
           <Button
            variant="outline"
            className="flex items-center gap-2"
            asChild
          >
            <Link href="/dashboard/holdings/performance">
                <TrendingUp className="w-4 h-4" />
                Performance
            </Link>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={openDuplicateModal}
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={openAddModal}
          >
            <PlusCircle className="w-4 h-4" />
            Add Holding
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-muted/30 p-4 rounded-lg border">
        <HoldingFilter
          month={filterMonth}
          year={filterYear}
          onMonthChange={setFilterMonth}
          onYearChange={setFilterYear}
          onFilter={handleFilter}
        />
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold tracking-tight mb-4 px-1">Portfolio Summary</h2>
          <HoldingSummaryCards holdings={holdings} isLoading={isLoading} hideValues={hideValues} />
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/10 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Holdings Inventory</CardTitle>
              <CardDescription className="mt-1">
                Review your investment performance for the selected period.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <HoldingTable
            holdings={holdings}
            isLoading={isLoading}
            expandedRows={expandedRows}
            toggleExpand={toggleExpand}
            onEdit={openEditModal}
            hideValues={hideValues}
          />
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
