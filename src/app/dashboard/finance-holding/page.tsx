"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { getToken, RemoveToken } from "@/utils/Auth";
import { axiosInstence2 } from "@/utils/fetch";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Holding, HoldingType } from "@/types/holding";
import { PlusCircle, ChevronDown, ChevronUp } from "lucide-react";
import HoldingActionComponent from "@/components/dashboard/finance-holding/action";

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
    setEditingHolding(holding);
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Finance Holding
          </h1>
          <p className="text-muted-foreground">
            Manage your financial holdings and assets.
          </p>
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
              onClick={openAddModal}
            >
              <PlusCircle className="w-4 h-4" />
              Add Holding
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingHolding ? "Edit Holding" : "Add New Holding"}
              </DialogTitle>
              <DialogDescription>
                {editingHolding
                  ? "Update the holding details."
                  : "Create a new holding with the following details."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Apple Inc., Bitcoin"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Input
                    id="platform"
                    placeholder="e.g., Robinhood, Coinbase"
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="holding_type_id">Type</Label>
                  <Select
                    value={formData.holding_type_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, holding_type_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {holdingTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    placeholder="USD"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    required
                    maxLength={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invested_amount">Invested Amount</Label>
                  <Input
                    id="invested_amount"
                    type="number"
                    step="0.01"
                    placeholder="10000.00"
                    value={formData.invested_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        invested_amount: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_value">Current Value</Label>
                  <Input
                    id="current_value"
                    type="number"
                    step="0.01"
                    placeholder="12000.00"
                    value={formData.current_value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        current_value: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units">Units</Label>
                  <Input
                    id="units"
                    type="number"
                    step="0.00000001"
                    placeholder="100"
                    value={formData.units}
                    onChange={(e) =>
                      setFormData({ ...formData, units: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avg_buy_price">Avg Buy Price</Label>
                  <Input
                    id="avg_buy_price"
                    type="number"
                    step="0.00000001"
                    placeholder="150.00"
                    value={formData.avg_buy_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        avg_buy_price: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_price">Current Price</Label>
                  <Input
                    id="current_price"
                    type="number"
                    step="0.00000001"
                    placeholder="180.00"
                    value={formData.current_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        current_price: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Input
                    id="month"
                    type="number"
                    min="1"
                    max="12"
                    placeholder="12"
                    value={formData.month}
                    onChange={(e) =>
                      setFormData({ ...formData, month: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max="2100"
                    placeholder="2024"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Optional notes about this holding..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingHolding ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card shadow-sm dark:shadow-gray-900/30">
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
            ) : (
              <>
                {holdings.map((holding) => {
                  const invested = parseFloat(holding.invested_amount);
                  const current = parseFloat(holding.current_value);
                  const realized = current - invested;
                  const percent =
                    invested > 0 ? ((current - invested) / invested) * 100 : 0;
                  const mainRow = (
                    <TableRow
                      key={holding.id.toString()}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {holding.name}
                      </TableCell>
                      <TableCell>{holding.platform}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {holding.holding_types.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{holding.currency}</TableCell>
                      <TableCell>{invested.toLocaleString()}</TableCell>
                      <TableCell>{current.toLocaleString()}</TableCell>
                      <TableCell
                        className={
                          realized > 0
                            ? "text-green-600 font-medium"
                            : realized < 0
                            ? "text-red-600 font-medium"
                            : "text-gray-600"
                        }
                      >
                        {realized.toLocaleString()}
                      </TableCell>
                      <TableCell
                        className={
                          percent > 0
                            ? "text-green-600 font-medium"
                            : percent < 0
                            ? "text-red-600 font-medium"
                            : "text-gray-600"
                        }
                      >
                        {`${percent > 0 ? "+" : ""}${percent.toFixed(2)}%`}
                      </TableCell>
                      <TableCell>{holding.month}</TableCell>
                      <TableCell>{holding.year}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(holding.id)}
                        >
                          {expandedRows.has(holding.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <HoldingActionComponent
                          holding={holding}
                          refetchHoldings={refetchHoldings}
                          onEdit={openEditModal}
                        />
                      </TableCell>
                    </TableRow>
                  );
                  const expandedRow = expandedRows.has(holding.id) ? (
                    <TableRow key={`${holding.id}-expanded`}>
                      <TableCell colSpan={12} className="bg-muted/20 p-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <strong>Units:</strong>{" "}
                            {holding.units
                              ? parseFloat(
                                  holding.units as string
                                ).toLocaleString()
                              : "-"}
                          </div>
                          <div>
                            <strong>Avg Buy Price:</strong>{" "}
                            {holding.avg_buy_price
                              ? parseFloat(
                                  holding.avg_buy_price as string
                                ).toLocaleString()
                              : "-"}
                          </div>
                          <div>
                            <strong>Current Price:</strong>{" "}
                            {holding.current_price
                              ? parseFloat(
                                  holding.current_price as string
                                ).toLocaleString()
                              : "-"}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null;
                  return [mainRow, expandedRow].filter(Boolean);
                })}
                {holdings.length > 0 && (
                  <TableRow className="bg-muted/30 border-t-2 font-semibold">
                    <TableCell colSpan={4} className="text-right font-bold">
                      Total
                    </TableCell>
                    <TableCell className="font-bold">
                      {holdings
                        .reduce(
                          (sum, holding) =>
                            sum + parseFloat(holding.invested_amount),
                          0
                        )
                        .toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold">
                      {holdings
                        .reduce(
                          (sum, holding) =>
                            sum + parseFloat(holding.current_value),
                          0
                        )
                        .toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={`font-bold ${
                        holdings.reduce(
                          (sum, holding) =>
                            sum +
                            (parseFloat(holding.current_value) -
                              parseFloat(holding.invested_amount)),
                          0
                        ) > 0
                          ? "text-green-600"
                          : holdings.reduce(
                              (sum, holding) =>
                                sum +
                                (parseFloat(holding.current_value) -
                                  parseFloat(holding.invested_amount)),
                              0
                            ) < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {holdings
                        .reduce(
                          (sum, holding) =>
                            sum +
                            (parseFloat(holding.current_value) -
                              parseFloat(holding.invested_amount)),
                          0
                        )
                        .toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={`font-bold ${(() => {
                        const totalInvested = holdings.reduce(
                          (sum, holding) =>
                            sum + parseFloat(holding.invested_amount),
                          0
                        );
                        const totalCurrent = holdings.reduce(
                          (sum, holding) =>
                            sum + parseFloat(holding.current_value),
                          0
                        );
                        const totalPercent =
                          totalInvested > 0
                            ? ((totalCurrent - totalInvested) / totalInvested) *
                              100
                            : 0;
                        return totalPercent > 0
                          ? "text-green-600"
                          : totalPercent < 0
                          ? "text-red-600"
                          : "text-gray-600";
                      })()}`}
                    >
                      {(() => {
                        const totalInvested = holdings.reduce(
                          (sum, holding) =>
                            sum + parseFloat(holding.invested_amount),
                          0
                        );
                        const totalCurrent = holdings.reduce(
                          (sum, holding) =>
                            sum + parseFloat(holding.current_value),
                          0
                        );
                        const totalPercent =
                          totalInvested > 0
                            ? ((totalCurrent - totalInvested) / totalInvested) *
                              100
                            : 0;
                        return `${
                          totalPercent > 0 ? "+" : ""
                        }${totalPercent.toFixed(2)}%`;
                      })()}
                    </TableCell>
                    <TableCell colSpan={4}></TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
