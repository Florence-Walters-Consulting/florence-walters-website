import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    // Admin image uploads: 5 MB limit per image (enforced in code) plus form overhead.
    serverActions: { bodySizeLimit: '8mb' },
  },
  partialPrefetching: false,
  // Consultation is a way to start (Book a consultation), not a sixth service.
  async redirects() {
    return [{ source: '/services/consultation', destination: '/paid-consultation', permanent: true }];
  },
  // Only for `npm run snapshot` (static review copy): use the original image files, there is no image server there.
  images: process.env.SNAPSHOT_BUILD === 'true' ? { unoptimized: true } : undefined,
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
