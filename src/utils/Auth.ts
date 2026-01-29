import { getCookie } from "cookies-next";
import { axiosInstance2, axiosInstance3 } from "./fetch";
import { Config } from "./getConfig";

export function getToken() {
  let token = getCookie("token");
  return token;
}

export function logOut() {
  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${Config.maindomain};`;
}

export function RemoveToken() {
  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${Config.maindomain};`;
}
