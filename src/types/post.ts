export interface Post {
  id: string;
  title: string;
  body: string;
  slug: string;
  user: User;
  photo_url: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  view_count: number;
  /** Some API responses use `likes_count`, others `like_count`. */
  likes_count?: number;
  like_count?: number;
  /** Present when the post payload is loaded with an authenticated context. */
  is_liked_by_current_user?: boolean;
  comments_count?: number;
  /** Total bookmarks (saves) for this post when the API includes it. */
  bookmark_count?: number;
  tags: Tags[];
}

export interface PostCreate {
  title: string;
  body: string;
  slug: string;
  photo_url: string;
  /** Tag names only, e.g. `['coding', 'history']` */
  tags: string[];
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

/** Resolves like total whether the payload uses `likes_count` or `like_count`. */
export function getPostLikesCount(
  post: Pick<Post, "likes_count" | "like_count">,
): number {
  const raw = post.likes_count ?? post.like_count;
  const n = Number(raw);
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
  text: string;
  replies: Comment[];
  created_at: string;
  user: User;
}
