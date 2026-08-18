import { create } from "zustand";
import { apiClient } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import type { Post, PostAnalyticsData } from "@/types/post";

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: boolean;
  total: number;
  analytics: PostAnalyticsData | null;
  analyticsLoading: boolean;
  fetch: (limit?: number, offset?: number) => Promise<void>;
  fetchPublic: (limit?: number, offset?: number) => Promise<void>;
  fetchAnalytics: (startDate?: string, endDate?: string) => Promise<void>;
}

export const postsStore = create<PostsState>()((set) => ({
  posts: [],
  loading: false,
  error: false,
  total: 0,
  analytics: null,
  analyticsLoading: false,

  fetch: async (limit = 10, offset = 0) => {
    set({ loading: true, error: false });
    try {
      const { data } = await apiClient.get<{
        data: Post[];
        success: boolean;
        meta?: { total_items: number };
      }>("/api/posts/me", {
        params: { limit, offset },
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (data?.success && data?.data) {
        set({
          posts: data.data,
          total: data.meta?.total_items ?? data.data.length,
          loading: false,
          error: false,
        });
      } else {
        set({ loading: false, error: true });
      }
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
      set({ loading: false, error: true });
    }
  },

  fetchPublic: async (limit = 10, offset = 0) => {
    set({ loading: true, error: false });
    try {
      const { data } = await apiClient.get<{
        data?: Post[];
        meta?: { total_items: number };
        total?: number;
      }>("/api/posts", {
        params: { limit, offset },
      });

      if (data?.data) {
        const nextTotal = data.meta?.total_items ?? data.total ?? data.data.length;
        set({
          posts: data.data,
          total: nextTotal,
          loading: false,
          error: false,
        });
      } else {
        set({ loading: false, error: true });
      }
    } catch (error) {
      console.error("Failed to fetch public posts:", error);
      set({ loading: false, error: true });
    }
  },

  fetchAnalytics: async (startDate, endDate) => {
    set({ analyticsLoading: true, error: false });
    try {
      const params: Record<string, string> = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const { data } = await apiClient.get<{
        data: PostAnalyticsData;
        success: boolean;
      }>("/api/posts/me/analytics", {
        params,
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (data?.success && data?.data) {
        set({ analytics: data.data, error: false, analyticsLoading: false });
      } else {
        set({ error: true, analyticsLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch post analytics:", error);
      set({ error: true, analyticsLoading: false });
    }
  },
}));

