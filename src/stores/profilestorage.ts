import { create } from "zustand";

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
  refresh: (data: Profile) => void;
};

export const profileStore = create<Store>()((set) => ({
  profile: {
    id: "1",
    email: "temp@gmail.com",
    first_name: "temp",
    last_name: "admin",
    image: "/wkwkw",
    issuperadmin: false,
    created_at: "2023-06-13T09:58:56.003Z",
    updated_at: "2023-06-13T09:58:56.003Z",
    fullName: "temp",
  },
  refresh: (newdata) => set({profile:newdata}),
}));
