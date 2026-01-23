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
  apibaseurl: process.env.NEXT_PUBLIC_API_URL || "https://axum-pilput.up.railway.app",
  apibaseurl2: process.env.NEXT_PUBLIC_API_URL_2 || "https://api.pilput.net",
  apibaseurl3: process.env.NEXT_PUBLIC_API_URL_3 || "https://hono.pilput.net",
  wsbaseurl: process.env.NEXT_PUBLIC_WS_URL || "https://api.pilput.net",
  storagebaseurl: process.env.NEXT_PUBLIC_STORAGE_URL || "https://d42zd71vraxqs.cloudfront.net",
  mainbaseurl: process.env.NEXT_PUBLIC_MAIN_URL || "https://pilput.net",
  maindomain: process.env.NEXT_PUBLIC_DOMAIN || "pilput.net",
};