import { create } from "zustand";
import { getToken } from "@/utils/Auth";
import { apiClientApp } from "@/utils/fetch";

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  image: string;
  issuperadmin: boolean;
  created_at: string;
  updated_at: string;
  fullName: string;
}

type Store = {
  profile: Profile;
  refresh: () => Promise<void>;
};

export const profileStore = create<Store>()((set) => ({
  profile: {
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    image: "",
    issuperadmin: false,
    created_at: "",
    updated_at: "",
    fullName: "",
  },
  refresh: async () => {
    const token = getToken();
    if (!token) {
      return;
    }

    try {
      const response = await apiClientApp.get("/v1/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data?.data;
      if (!data) {
        return;
      }

      set({
        profile: {
          ...data,
          fullName: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
}));
