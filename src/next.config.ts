import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Exclude @github/copilot-sdk from bundling - it uses import.meta.resolve
  // which Turbopack doesn't support yet
  serverExternalPackages: ['@github/copilot-sdk'],
};

export default nextConfig;
