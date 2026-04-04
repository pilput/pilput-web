import { create } from "zustand";
import {
  getBookmarks,
  toggleBookmark as toggleBookmarkRequest,
} from "@/utils/bookmarks";
import { getToken } from "@/utils/Auth";
import type { ApiEnvelope, BookmarkRecord } from "@/types/bookmark";

interface BookmarkState {
  byPostId: Record<string, boolean>;
  bookmarks: BookmarkRecord[] | null;
  loading: boolean;
  loaded: boolean;
  loadBookmarks: (force?: boolean) => Promise<void>;
  toggleBookmark: (postId: string) => Promise<"added" | "removed">;
  isBookmarked: (postId: string) => boolean;
  reset: () => void;
}

export const bookmarkStore = create<BookmarkState>()((set, get) => ({
  byPostId: {},
  bookmarks: null,
  loading: false,
  loaded: false,

  reset: () =>
    set({
      byPostId: {},
      bookmarks: null,
      loaded: false,
      loading: false,
    }),

  loadBookmarks: async (force = false) => {
    if (!getToken()) {
      return;
    }
    const { loaded } = get();
    if (loaded && !force) {
      return;
    }
    set({ loading: true });
    try {
      const res = await getBookmarks();
      const envelope = res.data as ApiEnvelope<BookmarkRecord[]>;
      const list = envelope.data ?? [];
      const byPostId: Record<string, boolean> = {};
      for (const b of list) {
        byPostId[b.post_id] = true;
      }
      set({ byPostId, bookmarks: list, loaded: true, loading: false });
    } catch {
      set({ loading: false });
      throw new Error("BOOKMARKS_LOAD_FAILED");
    }
  },

  isBookmarked: (postId: string) => Boolean(get().byPostId[postId]),

  toggleBookmark: async (postId: string) => {
    if (!getToken()) {
      throw new Error("NOT_AUTHENTICATED");
    }
    const res = await toggleBookmarkRequest(postId);
    const envelope = res.data as ApiEnvelope<{ action: "added" | "removed" }>;
    const action = envelope.data.action;
    await get().loadBookmarks(true);
    return action;
  },
}));
