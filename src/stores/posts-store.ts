import { create } from 'zustand'
import { apiClient } from '@/utils/fetch'
import { getToken } from '@/utils/Auth'
import type { Post, PostAnalyticsData } from '@/types/post'

interface PostsState {
    posts: Post[]
    fetch: (limit: number, offset: number) => void
    fetchPublic: (limit: number, offset: number) => void
    error: boolean
    total: number;
    analytics: PostAnalyticsData | null;
    analyticsLoading: boolean;
    fetchAnalytics: (startDate?: string, endDate?: string) => Promise<void>;
}

export const postsStore = create<PostsState>()((set) => ({
    posts: [],
    fetch: async (limit = 10, offset = 0) => {
        try {
            const { data } = await apiClient.get("/api/posts/me", {
                params: { limit: limit, offset: offset },
                headers: { "Authorization": `Bearer ${getToken()}` }
            })
            const response = data as { data: Post[], success: boolean, meta: { total_items: number } }
            if (response.success) {
                set({ posts: response.data })
                set({ total: response.meta.total_items })
            } else {
                set({ error: true })
            }
        } catch (error) {
            console.error(error);
        }
    },
    fetchPublic: async (limit = 10, offset = 0) => {
        try {
            const { data } = await apiClient.get("/api/posts", {
                params: { limit: limit, offset: offset }
            })
            const response = data
            if (response.data) {
                set({ posts: response.data })
                if (response.meta && response.meta.total_items) {
                    set({ total: response.meta.total_items })
                } else if (response.total) {
                    set({ total: response.total })
                }
            } else {
                set({ error: true })
            }
        } catch (error) {
            console.error(error);
        }
    },
    error: false,
    total: 0,
    analytics: null,
    analyticsLoading: false,
    fetchAnalytics: async (startDate, endDate) => {
        set({ analyticsLoading: true });
        try {
            const params: Record<string, string> = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const { data } = await apiClient.get("/api/posts/me/analytics", {
                params,
                headers: { "Authorization": `Bearer ${getToken()}` }
            });
            const response = data as { data: PostAnalyticsData; success: boolean };
            if (response.success && response.data) {
                set({ analytics: response.data, error: false });
            } else {
                set({ error: true });
            }
        } catch (error) {
            console.error("Failed to fetch post analytics:", error);
            set({ error: true });
        } finally {
            set({ analyticsLoading: false });
        }
    }
}))

