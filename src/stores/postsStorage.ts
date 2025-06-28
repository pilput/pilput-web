import { create } from 'zustand'
import { axiosInstence, axiosInstence2 } from '@/utils/fetch'
import { getToken } from '@/utils/Auth'

interface PostsState {
    posts: Post[]
    fetch: (limit: number, offset: number) => void
    fetchPublic: (limit: number, offset: number) => void
    error: boolean
    total: number;
}

export const postsStore = create<PostsState>()((set) => ({
    posts: [],
    fetch: async (limit = 10, offset = 0) => {
        try {
            const { data } = await axiosInstence2.get("/v1/posts/mine", {
                params: { limit: limit, offset: offset },
                headers: { "Authorization": `Bearer ${getToken()}` }
            })
            const response = data as { data: Post[], success: boolean, metadata: { totalItems: number } }
            if (response.success) {
                set({ posts: response.data })
                set({ total: response.metadata.totalItems })
            } else {
                set({ error: true })
            }
        } catch (error) {
            console.error(error);
        }
    },
    fetchPublic: async (limit = 10, offset = 0) => {
        try {
            const { data } = await axiosInstence.get("/v1/posts", {
                params: { limit: limit, offset: offset }
            })
            const response = data
            if (response.data) {
                set({ posts: response.data })
                if (response.metadata && response.metadata.totalItems) {
                    set({ total: response.metadata.totalItems })
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
    total: 0
}))