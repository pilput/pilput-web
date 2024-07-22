import { Toaster } from "react-hot-toast";
import "./global.css";
import { Inter } from "next/font/google";
import Google from "@/components/analitics/Google";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "pilput",
  description: "description...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Analytics />
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
