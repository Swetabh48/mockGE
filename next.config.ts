import type { NextConfig } from "next";

// Local FastAPI hybrid only when explicitly configured.
// On Vercel, Next.js route handlers under src/app/api serve the app.
const API = process.env.MOCKGE_API_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!API) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${API}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
