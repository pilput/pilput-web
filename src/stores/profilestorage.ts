import { apibaseurl, getData } from "@/utils/fetch";
import axios from "axios";
import { create } from "zustand";
import { getToken } from "@/utils/Auth";
import {storagebaseurl} from '@/utils/fetch'

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
  refresh: () => void;
};

export const profileStore = create<Store>()((set) => ({
  profile: {
    id: "",
    email: "temp@gmail.com",
    first_name: "temp",
    last_name: "admin",
    image: "/wkwkw",
    issuperadmin: false,
    created_at: "2023-06-13T09:58:56.003Z",
    updated_at: "2023-06-13T09:58:56.003Z",
    fullName: "temp",
  },
  refresh: () => {
    axios
      .get(apibaseurl+"/auth/profile", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        const data = response.data;
        set({ profile: data });
      })
      .catch((error) => {
        console.error(error);
      });
  },
}));
