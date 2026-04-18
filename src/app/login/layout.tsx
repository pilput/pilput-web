import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata = publicPageMetadata({
  title: "Login",
  description:
    "Login to your pilput account to write, publish, and manage your content.",
  canonicalPath: "/login",
  keywords: ["login", "sign in", "pilput", "account"],
  openGraphTitle: "Login | pilput",
  robots: {
    index: false,
    follow: false,
  },
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
