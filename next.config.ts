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
        hostname: "storage.pilput.net",
      },
      {
        protocol: "https",
        hostname: "storage.pilput.me",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "t3.storage.dev",
      },
      {
        protocol: "https",
        hostname: "storage.pilput.me",
      },
      {
        protocol: "https",
        hostname: "storage.pilput.net",
      },
      {
        protocol: "https",
        hostname: "7ec55d5596373a0c55c0ba5f45febb9e.r2.cloudflarestorage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
