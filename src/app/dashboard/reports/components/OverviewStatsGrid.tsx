import {
  Activity,
  Eye,
  FileText,
  Heart,
  MessageCircle,
  UserPlus,
  Users,
} from "lucide-react";
import type { OverviewStats } from "@/types/report";
import { StatCard } from "./StatCard";

interface OverviewStatsGridProps {
  overview: OverviewStats | null;
  isLoading: boolean;
}

export function OverviewStatsGrid({ overview, isLoading }: OverviewStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Users"
        value={(overview?.totalUsers ?? 0).toLocaleString()}
        icon={Users}
        iconClassName="bg-blue-500/10 text-blue-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Total Posts"
        value={(overview?.totalPosts ?? 0).toLocaleString()}
        icon={FileText}
        iconClassName="bg-indigo-500/10 text-indigo-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Total Views"
        value={(overview?.totalViews ?? 0).toLocaleString()}
        icon={Eye}
        iconClassName="bg-emerald-500/10 text-emerald-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Total Likes"
        value={(overview?.totalLikes ?? 0).toLocaleString()}
        icon={Heart}
        iconClassName="bg-rose-500/10 text-rose-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Total Comments"
        value={(overview?.totalComments ?? 0).toLocaleString()}
        icon={MessageCircle}
        iconClassName="bg-amber-500/10 text-amber-500"
        isLoading={isLoading}
      />
      <StatCard
        title="New Users Today"
        value={(overview?.newUsersToday ?? 0).toLocaleString()}
        icon={UserPlus}
        iconClassName="bg-cyan-500/10 text-cyan-500"
        isLoading={isLoading}
      />
      <StatCard
        title="New Posts Today"
        value={(overview?.newPostsToday ?? 0).toLocaleString()}
        icon={FileText}
        iconClassName="bg-violet-500/10 text-violet-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Active Users This Week"
        value={(overview?.activeUsersThisWeek ?? 0).toLocaleString()}
        icon={Activity}
        iconClassName="bg-teal-500/10 text-teal-500"
        isLoading={isLoading}
      />
    </div>
  );
}
