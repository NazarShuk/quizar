import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "fuzzy-bassoon-v59r94qj9w9hprjg-3000.app.github.dev",
      ],
    },
    serverComponentsExternalPackages: [
      "puppeteer",
      "puppeteer-extra",
      "puppeteer-extra-plugin-stealth",
    ],
  },
  /* config options here */
};

export default nextConfig;
