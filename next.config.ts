import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/gsearch",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
