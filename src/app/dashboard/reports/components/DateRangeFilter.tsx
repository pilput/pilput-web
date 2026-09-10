import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onReset: () => void;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: DateRangeFilterProps) {
  return (
    <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          <div className="space-y-1.5 flex-1">
            <Label htmlFor="report-start-date">Start date</Label>
            <Input
              id="report-start-date"
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 flex-1">
            <Label htmlFor="report-end-date">End date</Label>
            <Input
              id="report-end-date"
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-2 shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
            Last 30 days
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
