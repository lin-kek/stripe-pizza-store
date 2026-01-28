import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/**`)],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
