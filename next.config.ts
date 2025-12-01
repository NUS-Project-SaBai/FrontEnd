import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: 'res.cloudinary.com' }, { hostname: "192.168.0.200"}],
  },
};

export default nextConfig;
