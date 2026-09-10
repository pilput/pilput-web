import { Eye, Heart, MessageCircle, ThumbsUp, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { EngagementMetrics } from "@/types/report";
import { StatCard } from "./StatCard";

interface EngagementSectionProps {
  engagement: EngagementMetrics | null;
  isLoading: boolean;
}

export function EngagementSection({ engagement, isLoading }: EngagementSectionProps) {
  const changePercent = engagement?.periodComparison.changePercent ?? 0;
  const changeIsPositive = changePercent > 0;
  const changeIsNeutral = changePercent === 0;

  return (
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
            isLoading={isLoading}
          />
          <StatCard
            title="Avg Likes / Post"
            value={(engagement?.avgLikesPerPost ?? 0).toLocaleString()}
            icon={Heart}
            iconClassName="bg-rose-500/10 text-rose-500"
            isLoading={isLoading}
          />
          <StatCard
            title="Avg Comments / Post"
            value={(engagement?.avgCommentsPerPost ?? 0).toLocaleString()}
            icon={MessageCircle}
            iconClassName="bg-amber-500/10 text-amber-500"
            isLoading={isLoading}
          />
          <StatCard
            title="Avg Views / Post"
            value={(engagement?.avgViewsPerPost ?? 0).toLocaleString()}
            icon={Eye}
            iconClassName="bg-emerald-500/10 text-emerald-500"
            isLoading={isLoading}
          />
        </div>

        {!isLoading && engagement && (
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
  );
}
