"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { format, subDays } from "date-fns"
import { BarChart3 } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { postsStore } from "@/stores/posts-store"

export default function PostViewsChart() {
  const [timeRange, setTimeRange] = React.useState("30d")
  const { analytics, analyticsLoading, fetchAnalytics } = postsStore()

  React.useEffect(() => {
    let daysToSubtract = 30
    if (timeRange === "7d") {
      daysToSubtract = 7
    } else if (timeRange === "90d") {
      daysToSubtract = 90
    }
    
    const endDate = format(new Date(), "yyyy-MM-dd")
    const startDate = format(subDays(new Date(), daysToSubtract), "yyyy-MM-dd")
    
    void fetchAnalytics(startDate, endDate)
  }, [timeRange, fetchAnalytics])

  const chartData = React.useMemo(() => {
    if (!analytics || !analytics.view_trend) return []
    return analytics.view_trend
  }, [analytics])

  return (
    <Card className="glass-card border-glow-hover shadow-premium hover:shadow-premium-hover rounded-2xl overflow-hidden transition-all duration-300">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-border/50 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-xl font-bold flex items-center justify-center sm:justify-start gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Post Performance Trend
          </CardTitle>
          <CardDescription className="text-sm">
            Daily views vs Cumulative views growth
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
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {analyticsLoading ? (
          <div className="h-[280px] flex items-center justify-center">
            <Skeleton className="h-[240px] w-[95%] rounded-xl" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
            No views recorded during this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={chartData}
              margin={{
                left: 0,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <defs>
                <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.02}
                  />
                </linearGradient>
                <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={(value) => {
                  try {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  } catch {
                    return value;
                  }
                }}
              />
              <YAxis
                yAxisId="views"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={36}
                tickFormatter={(value) => Math.floor(value).toString()}
              />
              <YAxis
                yAxisId="cumulative"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={36}
                tickFormatter={(value) => Math.floor(value).toString()}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const formattedDate = label ? new Date(label).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    }) : "";
                    
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md text-xs sm:text-sm">
                        <p className="font-semibold mb-1 text-muted-foreground">{formattedDate}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center gap-6">
                            <span className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))]" />
                              Daily Views:
                            </span>
                            <span className="font-bold tabular-nums">
                              {payload[0]?.value?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-6">
                            <span className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]" />
                              Cumulative Views:
                            </span>
                            <span className="font-bold tabular-nums">
                              {payload[1]?.value?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                yAxisId="views"
                dataKey="views"
                type="monotone"
                fill="url(#fillViews)"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="Daily Views"
              />
              <Area
                yAxisId="cumulative"
                dataKey="cumulative_views"
                type="monotone"
                fill="url(#fillCumulative)"
                stroke="hsl(var(--chart-2))"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                name="Cumulative Views"
              />
              <Legend verticalAlign="bottom" height={36} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
