"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";

interface HoldingDuplicateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDuplicate: (data: {
    fromMonth: number;
    fromYear: number;
    toMonth: number;
    toYear: number;
    overwrite: boolean;
  }) => Promise<void>;
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

export default function HoldingDuplicateModal({
  open,
  onOpenChange,
  onDuplicate,
}: HoldingDuplicateModalProps) {
  const [formData, setFormData] = useState({
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    overwrite: false,
  });

  // Reset/Initialize form when modal opens
  useEffect(() => {
    if (open) {
      const now = new Date();
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      setFormData({
        fromMonth: (prevMonth.getMonth() + 1).toString(),
        fromYear: prevMonth.getFullYear().toString(),
        toMonth: (now.getMonth() + 1).toString(),
        toYear: now.getFullYear().toString(),
        overwrite: false,
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onDuplicate({
      fromMonth: parseInt(formData.fromMonth, 10),
      fromYear: parseInt(formData.fromYear, 10),
      toMonth: parseInt(formData.toMonth, 10),
      toYear: parseInt(formData.toYear, 10),
      overwrite: formData.overwrite,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Duplicate holdings by month</DialogTitle>
          <DialogDescription>
            Copy holdings from one month/year to another. Existing data in the
            target month can be overwritten.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Source Period</Label>
              <div className="space-y-2">
                <Label htmlFor="fromMonth" className="text-xs text-muted-foreground">Month</Label>
                <Select
                  value={formData.fromMonth}
                  onValueChange={(val) =>
                    setFormData({ ...formData, fromMonth: val })
                  }
                >
                  <SelectTrigger id="fromMonth">
                    <SelectValue placeholder="Select month" />
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
                <Label htmlFor="fromYear" className="text-xs text-muted-foreground">Year</Label>
                <Input
                  id="fromYear"
                  type="number"
                  min="1900"
                  max="2100"
                  value={formData.fromYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fromYear: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Target Period</Label>
              <div className="space-y-2">
                <Label htmlFor="toMonth" className="text-xs text-muted-foreground">Month</Label>
                <Select
                  value={formData.toMonth}
                  onValueChange={(val) =>
                    setFormData({ ...formData, toMonth: val })
                  }
                >
                  <SelectTrigger id="toMonth">
                    <SelectValue placeholder="Select month" />
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
                <Label htmlFor="toYear" className="text-xs text-muted-foreground">Year</Label>
                <Input
                  id="toYear"
                  type="number"
                  min="1900"
                  max="2100"
                  value={formData.toYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      toYear: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
            <div className="space-y-0.5">
              <Label htmlFor="overwrite-mode" className="text-base">Overwrite target</Label>
              <p className="text-xs text-muted-foreground">
                Replace any existing holdings in the destination month/year.
              </p>
            </div>
            <Switch
              id="overwrite-mode"
              checked={formData.overwrite}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, overwrite: checked })
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Duplicate Holdings</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
