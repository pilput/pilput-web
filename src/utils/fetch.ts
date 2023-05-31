import axios from "axios";
import { ErrorHandlerAPI } from "./ErrorHandler";
import { getToken } from "./Auth";


const baseurl = process.env.NEXT_PUBLIC_API_HOST;

export async function getDataExternal(url:string, params: any) {
  try {
    
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.log(error);
    return ErrorHandlerAPI(error);
  }
}

export async function getData(url:string, params?: any) {
  try {
    const token = getToken()
    return await axios.get(`${baseurl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
    return ErrorHandlerAPI(error);
  }
}

export async function postData(url:string, payload:any, formData = false) {
  try {
    const token = getToken()
    return await axios.post(`${baseurl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export async function putData(url:string, payload:any, formData = false) {
  try {
    const token = getToken()
    return await axios.put(`${baseurl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export async function deleteData(url:string) {
  try {
    const token = getToken()
    return await axios.delete(`${baseurl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export function postDataRQ(url:any, payload:any, formData = false) {
  try {
    const token = getToken()
    return axios.post(`${baseurl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}
export function getDataRQ(url:string, params:any) {
  try {
    const token = getToken()
    return axios.get(`${baseurl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}
