"use client";

import { getToken, RemoveToken } from "@/utils/Auth";
import { axiosInstence2 } from "@/utils/fetch";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Holding, HoldingType } from "@/types/holding";
import HoldingHeader from "@/components/dashboard/finance-holding/HoldingHeader";
import HoldingFormModal from "@/components/dashboard/finance-holding/HoldingFormModal";
import HoldingTable from "@/components/dashboard/finance-holding/HoldingTable";

export default function FinanceHolding() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [holdingTypes, setHoldingTypes] = useState<HoldingType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
  const [expandedRows, setExpandedRows] = useState<Set<bigint>>(new Set());

  useEffect(() => {
    refetchHoldings();
    fetchHoldingTypes();
  }, []);

  async function fetchHoldingTypes() {
    try {
      const { data } = await axiosInstence2.get("/v1/holdings/types", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const response = data as {
        data: HoldingType[];
        success: boolean;
      };

      if (response.success) {
        setHoldingTypes(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch holding types", error);
    }
  }

  async function refetchHoldings() {
    setIsLoading(true);
    try {
      const { data } = await axiosInstence2.get("/v1/holdings", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const response = data as {
        data: Holding[];
        success: boolean;
        metadata: { totalItems: number };
      };
      if (response.success) {
        setHoldings(response.data);
      } else {
        console.log(response);

        toast.error("Cannot connect to server");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          RemoveToken();
          window.location.href = "/login";
        }
      }
      toast.error("Cannot connect to server");
    } finally {
      setIsLoading(false);
    }
  }

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
    const toastId = toast.loading(
      editingHolding ? "Updating..." : "Creating..."
    );

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
        await axiosInstence2.put(`/v1/holdings/${editingHolding.id}`, payload, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        toast.success("Holding updated", { id: toastId });
      } else {
        await axiosInstence2.post("/v1/holdings", payload, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        toast.success("Holding created", { id: toastId });
      }

      setModalOpen(false);
      refetchHoldings();
    } catch (error) {
      toast.error("Failed to save holding", { id: toastId });
    }
  }

  function toggleExpand(id: bigint) {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  return (
    <div className="p-8">
      <HoldingHeader onAddClick={openAddModal} />
      <HoldingFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingHolding={editingHolding}
        formData={formData}
        setFormData={setFormData}
        holdingTypes={holdingTypes}
        onSubmit={handleSubmit}
      />
      <HoldingTable
        holdings={holdings}
        isLoading={isLoading}
        expandedRows={expandedRows}
        toggleExpand={toggleExpand}
        onEdit={openEditModal}
        refetchHoldings={refetchHoldings}
      />
    </div>
  );
}
