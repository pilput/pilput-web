"use client";

import * as React from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClientApp } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import { cn } from "@/lib/utils";

/** "YYYY-MM" from input type="month" -> { month, year } */
function parseMonthValue(value: string): { month: number; year: number } | null {
  if (!value || value.length < 7) return null;
  const [y, m] = value.split("-").map(Number);
  if (!m || !y) return null;
  return { month: m, year: y };
}

type MonthlyHoldingApiItem = {
  month: number;
  year: number;
  date: string;
  totalCurrentValue: number;
  totalInvested: number;
  holdingsCount: number;
};

type MonthlyHoldingResponse = {
  data: MonthlyHoldingApiItem[];
};

interface MonthlyHoldingsChartProps {
  hideValues?: boolean;
  /** Filter: start of date range (inclusive) */
  startMonth?: number;
  startYear?: number;
  /** Filter: end of date range (inclusive) */
  endMonth?: number;
  endYear?: number;
}

const maskValue = () => "••••••";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "YYYY-MM" -> "Jan 2025" */
function formatMonthLabel(value: string): string {
  const s = String(value);
  const match = s.match(/^(\d{4})-(\d{2})$/);
  if (match) {
    const year = match[1];
    const monthIndex = parseInt(match[2], 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${MONTH_LABELS[monthIndex]} ${year}`;
    }
  }
  return s;
}

type DateFilter = {
  startMonth?: number;
  startYear?: number;
  endMonth?: number;
  endYear?: number;
};

export default function MonthlyHoldingsChart({
  hideValues = false,
  startMonth: startMonthProp,
  startYear: startYearProp,
  endMonth: endMonthProp,
  endYear: endYearProp,
}: MonthlyHoldingsChartProps) {
  const [data, setData] = React.useState<MonthlyHoldingApiItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const propsFilter = React.useMemo(
    (): DateFilter => ({
      ...(startMonthProp != null && { startMonth: startMonthProp }),
      ...(startYearProp != null && { startYear: startYearProp }),
      ...(endMonthProp != null && { endMonth: endMonthProp }),
      ...(endYearProp != null && { endYear: endYearProp }),
    }),
    [startMonthProp, startYearProp, endMonthProp, endYearProp]
  );

  const [appliedFilter, setAppliedFilter] = React.useState<DateFilter>(() => propsFilter);
  const [draft, setDraft] = React.useState({ startDate: "", endDate: "" });

  const filter = Object.keys(propsFilter).length > 0 ? propsFilter : appliedFilter;

  React.useEffect(() => {
    setAppliedFilter((prev) => (Object.keys(propsFilter).length > 0 ? propsFilter : prev));
  }, [propsFilter]);

  React.useEffect(() => {
    let isCancelled = false;

    async function fetchMonthlyHoldings() {
      try {
        setIsLoading(true);
        setError(null);
        const token = getToken();
        const params: Record<string, number> = {};
        if (filter.startMonth != null) params.startMonth = filter.startMonth;
        if (filter.startYear != null) params.startYear = filter.startYear;
        if (filter.endMonth != null) params.endMonth = filter.endMonth;
        if (filter.endYear != null) params.endYear = filter.endYear;

        const response = await apiClientApp.get<MonthlyHoldingResponse>(
          "/v1/holdings/monthly",
          {
            ...(Object.keys(params).length > 0 && { params }),
            ...(token && { headers: { Authorization: `Bearer ${token}` } }),
          }
        );
        if (!isCancelled) {
          setData(response.data?.data ?? []);
        }
      } catch (err) {
        if (!isCancelled) {
          setError("Failed to load monthly holdings data");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchMonthlyHoldings();

    return () => {
      isCancelled = true;
    };
  }, [filter.startMonth, filter.startYear, filter.endMonth, filter.endYear]);

  const handleApplyFilter = () => {
    const start = parseMonthValue(draft.startDate);
    const end = parseMonthValue(draft.endDate);
    setAppliedFilter({
      ...(start && { startMonth: start.month, startYear: start.year }),
      ...(end && { endMonth: end.month, endYear: end.year }),
    });
  };

  const handleClearFilter = () => {
    setDraft({ startDate: "", endDate: "" });
    setAppliedFilter({});
  };

  const hasFilter =
    filter.startMonth != null ||
    filter.startYear != null ||
    filter.endMonth != null ||
    filter.endYear != null;
  const canUseFilterUI = Object.keys(propsFilter).length === 0;

  const chartData = React.useMemo(
    () =>
      data.map((item) => ({
        ...item,
        label:
          item.date ||
          `${item.year}-${String(item.month).padStart(2, "0")}`,
      })),
    [data]
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0]?.payload as MonthlyHoldingApiItem & {
        label: string;
      };

      return (
        <div className="rounded-lg border bg-background p-2 sm:p-3 shadow-sm text-xs sm:text-sm">
          <div className="space-y-1">
            <div className="font-medium text-foreground">
                {formatMonthLabel(label)}
              </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-[0.7rem] uppercase">
                Current Value
              </span>
              <span className="font-semibold">
                {hideValues
                  ? maskValue()
                  : point.totalCurrentValue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-[0.7rem] uppercase">
                Invested
              </span>
              <span className="font-semibold">
                {hideValues
                  ? maskValue()
                  : point.totalInvested.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-[0.7rem] uppercase">
                Holdings
              </span>
              <span className="font-semibold">
                {point.holdingsCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderLegendContent = () => (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
      {[
        { name: "Total Invested", color: "var(--chart-2)" },
        { name: "Current Value", color: "var(--chart-1)" },
        { name: "Holdings Count", color: "var(--chart-3, #f97316)", dashed: true },
      ].map((item) => (
        <div
          key={item.name}
          className="inline-flex items-center gap-2"
        >
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              item.dashed && "h-0 w-4 rounded-none border-t-2 border-dashed bg-transparent"
            )}
            style={
              item.dashed
                ? { borderColor: item.color }
                : { backgroundColor: item.color }
            }
          />
          <span className="text-muted-foreground">{item.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="px-4 pb-3 pt-4 sm:px-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-sm font-semibold">
              Monthly Holdings Performance
            </CardTitle>
            <CardDescription className="text-xs">
              Total invested vs current value per month
            </CardDescription>
          </div>
          {canUseFilterUI && (
            <div className="flex flex-wrap items-end gap-2 sm:gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">From</Label>
                <Input
                  type="month"
                  className="h-8 w-[140px] text-xs sm:w-[160px]"
                  value={draft.startDate}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, startDate: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">To</Label>
                <Input
                  type="month"
                  className="h-8 w-[140px] text-xs sm:w-[160px]"
                  value={draft.endDate}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, endDate: e.target.value }))
                  }
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 text-xs"
                onClick={handleApplyFilter}
              >
                Apply
              </Button>
              {hasFilter && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleClearFilter}
                >
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-5">
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/10 text-xs text-muted-foreground sm:text-sm">
            Loading monthly holdings...
          </div>
        ) : error ? (
          <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-destructive/30 bg-destructive/5 px-4 text-center text-xs text-destructive sm:text-sm">
            {error}
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/10 px-4 text-center text-xs text-muted-foreground sm:text-sm">
            No monthly holdings data available
          </div>
        ) : (
          <div className="rounded-xl bg-muted/10 p-1 sm:p-2">
            <div className="h-[260px] w-full sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 14, right: 12, left: 12, bottom: 6 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.18)" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={formatMonthLabel}
                    tick={{ fontSize: 12, fill: "currentColor" }}
                  />
                  <YAxis yAxisId="value" domain={[0, "auto"]} hide />
                  <YAxis yAxisId="count" domain={[0, "auto"]} orientation="right" hide />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend content={renderLegendContent} verticalAlign="bottom" />
                  <Line
                    yAxisId="value"
                    type="monotone"
                    dataKey="totalInvested"
                    name="Total Invested"
                    stroke="var(--chart-2)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="value"
                    type="monotone"
                    dataKey="totalCurrentValue"
                    name="Current Value"
                    stroke="var(--chart-1)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="count"
                    type="monotone"
                    dataKey="holdingsCount"
                    name="Holdings Count"
                    stroke="var(--chart-3, #f97316)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    strokeDasharray="4 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

