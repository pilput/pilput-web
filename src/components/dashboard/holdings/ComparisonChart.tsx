"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { ComparisonSummary } from "@/types/holding-comparison";

interface ComparisonChartProps {
  data: ComparisonSummary;
  hideValues?: boolean;
}

export default function ComparisonChart({
  data,
  hideValues = false,
}: ComparisonChartProps) {
  const chartData = [
    {
      name: "Invested",
      Previous: data.summary.from.totalInvested,
      Current: data.summary.to.totalInvested,
    },
    {
      name: "Value",
      Previous: data.summary.from.totalCurrentValue,
      Current: data.summary.to.totalCurrentValue,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 sm:p-3 shadow-sm text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="flex flex-col min-w-0">
              <span className="text-[0.65rem] sm:text-[0.70rem] uppercase text-muted-foreground">
                {label}
              </span>
              <span className="font-bold text-muted-foreground text-xs sm:text-sm truncate">
                {payload[0].name}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[0.65rem] sm:text-[0.70rem] uppercase text-muted-foreground">
                Value
              </span>
              <span className="font-bold text-xs sm:text-sm break-words">
                {hideValues ? "••••••" : payload[0].value.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col min-w-0 col-span-2">
              <span className="text-[0.65rem] sm:text-[0.70rem] uppercase text-muted-foreground">
                {payload[1].name}
              </span>
              <span className="font-bold text-xs sm:text-sm break-words">
                {hideValues ? "••••••" : payload[1].value.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Comparison Overview</CardTitle>
        <CardDescription className="text-xs sm:text-sm mt-1">
          Comparing your total invested capital and current portfolio value.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
        <div className="h-[250px] sm:h-[300px] lg:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              barSize={30}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-muted"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                hide={hideValues}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                width={50}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "var(--muted)", opacity: 0.2 }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} 
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="Previous"
                name="Previous Month"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
                opacity={0.3}
              />
              <Bar
                dataKey="Current"
                name="Current Month"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
