"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Holding } from "@/types/holding"
import { formatCurrency } from "@/lib/utils"

interface OverviewChartProps {
  holdings: Holding[]
  hideValues?: boolean
}

export default function OverviewChart({ holdings, hideValues = false }: OverviewChartProps) {
  // Aggregate data for Allocation by Type
  const allocationByType = React.useMemo(() => {
    const map = new Map<string, number>()
    holdings.forEach(h => {
        const typeName = h.holding_type?.name || "Unknown"
        const value = parseFloat(h.current_value)
        map.set(typeName, (map.get(typeName) || 0) + value)
    })
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [holdings])

  // Aggregate data for Platform Distribution
  const platformDistribution = React.useMemo(() => {
    const map = new Map<string, number>()
    holdings.forEach(h => {
        const platform = h.platform || "Other"
        const value = parseFloat(h.current_value)
        map.set(platform, (map.get(platform) || 0) + value)
    })
    return Array.from(map.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value) // Sort by value desc
  }, [holdings])

  // Use CSS variables for chart colors
  const CHART_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--primary)",
  ]

  const maskValue = () => "••••••";

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-popover p-2 shadow-md text-popover-foreground">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {payload[0].name}
            </span>
            <span className="text-sm font-bold font-mono">
              {hideValues ? maskValue() : formatCurrency(payload[0].value, "IDR")}
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Asset Allocation</CardTitle>
          <CardDescription>Distribution by Asset Type</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="h-[300px] w-full mt-4">
            {allocationByType.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={allocationByType}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        cornerRadius={4}
                        dataKey="value"
                        strokeWidth={0}
                    >
                    {allocationByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} cursor={false} />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        formatter={(value) => <span className="text-sm text-muted-foreground ml-1">{value}</span>}
                    />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                 <div className="flex h-full items-center justify-center text-muted-foreground">
                    No data available
                 </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Platform Distribution</CardTitle>
          <CardDescription>Value by Platform</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="h-[300px] w-full mt-4">
            {platformDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={platformDistribution}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                    barCategoryGap="20%"
                >
                    <XAxis type="number" hide />
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100} 
                        tick={{fontSize: 12, fill: "var(--muted-foreground)"}} 
                        axisLine={false}
                        tickLine={false}
                    />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{fill: "var(--muted)", opacity: 0.1}} />
                    <Bar 
                        dataKey="value" 
                        radius={[0, 4, 4, 0]}
                    >
                        {platformDistribution.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                   No data available
                </div>
           )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}