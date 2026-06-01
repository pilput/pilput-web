export interface UserBrief {
  id: string;
  username: string | null;
  image: string | null;
}

export interface Post {
  id: string;
  title: string | null;
  photo_url: string | null;
  body: string | null;
  slug: string | null;
  view_count: number;
  like_count: number;
  bookmark_count: number;
  published: boolean | null;
  published_at?: string | null;
  user: UserBrief | null;
  tags: Tags[];
  created_at: string | null;
  updated_at: string | null;
  deleted_at?: string | null;
  is_liked_by_current_user?: boolean;
  comments_count?: number;
}

export interface PostCreate {
  title: string;
  body: string;
  slug: string;
  photo_url: string;
  /** Tag names only, e.g. `['coding', 'history']` */
  tags: string[];
  published?: boolean;
}

export interface ErrorCreatePost {
  error: {
    name: string;
    issues: {
      path: string[];
      message: string;
    }[];
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  image: string;
}

/** `id` is set when loaded from API; omit for new tags on create/update. */
export interface Tags {
  id?: number;
  name: string;
}

/** Resolves like total from the updated API likes count field. */
export function getPostLikesCount(
  post: Pick<Post, "like_count">,
): number {
  const n = Number(post.like_count);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

export function getPostBookmarkCount(
  post: Pick<Post, "bookmark_count">,
): number {
  const n = Number(post.bookmark_count);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

export interface Comment {
  id: string;
  post_id: string;
  parent_comment_id: string | null;
  text: string;
  user: UserBrief | null;
  created_at: string | null;
  updated_at: string | null;
  replies?: Comment[];
}

export interface PostAnalyticsData {
  summary: {
    total_posts: number;
    published_posts: number;
    total_views: number;
    total_likes: number;
  };
  view_trend: {
    date: string;
    views: number;
    cumulative_views: number;
  }[];
  top_posts: {
    id: string;
    title: string;
    slug: string;
    view_count: number;
    like_count: number;
  }[];
}
