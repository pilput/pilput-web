/**
 * Mirrors echobackend/internal/dto/stats.go response DTOs exactly.
 * Served by GET /api/users/stats, /api/posts/stats, /api/posts/stats/engagement
 * and /api/tags/stats.
 * Field names are camelCase to match the backend's JSON tags.
 */

/** Card data shown on the overview grid, composed client-side from users/stats and posts/stats. */
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
  newUsersToday: number;
  activeUsersThisWeek: number;
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

export interface PostStats {
  totalPosts: number;
  newPostsThisPeriod: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  newPostsToday: number;
  avgEngagementRate: number;
  topPosts: PostPerformanceData[];
}

/** posts/stats joined with tags/stats for the dashboard. */
export interface PostReport extends PostStats {
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
