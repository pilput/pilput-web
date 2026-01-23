import { create } from "zustand";
import { axiosInstance3 } from "@/utils/fetch";
import { getToken, RemoveToken } from "@/utils/Auth";
import type { Auth } from "@/types/you";
import { AxiosError } from "axios";

interface authDataState {
  data: Auth;
  fetch: () => void;
  error: boolean;
}

interface responseSuccess {
  data: Auth;
  message: string;
  success: boolean;
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
      const { data } = await axiosInstance3.get("/v1/users/me", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const response = data as responseSuccess;
      
      set({ data: response.data, error: false });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          RemoveToken();
          // Error will be handled in the component layer
        }
      }
      console.log(error);
      set({ error: true });
    }
  },
  error: false,
}));
