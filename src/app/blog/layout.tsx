import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Latest Stories & Insights",
  description:
    "Discover stories, thinking, and expertise from writers on every topic. Browse, search, and dive back into what matters.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Latest Stories & Insights",
    description:
      "Discover stories, thinking, and expertise from writers on every topic.",
    type: "website",
    url: "/blog",
    images: [
      {
        url: "/pilput.png",
        width: 512,
        height: 512,
        alt: "pilput blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Latest Stories & Insights",
    description:
      "Discover stories, thinking, and expertise from writers on every topic.",
    images: ["/pilput.png"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
