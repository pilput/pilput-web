import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata = publicPageMetadata({
  title: "Register",
  description:
    "Create a free pilput account and start publishing articles on our open platform.",
  canonicalPath: "/register",
  keywords: ["register", "sign up", "pilput", "create account", "writers"],
  openGraphTitle: "Register | pilput",
  robots: {
    index: false,
    follow: false,
  },
});

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
