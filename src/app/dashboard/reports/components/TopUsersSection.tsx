import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Trophy, UserPlus, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserReport } from "@/types/report";
import { StatCard } from "./StatCard";
import { displayName } from "../utils";

interface TopUsersSectionProps {
  userReport: UserReport | null;
  isLoading: boolean;
}

export function TopUsersSection({ userReport, isLoading }: TopUsersSectionProps) {
  const growthChartData = useMemo(() => userReport?.growthTrend ?? [], [userReport]);

  return (
    <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
      <CardHeader className="border-b border-border/50 py-5">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Top Users
        </CardTitle>
        <CardDescription className="text-sm">
          Users with the most published posts, views, and likes in the selected range.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Users"
            value={(userReport?.totalUsers ?? 0).toLocaleString()}
            icon={Users}
            iconClassName="bg-blue-500/10 text-blue-500"
            isLoading={isLoading}
          />
          <StatCard
            title="New Users This Period"
            value={(userReport?.newUsersThisPeriod ?? 0).toLocaleString()}
            icon={UserPlus}
            iconClassName="bg-cyan-500/10 text-cyan-500"
            isLoading={isLoading}
          />
          <StatCard
            title="Active Users"
            value={(userReport?.activeUsers ?? 0).toLocaleString()}
            icon={Activity}
            iconClassName="bg-teal-500/10 text-teal-500"
            isLoading={isLoading}
          />
        </div>

        <div>
          {isLoading ? (
            <div className="h-[220px] flex items-center justify-center">
              <Skeleton className="h-[190px] w-full rounded-xl" />
            </div>
          ) : growthChartData.length === 0 ? (
            <div className="h-[100px] flex items-center justify-center text-muted-foreground text-sm">
              No user growth data for this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={growthChartData} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillCumulativeUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.02} />
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
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    } catch {
                      return value;
                    }
                  }}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-3 text-xs">
                          <p className="font-semibold mb-1 text-muted-foreground">{label}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between gap-6">
                              <span>New users</span>
                              <span className="font-bold tabular-nums">{payload[0]?.value?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between gap-6">
                              <span>Cumulative</span>
                              <span className="font-bold tabular-nums">{payload[1]?.value?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  dataKey="newUsers"
                  type="monotone"
                  fill="transparent"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  name="New Users"
                />
                <Area
                  dataKey="cumulativeUsers"
                  type="monotone"
                  fill="url(#fillCumulativeUsers)"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={1.5}
                  name="Cumulative Users"
                />
                <Legend verticalAlign="bottom" height={28} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="min-w-[720px] sm:min-w-0 px-2 sm:px-0">
            <Table>
              <TableCaption>
                {isLoading ? "Loading..." : "Top contributors by post count"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Posts</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[160px]" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : !userReport || userReport.topContributors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No contributors found for this period.
                    </TableCell>
                  </TableRow>
                ) : (
                  userReport.topContributors.map((contributor, index) => (
                    <TableRow key={contributor.id}>
                      <TableCell className="text-muted-foreground tabular-nums">{index + 1}</TableCell>
                      <TableCell className="font-medium">{displayName(contributor)}</TableCell>
                      <TableCell className="text-right tabular-nums">{contributor.postCount.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">{contributor.totalViews.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">{contributor.totalLikes.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
