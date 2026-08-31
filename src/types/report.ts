/**
 * Mirrors echobackend/internal/dto/report.go response DTOs exactly.
 * Field names are camelCase to match the backend's JSON tags.
 */

export interface OverviewStats {
  totalUsers: number;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  newUsersToday: number;
  newPostsToday: number;
  activeUsersThisWeek: number;
}

export interface UserGrowthData {
  date: string;
  newUsers: number;
  cumulativeUsers: number;
}

export interface TopContributor {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  postCount: number;
  totalViews: number;
  totalLikes: number;
}

export interface UserReport {
  totalUsers: number;
  newUsersThisPeriod: number;
  activeUsers: number;
  topContributors: TopContributor[];
  growthTrend: UserGrowthData[];
}

export interface PostPerformanceAuthor {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface PostPerformanceData {
  id: string;
  title: string | null;
  slug: string | null;
  views: number;
  likes: number;
  comments: number;
  engagementRate: number;
  author: PostPerformanceAuthor;
  createdAt: string | null;
}

export interface TagPerformance {
  id: number;
  name: string;
  postCount: number;
  totalViews: number;
  totalLikes: number;
}

export interface PostReport {
  totalPosts: number;
  newPostsThisPeriod: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  avgEngagementRate: number;
  topPosts: PostPerformanceData[];
  tagPerformance: TagPerformance[];
}

export interface PeriodComparison {
  current: number;
  previous: number;
  changePercent: number;
}

export interface EngagementMetrics {
  totalEngagements: number;
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
  avgViewsPerPost: number;
  periodComparison: PeriodComparison;
}

export interface OverviewReportResponse {
  overview: OverviewStats;
  engagement: EngagementMetrics;
}
