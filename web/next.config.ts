import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    // Admin image uploads: 5 MB limit per image (enforced in code) plus form overhead.
    serverActions: { bodySizeLimit: '8mb' },
  },
  partialPrefetching: false,
  turbopack: {
    // The repo root also has a package-lock.json (legacy app); pin the root to this app.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
