import { create } from "zustand";
import { apiClient, isHttpError } from "@/utils/fetch";
import { clearTokens, getToken } from "@/utils/Auth";
import type { Auth } from "@/types/you";

const INITIAL_USER: Auth = {
  username: "",
  email: "",
  image: "",
  first_name: "",
  last_name: "",
  is_super_admin: false,
};

interface authDataState {
  data: Auth;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: boolean;
  fetch: () => Promise<void>;
  reset: () => void;
}

interface responseSuccess {
  data: Auth;
  message: string;
  success: boolean;
}

export const authStore = create<authDataState>()((set) => ({
  data: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  error: false,
  reset: () =>
    set({
      data: INITIAL_USER,
      isLoading: false,
      isAuthenticated: false,
      error: false,
    }),
  fetch: async () => {
    const token = getToken();
    if (!token) {
      set({
        data: INITIAL_USER,
        isLoading: false,
        isAuthenticated: false,
        error: false,
      });
      return;
    }
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get<responseSuccess>("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data?.data) {
        set({
          data: data.data,
          isAuthenticated: true,
          isLoading: false,
          error: false,
        });
      } else {
        set({ isLoading: false, error: true });
      }
    } catch (error) {
      if (isHttpError(error) && error.response?.status === 401) {
        clearTokens();
        set({
          data: INITIAL_USER,
          isAuthenticated: false,
          isLoading: false,
          error: true,
        });
      } else {
        set({ isLoading: false, error: true });
      }
    }
  },
}));

