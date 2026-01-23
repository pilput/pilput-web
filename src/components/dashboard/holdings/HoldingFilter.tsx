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
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

interface HoldingFilterProps {
  month: string;
  year: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onFilter: (month?: number, year?: number) => void;
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
  const now = useMemo(() => new Date(), []);
  const isCurrentPeriod = useMemo(
    () =>
      currentMonthIndex === now.getMonth() &&
      currentYear === now.getFullYear(),
    [currentMonthIndex, currentYear, now]
  );

  const handlePreviousMonth = () => {
    let newMonth = currentMonthIndex - 1;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    onMonthChange((newMonth + 1).toString());
    onYearChange(newYear.toString());
    onFilter(newMonth + 1, newYear);
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
    onFilter(newMonth + 1, newYear);
  };

  const handleMonthChange = (value: string) => {
    onMonthChange(value);
  };

  const handleYearChange = (value: string) => {
    onYearChange(value);
  };

  const handleCurrentMonth = () => {
    const newMonth = now.getMonth() + 1;
    const newYear = now.getFullYear();
    onMonthChange(newMonth.toString());
    onYearChange(newYear.toString());
    onFilter(newMonth, newYear);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-2 bg-muted/30 p-2 sm:p-2.5 rounded-lg border border-border/50"
    >
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
          className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 hover:bg-background"
          title="Previous month"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Select value={month} onValueChange={handleMonthChange}>
          <SelectTrigger
            id="filterMonth"
            className="min-w-[120px] sm:min-w-[140px] h-8 sm:h-9 border-none bg-transparent hover:bg-background focus:ring-0 flex-1"
            aria-label="Filter month"
          >
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

        <div className="h-4 sm:h-5 w-px bg-border/60 mx-0.5 shrink-0" />

        <Input
          id="filterYear"
          type="number"
          min="1900"
          max="2100"
          inputMode="numeric"
          value={year}
          onChange={(e) => handleYearChange(e.target.value)}
          className="w-[70px] sm:w-[80px] h-8 sm:h-9 border-none bg-transparent hover:bg-background text-center focus-visible:ring-0 shrink-0"
          placeholder="Year"
          aria-label="Filter year"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 hover:bg-background"
          title="Next month"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs flex-1 sm:flex-initial"
          onClick={handleCurrentMonth}
          disabled={isCurrentPeriod}
        >
          <CalendarDays className="w-3.5 h-3.5 mr-1.5 shrink-0" />
          <span className="hidden xs:inline">This month</span>
          <span className="xs:hidden">Current</span>
        </Button>
        <Button 
          type="submit" 
          size="sm" 
          variant="secondary" 
          className="h-8 sm:h-9 px-3 sm:px-4 text-xs font-semibold flex-1 sm:flex-initial"
        >
          Apply
        </Button>
      </div>
    </form>
  );
}
