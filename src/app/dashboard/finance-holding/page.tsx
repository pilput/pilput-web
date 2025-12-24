"use client";

import { useEffect, useState } from "react";
import HoldingHeader from "@/components/dashboard/finance-holding/HoldingHeader";
import HoldingFormModal from "@/components/dashboard/finance-holding/HoldingFormModal";
import HoldingTable from "@/components/dashboard/finance-holding/HoldingTable";
import HoldingDuplicateModal from "@/components/dashboard/finance-holding/HoldingDuplicateModal";
import HoldingFilter from "@/components/dashboard/finance-holding/HoldingFilter";
import HoldingSummaryCards from "@/components/dashboard/finance-holding/HoldingSummaryCards";
import { useHoldingsStore } from "@/stores/holdingsStore";
import type { Holding } from "@/types/holding";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FinanceHolding() {
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

  useEffect(() => {
    fetchHoldings();
    fetchHoldingTypes();
  }, [fetchHoldings, fetchHoldingTypes]);

  function openAddModal() {
    const now = new Date();
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
      month: (now.getMonth() + 1).toString(),
      year: now.getFullYear().toString(),
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

  async function handleFilter() {
    const month = parseInt(filterMonth, 10);
    const year = parseInt(filterYear, 10);
    await fetchHoldings({ month, year });
  }

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <HoldingHeader
          onAddClick={openAddModal}
          onDuplicateClick={openDuplicateModal}
        />
        <div className="flex justify-end">
          <HoldingFilter
            month={filterMonth}
            year={filterYear}
            onMonthChange={setFilterMonth}
            onYearChange={setFilterYear}
            onFilter={handleFilter}
          />
        </div>
      </div>

      <HoldingSummaryCards holdings={holdings} isLoading={isLoading} />

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Holdings Overview</CardTitle>
          <CardDescription>
            Review your investment performance for the selected period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HoldingTable
            holdings={holdings}
            isLoading={isLoading}
            expandedRows={expandedRows}
            toggleExpand={toggleExpand}
            onEdit={openEditModal}
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
