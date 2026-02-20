import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { Space_Grotesk } from "next/font/google";
import Google from "@/components/analitics/Google";
import { Metadata } from "next";
import { Config } from "@/utils/getConfig";
import "./global.css";

const siteUrl = Config.mainbaseurl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "pilput - Publishing Platform for Creators",
    template: "%s | pilput",
  },
  applicationName: "pilput",
  description:
    "PILPUT is a free publishing platform where anyone can write and share articles without restrictions. No paywalls, no subscription fees, no hidden costs - just pure freedom to express your thoughts and reach readers worldwide.",
  keywords: [
    "publishing",
    "blog",
    "writing",
    "content creation",
    "free platform",
    "creators",
    "articles",
  ],
  authors: [{ name: "pilput" }],
  category: "technology",
  creator: "pilput",
  publisher: "pilput",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "pilput - Free Publishing Platform for Creators",
    description:
      "PILPUT is a free publishing platform where anyone can write and share articles without restrictions. No paywalls, no subscription fees, no hidden costs - just pure freedom to express your thoughts and reach readers worldwide.",
    siteName: "pilput",
    images: [
      {
        url: "/pilput.png",
        width: 512,
        height: 512,
        alt: "pilput",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "pilput - Free Publishing Platform for Creators",
    description:
      "PILPUT is a free publishing platform where anyone can write and share articles without restrictions. No paywalls, no subscription fees, no hidden costs - just pure freedom to express your thoughts and reach readers worldwide.",
    creator: "@pilput_dev",
    images: ["/pilput.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={grotesk.className}>
        <Google />
        <ThemeProvider attribute="class">{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
