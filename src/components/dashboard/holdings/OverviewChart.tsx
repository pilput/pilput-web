"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Holding } from "@/types/holding"
import { formatCurrency } from "@/lib/utils"

function getAllocationColor(index: number) {
  return `var(--chart-${(index % 5) + 1})`
}

interface OverviewChartProps {
  holdings: Holding[]
  currency?: string
  hideValues?: boolean
  hiddenTypes?: string[]
  onToggleType?: (typeName: string, isHidden: boolean) => void
}

export default function OverviewChart({ 
  holdings, 
  currency = "IDR",
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
  const chartData = React.useMemo(() => {
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
    return data
  }, [holdings, hiddenTypes, totalValue])

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

  // Custom tooltip content as inline function to avoid component creation during render
  const renderTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-popover p-2 shadow-md text-popover-foreground">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {data.name}
            </span>
            <span className="text-sm font-bold font-mono">
              {hideValues ? "••••••" : formatCurrency(data.value, currency)}
            </span>
            <span className="text-xs text-muted-foreground">
              {data.percent}% of portfolio
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  const renderLegendContent = () => (
    <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-4">
      {chartData.map((entry, index) => {
        const isHidden = hiddenTypes.includes(entry.name)
        return (
          <div
            key={index}
            className={`inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/20 px-2.5 py-1 text-xs transition-all ${
              isHidden ? "opacity-40 line-through" : "opacity-100"
            }`}
            onClick={() => handleTypeToggle(entry.name)}
          >
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: getAllocationColor(index) }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="font-semibold text-foreground">
              {entry.percent}%
            </span>
          </div>
        )
      })}
    </div>
  )

  return (
    <Card className="flex flex-col border-border/60 bg-card">
      <CardHeader className="px-4 pb-3 pt-4 sm:px-5">
        <CardTitle className="text-sm font-semibold">Asset Allocation</CardTitle>
        <CardDescription className="text-xs">
          Distribution by Asset Type. Click a legend item to hide or show a category.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-3 pb-4 sm:px-5">
        <div className="h-[280px] sm:h-[300px] w-full">
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
                      fill={getAllocationColor(index)}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <RechartsTooltip content={renderTooltipContent} cursor={false} />
                <Legend content={renderLegendContent} verticalAlign="bottom" />
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
  )
}
