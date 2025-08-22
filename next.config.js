/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export configuration
  output: 'export',
  trailingSlash: true,
  
  // Image optimization disabled for static export
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'picsum.photos'],
  },
  
  // Base path for GitHub Pages (update this to your repo name)
  basePath: process.env.NODE_ENV === 'production' ? '/aigf-webapp' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/aigf-webapp/' : '',
  
  // Disable server-side features
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables for static export
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NODE_ENV === 'production' ? '/aigf-webapp' : '',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.onrender.com',
  },
  
  // Webpack configuration for static export
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  // Disable API routes and server-side features
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
