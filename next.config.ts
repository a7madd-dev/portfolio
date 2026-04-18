import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server at .next/standalone so the Docker image
  // doesn't need to ship full node_modules. See Dockerfile.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
