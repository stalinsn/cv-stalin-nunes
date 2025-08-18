import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep bundles lean in production (source maps can be hosted separately if needed)
  productionBrowserSourceMaps: false,
  // Use a custom build directory to avoid Windows file lock issues on .next
  distDir: '.next-build',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      // Add more allowed hosts when enabling VTEX live images if needed
      // { protocol: 'https', hostname: 'your-account.vtexassets.com' },
    ],
  },
};

export default nextConfig;
