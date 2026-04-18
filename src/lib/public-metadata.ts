import type { Metadata } from "next";
import { Config } from "@/utils/getConfig";

const siteUrl = Config.mainbaseurl;

export type PublicPageMetadataInput = {
  title: string;
  description: string;
  /** Path with leading slash, e.g. "/contact" */
  canonicalPath: string;
  keywords?: string[];
  /** Defaults to `title` */
  openGraphTitle?: string;
  /** e.g. `{ index: false, follow: false }` for auth routes */
  robots?: Metadata["robots"];
};

/**
 * Consistent SEO defaults for public marketing/legal routes (matches /about pattern).
 */
export function publicPageMetadata({
  title,
  description,
  canonicalPath,
  keywords,
  openGraphTitle,
  robots,
}: PublicPageMetadataInput): Metadata {
  const path = canonicalPath.startsWith("/")
    ? canonicalPath
    : `/${canonicalPath}`;
  const url = `${siteUrl}${path}`;
  const ogTitle = openGraphTitle ?? title;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title: ogTitle,
      description,
      siteName: "pilput",
      images: [
        {
          url: "/pilput.png",
          width: 512,
          height: 512,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      creator: "@pilput_dev",
      images: ["/pilput.png"],
    },
    ...(robots !== undefined ? { robots } : {}),
  };
}
