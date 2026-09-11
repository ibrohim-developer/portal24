# Portal24

Next.js 16 with ISR (the server re-renders pages in the background), not a static export: it needs a long-running `next start` behind nginx.

## Requirements

- Node.js >= 20.9, pm2, nginx
- Outbound HTTPS to `api.portal24.uz` at build time and at runtime (the build fails if the API is down)
- `.next/` writable by the pm2 user

## pm2

[`deploy/ecosystem.config.js`](deploy/ecosystem.config.js). `cwd` is hardcoded to `/var/www/portal24`.

Check: `curl -s -o /dev/null -D - http://127.0.0.1:3000/` returns 200 with `x-nextjs-cache`.

## nginx

[`deploy/nginx.conf`](deploy/nginx.conf):

- HTTP only. Merge the `upstream` and `location` blocks into the existing TLS server block and remove the old SPA `root`/`try_files`.
- Keep `proxy_buffering off` (streaming) and `proxy_read_timeout 90s`.
- `next start` binds `0.0.0.0:3000`. Firewall the port.

## Deploy

```bash
git pull && npm ci && npm run build && pm2 reload portal24
```

Not zero-downtime. `next build` deletes `.next/` (except `.next/cache/`) while the running server is still using it, and a failed build leaves the site broken until the next successful one. With one fork-mode instance, `reload` is a restart. For zero downtime, build in a separate release directory and switch after success, carrying over `.next/cache/`.

## Environment

None required for production.

| Variable               | Default                   | Read at                                  |
| ---------------------- | ------------------------- | ---------------------------------------- |
| `PORTAL24_API_URL`     | `https://api.portal24.uz` | build and runtime                        |
| `NEXT_PUBLIC_SITE_URL` | `https://portal24.uz`     | build only, baked in (rebuild to change) |

For staging, use `.env.production.local` (gitignored, read by both `build` and `start`).

## Cache

- Single instance only: the ISR cache is per process. Scaling out needs a shared `cacheHandler` (e.g. Redis).
- ISR pages live in `.next/server/app/`, the image cache in `.next/cache/images/` (31-day TTL). Don't wipe `.next/cache/` on deploy.
- Refresh intervals: `/` 60s, categories 5m, articles 15m (newest 100 prebuilt, the rest on first request), `sitemap-news.xml` 60s, `sitemap.xml` 15m. `/popular/`, `/search/`, `/about/` and `/authors/` only change on deploy.
- The CMS rate-limits at 120 req/min. 429s are retried 3 times; if a build still fails on one, re-run it.
