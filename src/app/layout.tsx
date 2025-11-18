import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import Google from "@/components/analitics/Google";
import { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: {
    default: "pilput - Publishing Platform for Creators",
    template: "%s | pilput"
  },
  description: "PILPUT is a free publishing platform where anyone can write and share articles without restrictions. No paywalls, no subscription fees, no hidden costs - just pure freedom to express your thoughts and reach readers worldwide.",
  keywords: ["publishing", "blog", "writing", "content creation", "free platform", "creators", "articles"],
  authors: [{ name: "pilput" }],
  creator: "pilput",
  publisher: "pilput",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pilput.me",
    title: "pilput - Free Publishing Platform for Creators",
    description: "PILPUT is a free publishing platform where anyone can write and share articles without restrictions. No paywalls, no subscription fees, no hidden costs - just pure freedom to express your thoughts and reach readers worldwide.",
    siteName: "pilput",
  },
  twitter: {
    card: "summary_large_image",
    title: "pilput - Free Publishing Platform for Creators",
    description: "PILPUT is a free publishing platform where anyone can write and share articles without restrictions. No paywalls, no subscription fees, no hidden costs - just pure freedom to express your thoughts and reach readers worldwide.",
    creator: "@pilput_dev",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://pilput.me",
  },
};

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="robots" content="all" />
      </head>
      <body className={`${inter.className}`}>
        <Google />
        <ThemeProvider attribute="class">{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
