import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb'
    }
  }
  /* config options here */
};

export default nextConfig;
