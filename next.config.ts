import type { NextConfig } from "next";

// GITHUB_PAGES=true builds a static copy into out/ for github.io/a1-truck-auto-sales.
const nextConfig: NextConfig =
  process.env.GITHUB_PAGES === "true" ? { output: "export", basePath: "/a1-truck-auto-sales", trailingSlash: true } : {};

export default nextConfig;
