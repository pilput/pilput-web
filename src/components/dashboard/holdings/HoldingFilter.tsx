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
import { CalendarDays, ChevronLeft, ChevronRight, Filter } from "lucide-react";
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
      className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3"
    >
      {/* Period Selector */}
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handlePreviousMonth}
          className="h-9 w-9 shrink-0 hover:bg-muted"
          title="Previous month"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-1 bg-background rounded-md border border-input px-2 h-9">
          <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0 ml-1" />
          <Select value={month} onValueChange={handleMonthChange}>
            <SelectTrigger
              id="filterMonth"
              className="h-8 border-0 bg-transparent focus:ring-0 text-sm font-medium w-[110px] sm:w-[130px]"
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

          <div className="h-4 w-px bg-border shrink-0" />

          <Input
            id="filterYear"
            type="number"
            min="1900"
            max="2100"
            inputMode="numeric"
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
            className="w-14 h-8 border-0 bg-transparent text-center focus-visible:ring-0 text-sm font-medium shrink-0 px-1"
            placeholder="Year"
            aria-label="Filter year"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          className="h-9 w-9 shrink-0 hover:bg-muted"
          title="Next month"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 px-3 text-xs sm:text-sm flex-1 sm:flex-initial gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={handleCurrentMonth}
          disabled={isCurrentPeriod}
        >
          <span className="hidden sm:inline">Current Period</span>
          <span className="sm:hidden">Current</span>
        </Button>
        <Button 
          type="submit" 
          size="sm" 
          className="h-9 px-4 text-xs sm:text-sm font-medium flex-1 sm:flex-initial gap-1.5"
        >
          <Filter className="w-3.5 h-3.5" />
          Apply
        </Button>
      </div>
    </form>
  );
}
