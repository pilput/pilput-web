import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatThousandsForInput, parseThousandsFromInput } from "@/lib/utils";
import type { Holding, HoldingType } from "@/types/holding";

interface HoldingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingHolding: Holding | null;
  formData: {
    name: string;
    platform: string;
    holding_type_id: string;
    currency: string;
    invested_amount: string;
    current_value: string;
    units: string;
    avg_buy_price: string;
    current_price: string;
    month: string;
    year: string;
    notes: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      platform: string;
      holding_type_id: string;
      currency: string;
      invested_amount: string;
      current_value: string;
      units: string;
      avg_buy_price: string;
      current_price: string;
      month: string;
      year: string;
      notes: string;
    }>
  >;
  holdingTypes: HoldingType[];
  onSubmit: (e: React.FormEvent) => void;
}

export default function HoldingFormModal({
  open,
  onOpenChange,
  editingHolding,
  formData,
  setFormData,
  holdingTypes,
  onSubmit,
}: HoldingFormModalProps) {
  const [showFinancialDetails, setShowFinancialDetails] = useState(false);
  const platformOptions = [
    "Ajaib",
    "Stockbit",
    "Bank Jago",
    "Bank BSI",
    "Bareksa",
    "Bibit",
    "Growin",
    "Pluang",
    "Others",
  ];

  const currencyOptions = [
    "IDR",
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "CHF",
    "CNY",
    "HKD",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              editingHolding 
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            }`}>
              {editingHolding ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
            </div>
            <div>
              <DialogTitle className="text-xl">
                {editingHolding ? "Edit Holding" : "Add New Holding"}
              </DialogTitle>
              <DialogDescription className="text-sm mt-0.5">
                {editingHolding
                  ? "Update the holding details below."
                  : "Create a new holding with the following details."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
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
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="platform">
                  Platform <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) =>
                    setFormData({ ...formData, platform: value })
                  }
                >
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
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
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="currency">
                  Currency <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    setFormData({ ...formData, currency: value })
                  }
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="invested_amount">
                  Invested Amount <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="invested_amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={formatThousandsForInput(formData.invested_amount)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      invested_amount: parseThousandsFromInput(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="current_value">
                  Current Value <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="current_value"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={formatThousandsForInput(formData.current_value)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      current_value: parseThousandsFromInput(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Optional notes about this holding..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="resize-none"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 2: Financial Details */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowFinancialDetails(!showFinancialDetails)}
              className="flex items-center justify-between w-full text-left group transition-all"
            >
              <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                Financial Details
              </h3>
              {showFinancialDetails ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            <AnimatePresence>
              {showFinancialDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="units">Units</Label>
                      <Input
                        id="units"
                        type="number"
                        step="0.00000001"
                        placeholder="0"
                        value={formData.units}
                        onChange={(e) =>
                          setFormData({ ...formData, units: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="avg_buy_price" className="text-xs">
                          Avg Buy Price
                        </Label>
                        <Input
                          id="avg_buy_price"
                          type="number"
                          step="0.00000001"
                          placeholder="0.00"
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
                        <Label htmlFor="current_price" className="text-xs">
                          Current Price
                        </Label>
                        <Input
                          id="current_price"
                          type="number"
                          step="0.00000001"
                          placeholder="0.00"
                          value={formData.current_price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              current_price: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Separator />

          {/* Section 3: Period */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Reporting Period
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">
                  Month <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="month"
                  type="number"
                  min="1"
                  max="12"
                  value={formData.month}
                  onChange={(e) =>
                    setFormData({ ...formData, month: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max="2100"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="min-w-[140px] gap-2"
            >
              {editingHolding ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Update Holding
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Holding
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
