import { getCookie } from "cookies-next";
import { getData } from "./fetch";

export function getToken() {
  let token = getCookie("token");
  return token;
}

export const getAuth = async () => {
  const auth = await getData("/api/v1/profile");
  return auth.data;
};