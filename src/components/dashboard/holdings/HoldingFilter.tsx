"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

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

  const currentMonthIndex = useMemo(() => parseInt(month) - 1, [month]);
  const currentYear = useMemo(() => parseInt(year), [year]);

  const handlePreviousMonth = () => {
    let newMonth = currentMonthIndex - 1;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    onMonthChange((newMonth + 1).toString());
    onYearChange(newYear.toString());
    setTimeout(() => onFilter(), 0);
  };

  const handleNextMonth = () => {
    let newMonth = currentMonthIndex + 1;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    onMonthChange((newMonth + 1).toString());
    onYearChange(newYear.toString());
    setTimeout(() => onFilter(), 0);
  };

  const handleMonthChange = (value: string) => {
    onMonthChange(value);
  };

  const handleYearChange = (value: string) => {
    onYearChange(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={handlePreviousMonth}
        className="h-9 w-9 shrink-0"
        title="Previous month"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Select value={month} onValueChange={handleMonthChange}>
        <SelectTrigger id="filterMonth" className="w-[160px] h-9">
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

      <Input
        id="filterYear"
        type="number"
        min="1900"
        max="2100"
        value={year}
        onChange={(e) => handleYearChange(e.target.value)}
        className="w-[100px] h-9 text-center"
        placeholder="Year"
      />

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={handleNextMonth}
        className="h-9 w-9 shrink-0"
        title="Next month"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      <Button type="submit" size="sm" variant="default" className="h-9 px-4">
        Apply
      </Button>
    </form>
  );
}
