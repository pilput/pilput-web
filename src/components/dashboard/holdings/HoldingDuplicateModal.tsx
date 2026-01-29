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
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <div>
              <DialogTitle className="text-xl">Duplicate Holdings</DialogTitle>
              <DialogDescription className="text-sm mt-0.5">
                Copy holdings from one period to another
              </DialogDescription>
            </div>
          </div>
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

          <div className="flex items-center justify-between rounded-lg border p-4 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30">
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <Label htmlFor="overwrite-mode" className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                  Overwrite target period
                </Label>
              </div>
              <p className="text-xs text-amber-700/70 dark:text-amber-300/70 ml-6">
                Replace any existing holdings in the destination month/year
              </p>
            </div>
            <Switch
              id="overwrite-mode"
              checked={formData.overwrite}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, overwrite: checked })
              }
              className="data-[state=checked]:bg-amber-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t">
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
              className="min-w-[160px] gap-2 bg-violet-600 hover:bg-violet-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Duplicate Holdings
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
