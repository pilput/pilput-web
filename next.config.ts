import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d42zd71vraxqs.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "storage.pilput.dev",
      }
    ],
  },
};

export default nextConfig;

