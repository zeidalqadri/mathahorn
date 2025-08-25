import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages configuration
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  
  // Image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'production',
  },

  // Asset prefix for CDN (optional)
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : '',
  
  // Webpack configuration for Cloudflare compatibility
  webpack: (config, { dev, isServer }) => {
    // Polyfill for Node.js modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
