"use client";

import { useEffect, useMemo, useState } from "react";
import { format, subDays } from "date-fns";
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
import { toast } from "sonner";
import {
  Activity,
  BarChart3,
  Eye,
  FileText,
  Heart,
  MessageCircle,
  RotateCcw,
  Tags as TagsIcon,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getToken, RemoveToken } from "@/utils/Auth";
import { apiClient, isHttpError } from "@/utils/fetch";
import type { Tags } from "@/types/post";
import type {
  EngagementMetrics,
  OverviewReportResponse,
  OverviewStats,
  PostReport,
  UserReport,
} from "@/types/report";

const USERS_LIMIT = 10;
const POSTS_LIMIT = 10;

function defaultStartDate(): string {
  return format(subDays(new Date(), 30), "yyyy-MM-dd");
}

function defaultEndDate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

function displayName(person: {
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}): string {
  const full = [person.firstName, person.lastName].filter(Boolean).join(" ").trim();
  if (full) return full;
  if (person.username) return person.username;
  return "Unknown user";
}

function handleAuthError(error: unknown): boolean {
  if (isHttpError(error)) {
    if (error.response?.status === 401) {
      RemoveToken();
      window.location.href = "/login";
      return true;
    }
    if (error.response?.status === 403) {
      window.location.href = "/forbidden";
      return true;
    }
  }
  return false;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  iconClassName: string;
  isLoading: boolean;
}

