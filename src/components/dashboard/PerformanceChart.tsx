"use client"

import * as React from "react"
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts"

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
  { metric: "Speed", value: 186 },
  { metric: "Reliability", value: 305 },
  { metric: "Security", value: 237 },
  { metric: "Usability", value: 273 },
  { metric: "Scalability", value: 209 },
  { metric: "Performance", value: 214 },
]

const chartConfig = {
  value: {
    label: "Score",
    color: "#ec4899",
  },
} satisfies ChartConfig

export default function Component() {
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>
          System performance across key indicators
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarAngleAxis dataKey="metric" />
            <PolarGrid />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 400]}
              tick={false}
              tickCount={6}
              axisLine={false}
            />
            <Radar
              dataKey="value"
              fill="#ec4899"
              fillOpacity={0.6}
              stroke="#ec4899"
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
