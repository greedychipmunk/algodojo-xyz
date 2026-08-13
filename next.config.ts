import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        // Blog cover images are stored as blobs on the AT Protocol PDS.
        // The PDS host can move, so we allowlist the common bsky.network
        // domain pattern. Override the PDS via BLOG_PDS_OVERRIDE in dev.
        protocol: "https",
        hostname: "**.bsky.network",
      },
    ],
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
