import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import Google from "@/components/analitics/Google";
import { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "pilput",
  description: "Welcome to pilput.me",
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
