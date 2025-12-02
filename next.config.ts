import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/manjaro-kde-web",
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;