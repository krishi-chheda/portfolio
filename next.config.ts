import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // /readme documented the retired KRISHI.OS terminal site; the Classic Portfolio replaces it.
    return [{ source: "/readme", destination: "/classic", permanent: true }];
  },
};

export default nextConfig;
