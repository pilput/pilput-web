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
          "/feed-home"
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/posts/sitemap.xml`,
      `${baseUrl}/tags/sitemap.xml`,
    ],
    host: baseUrl,
  };
}
