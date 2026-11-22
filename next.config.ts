import path from "path";
import type { NextConfig } from "next";

// Extract Supabase Storage hostname dynamically from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let dynamicHostname: string | null = null;
if (supabaseUrl) {
  try {
    dynamicHostname = new URL(supabaseUrl).hostname;
  } catch {
    // fallback
  }
}

const remotePatterns: Array<{
  protocol: "https";
  hostname: string;
  pathname: string;
}> = [
  {
    protocol: "https",
    hostname: "iqjlrprznvkzbnbixgww.supabase.co",
    pathname: "/storage/v1/object/public/**",
  },
];

if (dynamicHostname && dynamicHostname !== "iqjlrprznvkzbnbixgww.supabase.co") {
  remotePatterns.push({
    protocol: "https",
    hostname: dynamicHostname,
    pathname: "/storage/v1/object/public/**",
  });
}

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    remotePatterns,
  },
};

export default nextConfig;
