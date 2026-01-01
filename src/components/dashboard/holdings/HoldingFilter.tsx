"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface HoldingFilterProps {
  month: string;
  year: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onFilter: () => void;
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

export default function HoldingFilter({
  month,
  year,
  onMonthChange,
  onYearChange,
  onFilter,
}: HoldingFilterProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3"
    >
      <div className="flex items-center gap-2">
        <Label htmlFor="filterMonth" className="text-sm font-medium whitespace-nowrap">
          Period:
        </Label>
        <div className="w-[140px]">
          <Select value={month} onValueChange={onMonthChange}>
            <SelectTrigger id="filterMonth" className="h-9 bg-background">
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
      </div>
      <div className="w-[100px]">
        <Input
          id="filterYear"
          type="number"
          min="1900"
          max="2100"
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className="h-9 bg-background"
        />
      </div>
      <Button type="submit" size="sm" variant="secondary" className="h-9 px-4 gap-2">
        <Filter className="w-3.5 h-3.5" />
        Apply Filter
      </Button>
    </form>
  );
}
