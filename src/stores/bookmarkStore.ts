import { create } from "zustand";
import {
  getBookmarks,
  toggleBookmark as toggleBookmarkRequest,
  createBookmarkFolder,
  getBookmarkFolders,
  updateBookmark as updateBookmarkRequest,
  moveBookmark as moveBookmarkRequest,
  updateBookmarkFolder,
  deleteBookmarkFolder,
} from "@/utils/bookmarks";
import { getToken } from "@/utils/Auth";
import type { ApiEnvelope, BookmarkFolder, BookmarkRecord } from "@/types/bookmark";

interface BookmarkState {
  byPostId: Record<string, boolean>;
  bookmarks: BookmarkRecord[] | null;
  folders: BookmarkFolder[] | null;
  loading: boolean;
  loaded: boolean;
  loadingFolders: boolean;
  loadedFolders: boolean;
  loadBookmarks: (force?: boolean) => Promise<void>;
  loadFolders: (force?: boolean) => Promise<void>;
  toggleBookmark: (
    postId: string,
    body?: { folder_id?: string | null; name?: string; notes?: string },
  ) => Promise<"added" | "removed">;
  isBookmarked: (postId: string) => boolean;
  createFolder: (name: string, description?: string) => Promise<void>;
  updateFolder: (id: string, name: string, description?: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  updateBookmark: (id: string, name?: string, notes?: string) => Promise<void>;
  moveBookmark: (id: string, folderId: string | null) => Promise<void>;
  reset: () => void;
}

export const bookmarkStore = create<BookmarkState>()((set, get) => ({
  byPostId: {},
  bookmarks: null,
  folders: null,
  loading: false,
  loaded: false,
  loadingFolders: false,
  loadedFolders: false,

  reset: () =>
    set({
      byPostId: {},
      bookmarks: null,
      folders: null,
      loaded: false,
      loading: false,
      loadedFolders: false,
      loadingFolders: false,
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

  loadFolders: async (force = false) => {
    if (!getToken()) {
      return;
    }
    const { loadedFolders } = get();
    if (loadedFolders && !force) {
      return;
    }
    set({ loadingFolders: true });
    try {
      const res = await getBookmarkFolders();
      const envelope = res.data as ApiEnvelope<BookmarkFolder[]>;
      const list = envelope.data ?? [];
      set({ folders: list, loadedFolders: true, loadingFolders: false });
    } catch {
      set({ loadingFolders: false });
      throw new Error("FOLDERS_LOAD_FAILED");
    }
  },

  isBookmarked: (postId: string) => Boolean(get().byPostId[postId]),

  toggleBookmark: async (postId, body) => {
    if (!getToken()) {
      throw new Error("NOT_AUTHENTICATED");
    }
    const res = await toggleBookmarkRequest(postId, body);
    const envelope = res.data as ApiEnvelope<{ action: "added" | "removed" }>;
    const action = envelope.data.action;
    await Promise.all([get().loadBookmarks(true), get().loadFolders(true)]);
    return action;
  },

  createFolder: async (name: string, description?: string) => {
    if (!getToken()) return;
    await createBookmarkFolder({ name, description });
    await get().loadFolders(true);
  },

  updateFolder: async (id: string, name: string, description?: string) => {
    if (!getToken()) return;
    await updateBookmarkFolder(id, { name, description });
    await Promise.all([get().loadFolders(true), get().loadBookmarks(true)]);
  },

  deleteFolder: async (id: string) => {
    if (!getToken()) return;
    await deleteBookmarkFolder(id);
    await Promise.all([get().loadFolders(true), get().loadBookmarks(true)]);
  },

  updateBookmark: async (id: string, name?: string, notes?: string) => {
    if (!getToken()) return;
    await updateBookmarkRequest(id, { name, notes });
    await get().loadBookmarks(true);
  },

  moveBookmark: async (id: string, folderId: string | null) => {
    if (!getToken()) return;
    await moveBookmarkRequest(id, folderId);
    await Promise.all([get().loadBookmarks(true), get().loadFolders(true)]);
  },
}));
