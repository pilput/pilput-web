import { getCookie } from "cookies-next";
import { axiosInstance2 } from "./fetch";
import { Config } from "./getConfig";

export function getToken() {
  let token = getCookie("token");
  return token;
}

export const getAuth = async () => {
  const auth = await axiosInstance2.get("/api/v1/profile");
  return auth.data;
};

export function logOut() {
  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${Config.maindomain};`;
}

export function RemoveToken() {
  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${Config.maindomain};`;
}