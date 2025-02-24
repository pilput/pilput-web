import axios from "axios";
import { ErrorHandlerAPI } from "./ErrorHandler";
import { Config } from "./getCofig";

export const axiosInstence = axios.create({
  baseURL: Config.apibaseurl,
});
export const axiosInstence2 = axios.create({
  baseURL: Config.apibaseurl2,
});

export async function getDataExternal(url: string, params: any) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}


