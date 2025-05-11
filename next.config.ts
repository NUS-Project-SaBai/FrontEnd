import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: 'res.cloudinary.com' }],
  },
  env: {
    APP_BASE_URL:
      process.env.VERCEL && process.env.VERCEL_URL != ''
        ? `https://${process.env.VERCEL_URL}`
        : process.env.APP_BASE_URL,
  },
};

export default nextConfig;
