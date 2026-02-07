/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow importing from outside the frontend directory (for contract artifacts)
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  // Enable experimental features for external imports
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
