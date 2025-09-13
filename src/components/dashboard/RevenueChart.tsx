"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis } from "recharts"

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
  { month: "January", revenue: 186, profit: 80 },
  { month: "February", revenue: 305, profit: 200 },
  { month: "March", revenue: 237, profit: 120 },
  { month: "April", revenue: 73, profit: 190 },
  { month: "May", revenue: 209, profit: 130 },
  { month: "June", revenue: 214, profit: 140 },
  { month: "July", revenue: 280, profit: 180 },
  { month: "August", revenue: 320, profit: 220 },
  { month: "September", revenue: 290, profit: 160 },
  { month: "October", revenue: 340, profit: 240 },
  { month: "November", revenue: 380, profit: 280 },
  { month: "December", revenue: 420, profit: 320 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#3b82f6",
  },
  profit: {
    label: "Profit",
    color: "#10b981",
  },
} satisfies ChartConfig

export default function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Analytics</CardTitle>
        <CardDescription>
          Monthly revenue and profit trends for 2024
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="revenue"
              type="monotone"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="profit"
              type="monotone"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
