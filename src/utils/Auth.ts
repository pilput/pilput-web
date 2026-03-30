import { getCookie } from "cookies-next";
import { Config } from "./getConfig";

export function getToken() {
  let token = getCookie("token");
  return token;
}

export function logOut() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${Config.maindomain};`;
}

export function RemoveToken() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${Config.maindomain};`;
}