function StatCard({ title, value, icon: Icon, iconClassName, isLoading }: StatCardProps) {
  return (
    <div className="glass-card border-glow-hover rounded-2xl transition-all duration-300 group flex items-center justify-between p-5">
      <div className="min-w-0">
        <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          {title}
        </span>
        {isLoading ? (
          <Skeleton className="h-7 w-20 mt-1.5" />
        ) : (
          <div className="text-2xl font-bold tracking-tight text-foreground mt-1.5 truncate">
            {value}
          </div>
        )}
      </div>
      <div
        className={`p-2.5 rounded-xl ring-1 ring-border/40 group-hover:scale-105 transition-transform shrink-0 ${iconClassName}`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [tagId, setTagId] = useState<string>("all");
  const [tags, setTags] = useState<Tags[]>([]);

  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [engagement, setEngagement] = useState<EngagementMetrics | null>(null);
  const [userReport, setUserReport] = useState<UserReport | null>(null);
  const [postReport, setPostReport] = useState<PostReport | null>(null);

  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [isLoadingEngagement, setIsLoadingEngagement] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  async function fetchTags() {
    try {
      const { data: response } = await apiClient.get<{ data?: Tags[] }>("/api/tags");
      if (response.data) {
        setTags(response.data);
      }
    } catch {
      // Tag filter is a nice-to-have; silently ignore failures.
    }
  }

  async function fetchOverview(start: string, end: string) {
    setIsLoadingOverview(true);
    try {
      const { data } = await apiClient.get<{
        success: boolean;
        data: OverviewReportResponse;
      }>("/api/reports/overview", {
        params: { startDate: start, endDate: end },
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (data?.data?.overview) {
        setOverview(data.data.overview);
      } else {
        toast.error("Cannot connect to server");
      }
    } catch (error) {
      if (handleAuthError(error)) return;
      toast.error("Failed to load overview report");
    } finally {
      setIsLoadingOverview(false);
    }
  }

  async function fetchEngagement(start: string, end: string) {
    setIsLoadingEngagement(true);
    try {
      const { data } = await apiClient.get<{ success: boolean; data: EngagementMetrics }>(
        "/api/reports/engagement",
        {
          params: { startDate: start, endDate: end },
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (data?.data) {
        setEngagement(data.data);
      } else {
        toast.error("Cannot connect to server");
      }
    } catch (error) {
      if (handleAuthError(error)) return;
      toast.error("Failed to load engagement metrics");
    } finally {
      setIsLoadingEngagement(false);
    }
  }

  async function fetchUsers(start: string, end: string) {
    setIsLoadingUsers(true);
    try {
      const { data } = await apiClient.get<{ success: boolean; data: UserReport }>(
        "/api/reports/users",
        {
          params: { startDate: start, endDate: end, limit: USERS_LIMIT },
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (data?.data) {
        setUserReport(data.data);
      } else {
        toast.error("Cannot connect to server");
      }
    } catch (error) {
      if (handleAuthError(error)) return;
      toast.error("Failed to load user report");
    } finally {
      setIsLoadingUsers(false);
    }
  }

  async function fetchPosts(start: string, end: string, filterTagId: string) {
    setIsLoadingPosts(true);
    try {
      const { data } = await apiClient.get<{ success: boolean; data: PostReport }>(
        "/api/reports/posts",
        {
          params: {
            startDate: start,
            endDate: end,
            limit: POSTS_LIMIT,
            tagId: filterTagId !== "all" ? filterTagId : undefined,
          },
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (data?.data) {
        setPostReport(data.data);
      } else {
        toast.error("Cannot connect to server");
      }
    } catch (error) {
      if (handleAuthError(error)) return;
      toast.error("Failed to load post report");
    } finally {
      setIsLoadingPosts(false);
    }
  }

  useEffect(() => {
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchOverview(startDate, endDate);
    fetchEngagement(startDate, endDate);
    fetchUsers(startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  useEffect(() => {
    fetchPosts(startDate, endDate, tagId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, tagId]);

  function resetDateRange() {
    setStartDate(defaultStartDate());
    setEndDate(defaultEndDate());
  }

  const growthChartData = useMemo(() => userReport?.growthTrend ?? [], [userReport]);

  const changePercent = engagement?.periodComparison.changePercent ?? 0;
  const changeIsPositive = changePercent > 0;
  const changeIsNeutral = changePercent === 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
            Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Platform-wide statistics on users, content, and engagement.
          </p>
        </div>
      </div>

      {/* Date range filter */}
      <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="space-y-1.5 flex-1">
              <Label htmlFor="report-start-date">Start date</Label>
              <Input
                id="report-start-date"
                type="date"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <Label htmlFor="report-end-date">End date</Label>
              <Input
                id="report-end-date"
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={resetDateRange}
              className="flex items-center gap-2 shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
              Last 30 days
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={(overview?.totalUsers ?? 0).toLocaleString()}
          icon={Users}
          iconClassName="bg-blue-500/10 text-blue-500"
          isLoading={isLoadingOverview}
        />
        <StatCard
          title="Total Posts"
          value={(overview?.totalPosts ?? 0).toLocaleString()}
          icon={FileText}
          iconClassName="bg-indigo-500/10 text-indigo-500"
          isLoading={isLoadingOverview}
        />
        <StatCard
          title="Total Views"
          value={(overview?.totalViews ?? 0).toLocaleString()}
          icon={Eye}
          iconClassName="bg-emerald-500/10 text-emerald-500"
          isLoading={isLoadingOverview}
        />
        <StatCard
          title="Total Likes"
          value={(overview?.totalLikes ?? 0).toLocaleString()}
          icon={Heart}
          iconClassName="bg-rose-500/10 text-rose-500"
          isLoading={isLoadingOverview}
        />
        <StatCard
          title="Total Comments"
          value={(overview?.totalComments ?? 0).toLocaleString()}
          icon={MessageCircle}
          iconClassName="bg-amber-500/10 text-amber-500"
          isLoading={isLoadingOverview}
        />
        <StatCard
          title="New Users Today"
          value={(overview?.newUsersToday ?? 0).toLocaleString()}
          icon={UserPlus}
          iconClassName="bg-cyan-500/10 text-cyan-500"
          isLoading={isLoadingOverview}
        />
        <StatCard
          title="New Posts Today"
          value={(overview?.newPostsToday ?? 0).toLocaleString()}
          icon={FileText}
          iconClassName="bg-violet-500/10 text-violet-500"
          isLoading={isLoadingOverview}
        />
        <StatCard
          title="Active Users This Week"
          value={(overview?.activeUsersThisWeek ?? 0).toLocaleString()}
          icon={Activity}
          iconClassName="bg-teal-500/10 text-teal-500"
          isLoading={isLoadingOverview}
        />
      </div>

      {/* Engagement section */}
      <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
        <CardHeader className="border-b border-border/50 py-5">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-primary" />
            Engagement
          </CardTitle>
          <CardDescription className="text-sm">
            Likes and comments activity for the selected date range, compared to the prior
            period of equal length.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Engagements"
              value={(engagement?.totalEngagements ?? 0).toLocaleString()}
              icon={ThumbsUp}
              iconClassName="bg-primary/10 text-primary"
              isLoading={isLoadingEngagement}
            />
            <StatCard
              title="Avg Likes / Post"
              value={(engagement?.avgLikesPerPost ?? 0).toLocaleString()}
              icon={Heart}
              iconClassName="bg-rose-500/10 text-rose-500"
              isLoading={isLoadingEngagement}
            />
            <StatCard
              title="Avg Comments / Post"
              value={(engagement?.avgCommentsPerPost ?? 0).toLocaleString()}
              icon={MessageCircle}
              iconClassName="bg-amber-500/10 text-amber-500"
              isLoading={isLoadingEngagement}
            />
            <StatCard
              title="Avg Views / Post"
              value={(engagement?.avgViewsPerPost ?? 0).toLocaleString()}
              icon={Eye}
              iconClassName="bg-emerald-500/10 text-emerald-500"
              isLoading={isLoadingEngagement}
            />
          </div>

          {!isLoadingEngagement && engagement && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-4">
              <span className="text-sm text-muted-foreground">
                Likes this period: <span className="font-semibold text-foreground">{engagement.periodComparison.current.toLocaleString()}</span>{" "}
                vs previous <span className="font-semibold text-foreground">{engagement.periodComparison.previous.toLocaleString()}</span>
              </span>
              <span
                className={`flex items-center gap-1 text-sm font-semibold ${
                  changeIsNeutral
                    ? "text-muted-foreground"
                    : changeIsPositive
                      ? "text-emerald-500"
                      : "text-destructive"
                }`}
              >
                {changeIsNeutral ? null : changeIsPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {changeIsPositive ? "+" : ""}
                {changePercent.toFixed(1)}%
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top users */}
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
              isLoading={isLoadingUsers}
            />
            <StatCard
              title="New Users This Period"
              value={(userReport?.newUsersThisPeriod ?? 0).toLocaleString()}
              icon={UserPlus}
              iconClassName="bg-cyan-500/10 text-cyan-500"
              isLoading={isLoadingUsers}
            />
            <StatCard
              title="Active Users"
              value={(userReport?.activeUsers ?? 0).toLocaleString()}
              icon={Activity}
              iconClassName="bg-teal-500/10 text-teal-500"
              isLoading={isLoadingUsers}
            />
          </div>

          {/* Growth trend chart */}
          <div>
            {isLoadingUsers ? (
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

          {/* Top contributors table */}
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="min-w-[720px] sm:min-w-0 px-2 sm:px-0">
              <Table>
                <TableCaption>
                  {isLoadingUsers ? "Loading..." : "Top contributors by post count"}
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
                  {isLoadingUsers ? (
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

      {/* Top posts */}
      <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
        <CardHeader className="border-b border-border/50 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Top Posts
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Posts ranked by views, likes, and comments in the selected range.
              </CardDescription>
            </div>
            {tags.length > 0 && (
              <Select value={tagId} onValueChange={setTagId}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id ?? tag.name} value={String(tag.id)}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard
              title="Total Posts"
              value={(postReport?.totalPosts ?? 0).toLocaleString()}
              icon={FileText}
              iconClassName="bg-indigo-500/10 text-indigo-500"
              isLoading={isLoadingPosts}
            />
            <StatCard
              title="New Posts"
              value={(postReport?.newPostsThisPeriod ?? 0).toLocaleString()}
              icon={FileText}
              iconClassName="bg-violet-500/10 text-violet-500"
              isLoading={isLoadingPosts}
            />
            <StatCard
              title="Views"
              value={(postReport?.totalViews ?? 0).toLocaleString()}
              icon={Eye}
              iconClassName="bg-emerald-500/10 text-emerald-500"
              isLoading={isLoadingPosts}
            />
            <StatCard
              title="Likes"
              value={(postReport?.totalLikes ?? 0).toLocaleString()}
              icon={Heart}
              iconClassName="bg-rose-500/10 text-rose-500"
              isLoading={isLoadingPosts}
            />
            <StatCard
              title="Comments"
              value={(postReport?.totalComments ?? 0).toLocaleString()}
              icon={MessageCircle}
              iconClassName="bg-amber-500/10 text-amber-500"
              isLoading={isLoadingPosts}
            />
            <StatCard
              title="Avg Engagement"
              value={`${(postReport?.avgEngagementRate ?? 0).toFixed(2)}%`}
              icon={TrendingUp}
              iconClassName="bg-primary/10 text-primary"
              isLoading={isLoadingPosts}
            />
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="min-w-[820px] sm:min-w-0 px-2 sm:px-0">
              <Table>
                <TableCaption>
                  {isLoadingPosts ? "Loading..." : "Top posts by engagement"}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Likes</TableHead>
                    <TableHead className="text-right">Comments</TableHead>
                    <TableHead className="text-right">Engagement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingPosts ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[220px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : !postReport || postReport.topPosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No posts found for this period.
                      </TableCell>
                    </TableRow>
                  ) : (
                    postReport.topPosts.map((post, index) => (
                      <TableRow key={post.id}>
                        <TableCell className="text-muted-foreground tabular-nums">{index + 1}</TableCell>
                        <TableCell className="font-medium max-w-[280px] truncate">
                          {post.title ?? "Untitled"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{displayName(post.author)}</TableCell>
                        <TableCell className="text-right tabular-nums">{post.views.toLocaleString()}</TableCell>
                        <TableCell className="text-right tabular-nums">{post.likes.toLocaleString()}</TableCell>
                        <TableCell className="text-right tabular-nums">{post.comments.toLocaleString()}</TableCell>
                        <TableCell className="text-right tabular-nums">{post.engagementRate.toFixed(2)}%</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {!isLoadingPosts && postReport && postReport.tagPerformance.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                <TagsIcon className="h-4 w-4" />
                Tag performance
              </div>
              <div className="flex flex-wrap gap-2">
                {postReport.tagPerformance.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-xs font-normal py-1 px-2.5">
                    {tag.name}
                    <span className="ml-1.5 text-muted-foreground">
                      {tag.postCount} posts &middot; {tag.totalViews.toLocaleString()} views
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
