import axios from "axios";
import { getToken } from "./Auth";
import { ErrorHandlerAPI } from "./ErrorHandler";
import { Config } from "./getConfig";

export const axiosInstance = axios.create({
  baseURL: Config.apibaseurl,
});
export const axiosInstance2 = axios.create({
  baseURL: Config.apibaseurl2,
});
export const axiosInstance3 = axios.create({
  baseURL: Config.apibaseurl3,
});


export async function getDataExternal(url: string, params: any) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await axiosInstance3.post("/v1/auth/forgot-password", {
      email,
    });
    return response.data;
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    const response = await axiosInstance3.post("/v1/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export function followUser(userId: string) {
  return axiosInstance3.post(
    `/v1/users/${userId}/follow`,
    {},
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  );
}

export function unfollowUser(userId: string) {
  return axiosInstance3.delete(`/v1/users/${userId}/follow`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}


