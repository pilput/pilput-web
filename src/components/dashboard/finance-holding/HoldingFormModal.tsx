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
  setFormData: React.Dispatch<React.SetStateAction<{
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
  }>>;
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
  const platformOptions = [
    "Stockbit",
    "Bank Jago",
    "Bank BSI",
    "Bareksa",
    "Bibit",
    "Growin",
    "Pluang",
    "Others",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        <form onSubmit={onSubmit} className="space-y-4">
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
              onClick={() => onOpenChange(false)}
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
  );
}