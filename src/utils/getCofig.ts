export class Config {
    public static apibaseurl = process.env.NEXT_PUBLIC_API_URL || "";
    public static apibaseurl2 = process.env.NEXT_PUBLIC_API_URL_2 || "";
    public static dashbaseurl = process.env.NEXT_PUBLIC_DASH_URL || "";
    public static wsbaseurl = process.env.NEXT_PUBLIC_WS_URL || "";
    public static storagebaseurl = process.env.NEXT_PUBLIC_STORAGE_URL || "";
    public static mainbaseurl = process.env.NEXT_PUBLIC_MAIN_URL || "";
    public static maindoman = process.env.NEXT_PUBLIC_DOMAIN || "";
}