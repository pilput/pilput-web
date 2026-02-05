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
import { axiosInstance3 } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";

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

        const response = await axiosInstance3.get<MonthlyHoldingResponse>(
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

  return (
    <Card className="border-none shadow-none bg-muted/30">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold">
              Monthly Holdings Performance
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Total invested vs current value per month
            </CardDescription>
          </div>
          {canUseFilterUI && (
            <div className="flex flex-wrap items-end gap-2 sm:gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">From</Label>
                <Input
                  type="month"
                  className="h-8 w-[140px] sm:w-[160px] text-xs"
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
                  className="h-8 w-[140px] sm:w-[160px] text-xs"
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
      <CardContent>
        {isLoading ? (
          <div className="flex h-[260px] items-center justify-center text-xs sm:text-sm text-muted-foreground">
            Loading monthly holdings...
          </div>
        ) : error ? (
          <div className="flex h-[260px] items-center justify-center text-xs sm:text-sm text-destructive">
            {error}
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center text-xs sm:text-sm text-muted-foreground">
            No monthly holdings data available
          </div>
        ) : (
          <div className="h-[260px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatMonthLabel}
                />
                <YAxis yAxisId="value" domain={[0, "auto"]} hide />
                <YAxis yAxisId="count" domain={[0, "auto"]} orientation="right" hide />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 8, fontSize: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Line
                  yAxisId="value"
                  type="monotone"
                  dataKey="totalInvested"
                  name="Total Invested"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="value"
                  type="monotone"
                  dataKey="totalCurrentValue"
                  name="Current Value"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="count"
                  type="monotone"
                  dataKey="holdingsCount"
                  name="Holdings Count"
                  stroke="var(--chart-3, #f97316)"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

