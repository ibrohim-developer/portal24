import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No `output` line: the site is served by a Node process under pm2, behind
  // the nginx proxy in deploy/nginx.conf. It used to be `output: "export"`,
  // which wrote plain HTML into out/ and needed no server - but that froze
  // every page at build time, and the newsroom publishes all day. Pages are
  // now prerendered at build and refreshed on their own `revalidate` timers.

  // Emit `about/index.html` instead of `about.html` so nginx resolves
  // /about without a rewrite rule.
  trailingSlash: true,

  images: {
    // next/image answers 400 for any remote host not listed here, so this is
    // what lets a CMS cover render at all. Narrowed to the uploads path
    // rather than the whole host: nothing else on the API serves images.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.portal24.uz",
        pathname: "/uploads/**",
      },
    ],

    // How long an optimized variant lives before the optimizer re-fetches it.
    //
    // The expiry is whichever is *larger* of this and the upstream
    // `Cache-Control`, which matters here: the CMS serves uploads with
    // `max-age=0`, so without this every variant would expire on the 4 hour
    // default and be rebuilt all day. Upload URLs carry a UUID and never
    // change content, so a month is safe.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
