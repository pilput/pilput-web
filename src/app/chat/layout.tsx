import type { Metadata } from "next";
import ChatLayoutClient from "./ChatLayoutClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "/chat",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayoutClient>{children}</ChatLayoutClient>;
}
