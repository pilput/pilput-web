import type { MetadataRoute } from "next";
import { Config } from "@/utils/getConfig";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = Config.mainbaseurl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/chat",
          "/chat/*",
          "/account",
          "/profile",
          "/login",
          "/register",
          "/forbidden",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
