import type { NextConfig } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hr-dashbaord-backend-rho.vercel.app';

const nextConfig: NextConfig = {
  images: { remotePatterns: [] },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
