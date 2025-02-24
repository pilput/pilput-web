import { getCookie } from "cookies-next";
import { axiosInstence2 } from "./fetch";

export function getToken() {
  let token = getCookie("token");
  return token;
}

export const getAuth = async () => {
  const auth = await axiosInstence2.get("/api/v1/profile");
  return auth.data;
};

export function logOut() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function RemoveToken() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}