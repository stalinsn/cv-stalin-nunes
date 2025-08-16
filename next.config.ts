import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Generate browser source maps to avoid 404s when DevTools tries to fetch them
  productionBrowserSourceMaps: true,
  // Ensure source maps in dev when using webpack (we disable turbopack in dev script below)
  webpack(config, { dev }) {
    if (dev) config.devtool = 'source-map';
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
};

export default nextConfig;
