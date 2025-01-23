import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Ensures the app is prepared for static export
  trailingSlash: true, // Adds a trailing slash to all paths (important for static hosting)
  images: {
    unoptimized: true, // Required for static exports to handle images without optimization
  },
  // Add any additional configuration options here
  
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
