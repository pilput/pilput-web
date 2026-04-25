export interface AppConfig {
  apibaseurl: string;
  apibaseurl2: string;
  storagebaseurl: string;
  mainbaseurl: string;
  maindomain: string;
}

export const Config: AppConfig = {
  apibaseurl: process.env.NEXT_PUBLIC_API_URL || "https://echo.pilput.net",
  apibaseurl2: process.env.NEXT_PUBLIC_API_URL_2 || "https://hono.pilput.net",
  storagebaseurl: process.env.NEXT_PUBLIC_STORAGE_URL || "https://storage.pilput.net",
  mainbaseurl: process.env.NEXT_PUBLIC_MAIN_URL || "https://pilput.net",
  maindomain: process.env.NEXT_PUBLIC_DOMAIN || "pilput.net",
};