export class Config {
  public static apibaseurl =
    process.env.NEXT_PUBLIC_API_URL || "https://echo.pilput.me";
  public static apibaseurl2 =
    process.env.NEXT_PUBLIC_API_URL_2 || "https://api.pilput.me";
  public static wsbaseurl =
    process.env.NEXT_PUBLIC_WS_URL || "https://api.pilput.me";
  public static storagebaseurl =
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    "https://d42zd71vraxqs.cloudfront.net";
  public static mainbaseurl =
    process.env.NEXT_PUBLIC_MAIN_URL || "https://pilput.me";
  public static maindoman = process.env.NEXT_PUBLIC_DOMAIN || "pilput.me";
}
