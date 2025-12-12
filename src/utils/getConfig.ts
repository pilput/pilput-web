export const Config = {
  apibaseurl: process.env.NEXT_PUBLIC_API_URL || "https://echo.pilput.me",
  apibaseurl2: process.env.NEXT_PUBLIC_API_URL_2 || "https://api.pilput.me",
  apibaseurl3: process.env.NEXT_PUBLIC_API_URL_3 || "https://hono.pilput.me",
  wsbaseurl: process.env.NEXT_PUBLIC_WS_URL || "https://api.pilput.me",
  storagebaseurl: process.env.NEXT_PUBLIC_STORAGE_URL || "https://d42zd71vraxqs.cloudfront.net",
  mainbaseurl: process.env.NEXT_PUBLIC_MAIN_URL || "https://pilput.me",
  maindoman: process.env.NEXT_PUBLIC_DOMAIN || "pilput.me",
};