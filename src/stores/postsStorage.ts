import { create } from 'zustand'
import { axiosInstence } from '@/utils/fetch'
import { getToken } from '@/utils/Auth'

interface PostsState {
    posts: Post[]
    fetch: (limit: number, offset: number) => void
    error: boolean
    total: number;
}

export const postsStore = create<PostsState>()((set) => ({
    posts: [],
    fetch: async (limit = 10, offset = 0) => {
        try {
            const { data } = await axiosInstence.get("/v1/posts/mine", {
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
    error: false,
    total: 0
}))