"use client"

import * as React from "react"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const chartData = [
  { category: "18-24", visitors: 275 },
  { category: "25-34", visitors: 200 },
  { category: "35-44", visitors: 187 },
  { category: "45-54", visitors: 173 },
  { category: "55+", visitors: 90 },
]

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"]

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
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
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
