import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PRODUCTION_SUPABASE_URL: process.env.NEXT_PRODUCTION_SUPABASE_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PRODUCTION_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PRODUCTION_SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
