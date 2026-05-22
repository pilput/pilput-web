import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("token")?.value;

  if (token) {
    redirect("/");
  }

  return children;
}
