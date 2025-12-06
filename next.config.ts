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

  // Security Headers - Proteção contra ataques comuns
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Previne MIME type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Previne clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Ativa proteção XSS do navegador
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Controla informações do Referer
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Desabilita APIs desnecessárias
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Força HTTPS (descomente em produção com HTTPS)
          // { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ];
  },
};

export default nextConfig;
