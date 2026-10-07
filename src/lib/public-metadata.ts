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
  // Default artwork is the square brand mark — served absolute so scrapers
  // outside Next.js can resolve it, and paired with the compact `summary`
  // card (the large-image card expects a 1200x630 landscape asset).
  const defaultImage = `${siteUrl}/pilput.png`;

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
          url: defaultImage,
          width: 512,
          height: 512,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: ogTitle,
      description,
      creator: "@pilput_dev",
      images: [defaultImage],
    },
    ...(robots !== undefined ? { robots } : {}),
  };
}
