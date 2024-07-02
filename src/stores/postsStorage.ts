import { create } from 'zustand'
import { axiosIntence2 } from '@/utils/fetch'

interface PostsState {
    posts: Post[]
    fetch: (limit : number, offset : number) => void
    error: boolean
    total: number;
}

export const postsStore = create<PostsState>()((set) => ({
    posts: [],
    fetch: async (limit = 10, offset = 0) => {
        try {
            const response = await axiosIntence2.get("/posts", { params: { limit: limit, offset: offset } })
            set({ posts: response.data.data })
            set({ total: response.data.total })
        } catch (error) {
            console.log("error");
        }
    },
    error: false,
    total: 0
}))