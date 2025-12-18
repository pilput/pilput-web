"use client";

import { useEffect, useState } from "react";
import HoldingHeader from "@/components/dashboard/finance-holding/HoldingHeader";
import HoldingFormModal from "@/components/dashboard/finance-holding/HoldingFormModal";
import HoldingTable from "@/components/dashboard/finance-holding/HoldingTable";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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
  const [duplicateForm, setDuplicateForm] = useState({
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    overwrite: false,
  });
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
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    setDuplicateForm({
      fromMonth: (prevMonth.getMonth() + 1).toString(),
      fromYear: prevMonth.getFullYear().toString(),
      toMonth: (now.getMonth() + 1).toString(),
      toYear: now.getFullYear().toString(),
      overwrite: false,
    });
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

  async function handleDuplicateSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await duplicateHoldings({
        fromMonth: parseInt(duplicateForm.fromMonth, 10),
        fromYear: parseInt(duplicateForm.fromYear, 10),
        toMonth: parseInt(duplicateForm.toMonth, 10),
        toYear: parseInt(duplicateForm.toYear, 10),
        overwrite: duplicateForm.overwrite,
      });
      setDuplicateOpen(false);
    } catch (error) {
      // Error handling is done in the store
    }
  }

  async function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    const month = parseInt(filterMonth, 10);
    const year = parseInt(filterYear, 10);
    await fetchHoldings({ month, year });
  }

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <div className="p-8 space-y-6">
      <HoldingHeader
        onAddClick={openAddModal}
        onDuplicateClick={openDuplicateModal}
      />
      
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Holdings Overview</CardTitle>
              <CardDescription>
                Review your investment performance for the selected period.
              </CardDescription>
            </div>
            <form
              onSubmit={handleFilterSubmit}
              className="flex flex-wrap items-end gap-2"
            >
              <div className="w-[140px]">
                <Label htmlFor="filterMonth" className="sr-only">Month</Label>
                <Select
                  value={filterMonth}
                  onValueChange={(val) => setFilterMonth(val)}
                >
                  <SelectTrigger id="filterMonth">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[100px]">
                <Label htmlFor="filterYear" className="sr-only">Year</Label>
                <Input
                  id="filterYear"
                  type="number"
                  min="1900"
                  max="2100"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" variant="secondary">Filter</Button>
            </form>
          </div>
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

      <Dialog open={duplicateOpen} onOpenChange={setDuplicateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate holdings by month</DialogTitle>
            <DialogDescription>
              Copy holdings from one month/year to another. Existing data in the
              target month can be overwritten.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDuplicateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromMonth">From month</Label>
                <Select
                  value={duplicateForm.fromMonth}
                  onValueChange={(val) => setDuplicateForm({...duplicateForm, fromMonth: val})}
                >
                   <SelectTrigger id="fromMonth">
                    <SelectValue placeholder="Month" />
                   </SelectTrigger>
                   <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                   </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromYear">From year</Label>
                <Input
                  id="fromYear"
                  type="number"
                  min="1900"
                  max="2100"
                  value={duplicateForm.fromYear}
                  onChange={(e) =>
                    setDuplicateForm({
                      ...duplicateForm,
                      fromYear: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toMonth">To month</Label>
                 <Select
                  value={duplicateForm.toMonth}
                  onValueChange={(val) => setDuplicateForm({...duplicateForm, toMonth: val})}
                >
                   <SelectTrigger id="toMonth">
                    <SelectValue placeholder="Month" />
                   </SelectTrigger>
                   <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                   </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="toYear">To year</Label>
                <Input
                  id="toYear"
                  type="number"
                  min="1900"
                  max="2100"
                  value={duplicateForm.toYear}
                  onChange={(e) =>
                    setDuplicateForm({
                      ...duplicateForm,
                      toYear: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Overwrite target month</p>
                <p className="text-sm text-muted-foreground">
                  Replace any existing holdings in the destination month/year.
                </p>
              </div>
              <Switch
                checked={duplicateForm.overwrite}
                onCheckedChange={(checked) =>
                  setDuplicateForm({ ...duplicateForm, overwrite: checked })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setDuplicateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Duplicate</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
