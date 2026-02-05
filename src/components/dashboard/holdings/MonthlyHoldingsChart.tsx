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
import { axiosInstance3 } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";

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
}

const maskValue = () => "••••••";

export default function MonthlyHoldingsChart({
  hideValues = false,
}: MonthlyHoldingsChartProps) {
  const [data, setData] = React.useState<MonthlyHoldingApiItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isCancelled = false;

    async function fetchMonthlyHoldings() {
      try {
        setIsLoading(true);
        setError(null);
        const token = getToken();
        const response = await axiosInstance3.get<MonthlyHoldingResponse>(
          "/v1/holdings/monthly",
          token
            ? {
                headers: { Authorization: `Bearer ${token}` },
              }
            : undefined
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
  }, []);

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
            <div className="font-medium text-foreground">{label}</div>
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
        <CardTitle className="text-base sm:text-lg font-semibold">
          Monthly Holdings Performance
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Total invested vs current value per month
        </CardDescription>
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
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => String(value).slice(5)}
                />
                <YAxis
                  yAxisId="value"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    hideValues ? "•••" : `${(value as number).toFixed(0)}`
                  }
                  width={50}
                />
                <YAxis
                  yAxisId="count"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    hideValues ? "•••" : `${(value as number).toFixed(0)}`
                  }
                  width={40}
                />
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

