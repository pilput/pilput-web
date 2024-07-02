import { create } from 'zustand'
import { axiosIntence } from '@/utils/fetch'
import { getToken } from '@/utils/Auth'
import { Auth } from '@/type/you'

interface authDataState {
    data: Auth
    fetch: () => void
    error: boolean
}

export const authStore = create<authDataState>()((set) => ({
    data: {
        usename: "loading...",
        email: "Loading...",
        image: "placeholder/spinner.gif",
        first_name: "",
        last_name: "",},
    fetch: async () => {
        try {
            const response = await axiosIntence.get("/auth/profile", {
              headers: { Authorization: `Bearer ${getToken()}` },
            });
            set({ data: response.data })
          } catch (error) {
            console.log(error);
            set({ error: true })
          }
    },
    error: false,
}))