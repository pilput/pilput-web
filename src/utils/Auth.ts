import { getCookie } from "cookies-next";

export function getToken() {
  let token = getCookie("token");
  return token;
}
