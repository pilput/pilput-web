import axios from "axios";
import { ErrorHandlerAPI } from "./ErrorHandler";
import { getToken } from "./Auth";
import { apibaseurl2 } from "./getCofig";

export const apibaseurl = process.env.NEXT_PUBLIC_API_URL || "";
export const dashbaseurl = process.env.NEXT_PUBLIC_DASH_URL || "";
export const wsbaseurl = process.env.NEXT_PUBLIC_WS_URL || "";
export const storagebaseurl = process.env.NEXT_PUBLIC_STORAGE_URL || "";
export const mainbaseurl = process.env.NEXT_PUBLIC_MAIN_URL || "";

export const axiosIntence = axios.create({
  baseURL: apibaseurl,
});
export const axiosIntence2 = axios.create({
  baseURL: apibaseurl2,
});

export async function getDataExternal(url: string, params: any) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export async function getData(url: string, formData?: any): Promise<any> {
  try {
    const token = getToken();
    return await axios.get(`${apibaseurl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
  } catch (error) {
    ErrorHandlerAPI(error);
    return error;
  }
}

export async function postData(url: string, payload: any, formData = false) {
  try {
    const token = getToken();
    return await axios.post(`${apibaseurl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}
export async function postDatanoauth(
  url: string,
  payload: any,
  formData = false
) {
  try {
    const token = getToken();
    return await axios.post(`${apibaseurl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export async function putData(url: string, payload: any, formData = false) {
  try {
    const token = getToken();
    return await axios.put(`${apibaseurl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export async function deleteData(url: string) {
  try {
    const token = getToken();
    return await axios.delete(`${apibaseurl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export function postDataRQ(url: any, payload: any, formData = false) {
  try {
    const token = getToken();
    return axios.post(`${apibaseurl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}
export function getDataRQ(url: string) {
  try {
    return axiosIntence.get(`${apibaseurl}${url}`);
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}
