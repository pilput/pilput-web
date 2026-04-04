import type { Post } from "./post";

export interface BookmarkFolder {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  bookmark_count?: number;
  created_at: string;
  updated_at: string;
}

/** Bookmark row from GET /v1/bookmarks */
export interface BookmarkRecord {
  id: string;
  post_id: string;
  user_id: string;
  folder_id: string | null;
  name: string | null;
  notes: string | null;
  post: Post;
  folder?: BookmarkFolder | null;
  created_at: string;
  updated_at: string;
}

export interface ToggleBookmarkData {
  action: "added" | "removed";
  id?: string;
  post_id: string;
  user_id?: string;
  folder_id?: string | null;
  name?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}
