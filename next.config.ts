import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` emits plain HTML/CSS/JS into `out/`.
  // nginx serves that folder directly - no Node process on the server.
  // When articles + CMS arrive, delete this line and add pm2.
  output: "export",

  // next/image optimization needs a server, so it is off for static export.
  images: { unoptimized: true },

  // Emit `about/index.html` instead of `about.html` so nginx resolves
  // /about without a rewrite rule.
  trailingSlash: true,
};

export default nextConfig;
