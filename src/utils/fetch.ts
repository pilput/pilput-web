import axios from "axios";
import { ErrorHandlerAPI } from "./ErrorHandler";
import { getToken } from "./Auth";
import { apibaseurl, apibaseurl2 } from "./getCofig";

export const axiosInstence = axios.create({
  baseURL: apibaseurl,
});
export const axiosInstence2 = axios.create({
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
    return axiosInstence.get(`${apibaseurl}${url}`);
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}
