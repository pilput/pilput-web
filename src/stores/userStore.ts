import { create } from "zustand";
import { axiosIntence, axiosIntence2 } from "@/utils/fetch";
import { getToken, RemoveToken } from "@/utils/Auth";
import { Auth } from "@/type/you";
import { AxiosError } from "axios";

interface authDataState {
  data: Auth;
  fetch: () => void;
  error: boolean;
}

export const authStore = create<authDataState>()((set) => ({
  data: {
    username: "loading...",
    email: "Loading...",
    image: "placeholder/spinner.gif",
    first_name: "",
    last_name: "",
  },
  fetch: async () => {
    try {
      const response = await axiosIntence2.get("/users/me", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      set({ data: response.data });
      
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          RemoveToken();
          window.location.href = "/login";
        }
      }
      console.log(error);
      set({ error: true });
    }
  },
  error: false,
}));
