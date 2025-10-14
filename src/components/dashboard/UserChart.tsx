"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

// Generate more realistic data with trends
const generateChartData = () => {
  const data = []
  const now = new Date()
  let desktopCount = 800
  let mobileCount = 600
  
  // Generate data for the last 90 days
  for (let i = 90; i >= 0; i--) {
    const date = new Date()
    date.setDate(now.getDate() - i)
    
    // Add some randomness with trends
    desktopCount += Math.floor(Math.random() * 100) - 30
    mobileCount += Math.floor(Math.random() * 80) - 20
    
    // Ensure counts don't go below 0
    desktopCount = Math.max(0, desktopCount)
    mobileCount = Math.max(0, mobileCount)
    
    data.push({
      date: date.toISOString().split('T')[0],
      desktop: desktopCount,
      mobile: mobileCount,
    })
  }
  
  return data
}

const chartData = generateChartData()

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function Component() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [isLoading, setIsLoading] = React.useState(false)

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    now.setDate(now.getDate() - daysToSubtract)
    return date >= now
  })

  // Calculate totals for the selected time range
  const totals = filteredData.reduce((acc, item) => {
    acc.desktop += item.desktop
    acc.mobile += item.mobile
    return acc
  }, { desktop: 0, mobile: 0 })

  return (
    <Card className="shadow-lg border-0 rounded-2xl bg-gradient-to-br from-card to-muted/30">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-border/50 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-xl font-bold">User Analytics</CardTitle>
          <CardDescription className="text-sm">
            Showing total visitors for the selected period
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[140px] rounded-lg bg-background border border-input"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-background border border-input">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <Skeleton className="h-[200px] w-[90%] rounded-xl" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart
              data={filteredData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillMobile)"
                stroke="var(--color-mobile)"
                stackId="a"
                name="Mobile"
              />
              <Area
                dataKey="desktop"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="var(--color-desktop)"
                stackId="a"
                name="Desktop"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-1))]" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Desktop Users</p>
              <p className="text-lg font-bold">{totals.desktop.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-2))]" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Mobile Users</p>
              <p className="text-lg font-bold">{totals.mobile.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
