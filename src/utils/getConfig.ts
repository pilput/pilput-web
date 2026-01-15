export interface AppConfig {
  apibaseurl: string;
  apibaseurl2: string;
  apibaseurl3: string;
  wsbaseurl: string;
  storagebaseurl: string;
  mainbaseurl: string;
  maindomain: string;
}

export const Config: AppConfig = {
  apibaseurl: process.env.NEXT_PUBLIC_API_URL || "https://echo.pilput.me",
  apibaseurl2: process.env.NEXT_PUBLIC_API_URL_2 || "https://api.pilput.me",
  apibaseurl3: process.env.NEXT_PUBLIC_API_URL_3 || "https://hono.pilput.me",
  wsbaseurl: process.env.NEXT_PUBLIC_WS_URL || "https://api.pilput.me",
  storagebaseurl: process.env.NEXT_PUBLIC_STORAGE_URL || "https://d42zd71vraxqs.cloudfront.net",
  mainbaseurl: process.env.NEXT_PUBLIC_MAIN_URL || "https://pilput.me",
  maindomain: process.env.NEXT_PUBLIC_DOMAIN || "pilput.me",
};