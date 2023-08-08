import { Toaster } from "react-hot-toast";
import "./global.css";
import { Inter } from "next/font/google";
import Navigation from "@/components/header/Navbar";

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
    <html lang="en" className="bg-gray-50">
      <head>
        <meta name="robots" content="all" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
