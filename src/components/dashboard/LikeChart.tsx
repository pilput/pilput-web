"use client"

import * as React from "react"
import { format, startOfMonth, subMonths } from "date-fns"
import { Heart } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { getToken, RemoveToken } from "@/utils/Auth"
import { apiClientApp, isHttpError } from "@/utils/fetch"
import { toast } from "sonner"

type MyLikesByMonthItem = {
  month: string
  count: number
}

type MyLikesByMonthResponse = {
  success: boolean
  message?: string
  data: MyLikesByMonthItem[]
}

function monthKeysForWindow(months: number): string[] {
  const now = new Date()
  const keys: string[] = []
  for (let i = months - 1; i >= 0; i--) {
    const d = subMonths(startOfMonth(now), i)
    keys.push(format(d, "yyyy-MM"))
  }
  return keys
}

function formatMonthLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number)
  if (!y || !m) return ym
  const d = new Date(y, m - 1, 1)
  return format(d, "MMM yyyy")
}

function formatMonthShort(ym: string): string {
  const [y, m] = ym.split("-").map(Number)
  if (!y || !m) return ym
  const d = new Date(y, m - 1, 1)
  return format(d, "MMM")
}

type LikesTooltipProps = {
  active?: boolean
  payload?: Array<{ payload?: { monthKey?: string; count?: number } }>
}

function LikesTooltip({ active, payload }: LikesTooltipProps) {
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload
  const key = row?.monthKey
  const count = row?.count ?? 0
  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-md">
      <p className="font-medium">
        {key ? formatMonthLabel(key) : "Month"}
      </p>
      <p className="text-muted-foreground">
        {count.toLocaleString()} {count === 1 ? "like" : "likes"}
      </p>
    </div>
  )
}

export default function LikeChart() {
  const [months, setMonths] = React.useState(12)
  const [isLoading, setIsLoading] = React.useState(true)
  const [chartData, setChartData] = React.useState<
    { monthKey: string; count: number }[]
  >([])

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      try {
        const { data } = await apiClientApp.get<MyLikesByMonthResponse>(
          "/v1/posts/charts/my-likes-by-month",
          {
            params: { months },
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          },
        )

        if (cancelled) return

        if (!data.success || !Array.isArray(data.data)) {
          toast.error("Could not load likes chart")
          setChartData([])
          return
        }

        const byMonth = new Map<string, number>()
        for (const row of data.data) {
          if (row?.month) {
            byMonth.set(row.month, row.count ?? 0)
          }
        }

        const keys = monthKeysForWindow(months)
        const merged = keys.map((monthKey) => ({
          monthKey,
          count: byMonth.get(monthKey) ?? 0,
        }))

        setChartData(merged)
      } catch (error) {
        if (cancelled) return
        if (isHttpError(error)) {
          if (error.response?.status === 401) {
            RemoveToken()
            window.location.href = "/login"
            return
          }
          if (error.response?.status === 403) {
            window.location.href = "/forbidden"
            return
          }
        }
        toast.error("Could not load likes chart")
        setChartData([])
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [months])

  const totalLikes = chartData.reduce((sum, row) => sum + row.count, 0)

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" aria-hidden />
            My Likes by Month
          </CardTitle>
          <CardDescription>
            Likes received on your posts, grouped by calendar month
          </CardDescription>
        </div>
        <Select
          value={String(months)}
          onValueChange={(v) => setMonths(Number(v))}
        >
          <SelectTrigger
            className="w-[160px]"
            aria-label="Number of months to show"
          >
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">Last 6 months</SelectItem>
            <SelectItem value="12">Last 12 months</SelectItem>
            <SelectItem value="24">Last 24 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Skeleton className="h-[260px] w-[95%] rounded-lg" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="monthKey"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: string) => formatMonthShort(value)}
              />
              <Tooltip cursor={false} content={<LikesTooltip />} />
              <Bar
                dataKey="count"
                name="Likes"
                fill="hsl(var(--chart-1))"
                radius={4}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="font-medium leading-none">
          {isLoading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            <>
              {totalLikes.toLocaleString()}{" "}
              {totalLikes === 1 ? "like" : "likes"} in this period
            </>
          )}
        </div>
        <p className="leading-none text-muted-foreground">
          Months without likes appear as zero so the timeline stays complete.
        </p>
      </CardFooter>
    </Card>
  )
}
