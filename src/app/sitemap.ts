import type { MetadataRoute } from "next";
import { Config } from "@/utils/getConfig";

const publicRoutes = ["/", "/about", "/blog", "/contact", "/forum", "/privacy", "/tags"];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${Config.mainbaseurl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : route === "/blog" ? 0.9 : 0.8,
  }));
}
