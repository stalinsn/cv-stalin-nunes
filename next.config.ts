import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep bundles lean in production (source maps can be hosted separately if needed)
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      // Add more allowed hosts when enabling VTEX live images if needed
      // { protocol: 'https', hostname: 'your-account.vtexassets.com' },
    ],
  },
};

export default nextConfig;
