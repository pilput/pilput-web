"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { category: "18-24", visitors: 275 },
  { category: "25-34", visitors: 200 },
  { category: "35-44", visitors: 187 },
  { category: "45-54", visitors: 173 },
  { category: "55+", visitors: 90 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  "18-24": {
    label: "18-24",
    color: "#ef4444",
  },
  "25-34": {
    label: "25-34",
    color: "#f97316",
  },
  "35-44": {
    label: "35-44",
    color: "#eab308",
  },
  "45-54": {
    label: "45-54",
    color: "#22c55e",
  },
  "55+": {
    label: "55+",
    color: "#3b82f6",
  },
} satisfies ChartConfig

export default function Component() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>User Demographics</CardTitle>
        <CardDescription>Age distribution of users</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Cell key="18-24" fill="#ef4444" />
              <Cell key="25-34" fill="#f97316" />
              <Cell key="35-44" fill="#eab308" />
              <Cell key="45-54" fill="#22c55e" />
              <Cell key="55+" fill="#3b82f6" />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex-col gap-2 text-center text-sm">
          <div className="font-medium leading-none">
            Total Users: {totalVisitors.toLocaleString()}
          </div>
          <div className="leading-none text-muted-foreground">
            Age distribution breakdown
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
