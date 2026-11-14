import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // cacheComponents / partialPrefetching are off: they hang on Cloudflare Workers,
  // and no page uses "use cache" (all pages are static).
  // One address for Google: www.hellofahim.com -> hellofahim.com (301, keeps the path).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.hellofahim.com" }],
        destination: "https://hellofahim.com/:path*",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
