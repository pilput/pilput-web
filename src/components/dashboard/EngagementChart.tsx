"use client"

import * as React from "react"
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  { month: "Jan", sessions: 120, pageViews: 85, bounceRate: 45 },
  { month: "Feb", sessions: 135, pageViews: 92, bounceRate: 42 },
  { month: "Mar", sessions: 118, pageViews: 78, bounceRate: 38 },
  { month: "Apr", sessions: 142, pageViews: 98, bounceRate: 41 },
  { month: "May", sessions: 128, pageViews: 87, bounceRate: 35 },
  { month: "Jun", sessions: 131, pageViews: 89, bounceRate: 39 },
  { month: "Jul", sessions: 145, pageViews: 102, bounceRate: 37 },
  { month: "Aug", sessions: 158, pageViews: 115, bounceRate: 33 },
  { month: "Sep", sessions: 152, pageViews: 108, bounceRate: 36 },
  { month: "Oct", sessions: 165, pageViews: 118, bounceRate: 31 },
  { month: "Nov", sessions: 172, pageViews: 125, bounceRate: 34 },
  { month: "Dec", sessions: 178, pageViews: 132, bounceRate: 29 },
]

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "#06b6d4",
  },
  pageViews: {
    label: "Page Views",
    color: "#8b5cf6",
  },
  bounceRate: {
    label: "Bounce Rate",
    color: "#dc2626",
  },
} satisfies ChartConfig

export default function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Engagement</CardTitle>
        <CardDescription>
          Sessions, page views, and bounce rate over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
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
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="sessions" fill="#06b6d4" radius={4} />
            <Bar dataKey="pageViews" fill="#8b5cf6" radius={4} />
            <Line
              dataKey="bounceRate"
              type="monotone"
              stroke="#dc2626"
              strokeWidth={3}
              dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
