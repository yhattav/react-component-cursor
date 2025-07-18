import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // GitHub Pages deployment configuration (only for production)
  ...(isProd && {
    output: 'export',
    basePath: '/react-component-cursor',
    assetPrefix: '/react-component-cursor/',
  }),
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Enable experimental features for better performance
  // experimental: {
  //   optimizeCss: true,
  // },
  
  // Compiler options for production optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
    // ESLint configuration
  eslint: {
    dirs: ['src'],
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
