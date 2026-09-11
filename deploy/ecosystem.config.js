/**
 * pm2 unit for the Next.js server that nginx proxies to.
 *
 *   pm2 start deploy/ecosystem.config.js
 *   pm2 save && pm2 startup     # survive a reboot
 *
 * Deploying is `git pull && npm ci && npm run build && pm2 reload portal24`.
 * The build needs api.portal24.uz reachable: every page is prerendered against
 * it, so a CMS that is down at build time fails the build rather than shipping
 * empty blocks.
 */
module.exports = {
  apps: [
    {
      name: "portal24",
      cwd: "/var/www/portal24",
      script: "node_modules/next/dist/bin/next",
      args: "start",

      /*
       * One instance, deliberately.
       *
       * The ISR cache lives on the local disk of each instance. A second one
       * would keep its own copy, so the same URL would answer with pages
       * regenerated at different times depending on which process took the
       * request. Going wider means giving Next a shared cache handler
       * (`cacheHandler` in next.config.ts) backed by Redis or similar - not
       * just raising this number.
       */
      instances: 1,
      exec_mode: "fork",

      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // Regenerated pages are written to `.next/server/app` and resized images
      // to `.next/cache/images`, both inside the checkout, so the user pm2 runs
      // as needs write access to `.next`. `next build` keeps `.next/cache` but
      // replaces the rest; do not add a deploy step that wipes the cache, or
      // every image is resized again on its first view.
      max_memory_restart: "512M",
      autorestart: true,
    },
  ],
};
