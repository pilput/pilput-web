import { Toaster } from "react-hot-toast";
import "./global.css";
import { Inter } from "next/font/google";
import Google from "@/components/analitics/Google";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "pilput",
  description: "Welcome to Next.js",
};

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="all" />
      </head>
      <body className={`${inter.className}`}>
        <Google />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
