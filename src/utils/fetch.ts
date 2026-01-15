import axios from "axios";
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


