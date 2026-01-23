"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Holding } from "@/types/holding"
import { formatCurrency } from "@/lib/utils"

interface OverviewChartProps {
  holdings: Holding[]
  hideValues?: boolean
  hiddenTypes?: string[]
  onToggleType?: (typeName: string, isHidden: boolean) => void
}

export default function OverviewChart({ 
  holdings, 
  hideValues = false, 
  hiddenTypes: externalHiddenTypes = [], 
  onToggleType 
}: OverviewChartProps) {
  // Use internal state if no external callback provided
  const [internalHiddenTypes, setInternalHiddenTypes] = React.useState<string[]>([])
  const hiddenTypes = onToggleType ? externalHiddenTypes : internalHiddenTypes

  // Calculate total for percentage calculations
  const totalValue = React.useMemo(() => {
    return holdings.reduce((sum, h) => sum + parseFloat(h.current_value), 0)
  }, [holdings])

  // Aggregate and compute chart data in one pass with percentages
  const { chartData, typeNames } = React.useMemo(() => {
    const typeMap = new Map<string, number>()
    const typeSet = new Set<string>()
    
    holdings.forEach(h => {
      const typeName = h.holding_type?.name || "Unknown"
      typeSet.add(typeName)
      if (!hiddenTypes.includes(typeName)) {
        const value = parseFloat(h.current_value)
        typeMap.set(typeName, (typeMap.get(typeName) || 0) + value)
      }
    })
    
    const names = Array.from(typeSet)
    const data = names.map(name => {
      const value = typeMap.get(name) || 0
      const percent = totalValue > 0 ? (value / totalValue) * 100 : 0
      return { 
        name, 
        value,
        percent: parseFloat(percent.toFixed(1))
      }
    }).sort((a, b) => b.value - a.value)
    
    return { chartData: data, typeNames: names }
  }, [holdings, hiddenTypes, totalValue])

  // Platform distribution with percentages
  const platformDistribution = React.useMemo(() => {
    const map = new Map<string, number>()
    holdings.forEach(h => {
      const platform = h.platform || "Other"
      const value = parseFloat(h.current_value)
      map.set(platform, (map.get(platform) || 0) + value)
    })
    return Array.from(map.entries())
      .map(([name, value]) => {
        const percent = totalValue > 0 ? (value / totalValue) * 100 : 0
        return { 
          name, 
          value,
          percent: parseFloat(percent.toFixed(1))
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [holdings, totalValue])

  // Chart colors
  const CHART_COLORS = [
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#f59e0b", // Amber
    "#10b981", // Emerald
    "#6366f1", // Indigo
  ]

  const handleTypeToggle = (typeName: string) => {
    const isHidden = hiddenTypes.includes(typeName)
    if (onToggleType) {
      onToggleType(typeName, !isHidden)
    } else {
      setInternalHiddenTypes(prev =>
        isHidden ? prev.filter(t => t !== typeName) : [...prev, typeName]
      )
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-popover p-2 shadow-md text-popover-foreground">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {data.name}
            </span>
            <span className="text-sm font-bold font-mono">
              {hideValues ? "••••••" : formatCurrency(data.value, "IDR")}
            </span>
            <span className="text-xs text-muted-foreground">
              {hideValues ? "•••" : `${data.percent}%`} of portfolio
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  const renderLegend = () => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {chartData.map((entry, index) => {
        const isHidden = hiddenTypes.includes(entry.name)
        return (
          <div
            key={index}
            className={`flex items-center gap-2 cursor-pointer transition-opacity ${
              isHidden ? "opacity-40 line-through" : "opacity-100"
            }`}
            onClick={() => handleTypeToggle(entry.name)}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            <span className="text-sm text-muted-foreground">{entry.name}</span>
            {!hideValues && (
              <span className="text-xs font-semibold text-foreground">
                {entry.percent}%
              </span>
            )}
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="grid gap-6">
      <Card className="flex flex-col border-none shadow-none bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Asset Allocation</CardTitle>
          <CardDescription>Distribution by Asset Type</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="h-75 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={130}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} cursor={false} />
                  <Legend content={renderLegend} verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm italic">
                No data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col border-none shadow-none bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Platform Distribution</CardTitle>
          <CardDescription>Value and percentage across platforms</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="h-62.5 w-full">
            {platformDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={platformDistribution}
                  layout="vertical"
                  margin={{ top: 5, right: 60, left: 0, bottom: 5 }}
                  barCategoryGap="30%"
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    tick={{ fontSize: 12, fill: "currentColor", fontWeight: 600 }}
                    className="text-foreground"
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "hsl(var(--primary))", opacity: 0.05 }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {platformDistribution.map((_, index) => (
                      <Cell
                        key={index}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm italic">
                No platform data available
              </div>
            )}
          </div>
          {/* Percentage labels for platforms */}
          {platformDistribution.length > 0 && (
            <div className="mt-4 space-y-2">
              {platformDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">
                    {hideValues ? "•••" : `${item.percent}%`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
