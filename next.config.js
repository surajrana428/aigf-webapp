/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export as static files for GitHub Pages
  output: 'export',
  trailingSlash: true,

  // Image optimization disabled (not supported on GitHub Pages)
  images: {
    unoptimized: true,
  },

  // Base path for GitHub Pages (repo name)
  basePath: process.env.NODE_ENV === 'production' ? '/aigf-webapp' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/aigf-webapp/' : '',

  // Strict mode + minify
  reactStrictMode: true,
  swcMinify: true,

  // Public env variables
  env: {
    NEXT_PUBLIC_BASE_PATH:
      process.env.NODE_ENV === 'production' ? '/aigf-webapp' : '',
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.onrender.com',
  },

  // Fix server-only modules for browser
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;