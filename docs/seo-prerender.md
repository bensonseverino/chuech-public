# Prerender and deploy notes (SEO spec Step 2)

## What happens at build time

`npm run build` now runs `tsc -b && vite build && npm run prerender`.
`scripts/prerender.ts` serves `dist/` locally, opens all 12 public routes plus
the 404 in headless Chromium with reduced motion, waits for the app's
`data-ready` signal, and writes `dist/<route>/index.html` for each one. It also
adds `dist/404.html`.

Verified locally on 2026-11-22: all 12 routes and 404 captured; e.g.
`dist/services/index.html` contains real headings and service copy (46 KB),
`dist/work/eventotron/index.html` contains the case study, and the transition
overlay is captured in its hidden state (`transform: scale(1, 0)`).

The only app-code changes are the `data-ready` flag in `src/App.tsx` and
`navigator.webdriver` checks in `src/lib/transition.ts` and
`src/hooks/useRevealer.ts`. Real visitors see exactly the same animated app.

## Deployment path chosen: GitHub Action + Wrangler

Cloudflare Pages' build image is not guaranteed to include Playwright's
Chromium, so prerendering runs in `.github/workflows/prerender-deploy.yml`
(installs Chromium, builds, prerenders, then `wrangler pages deploy dist`).
This is the fallback described in Step 2.4 of the spec.

**Owner setup required (external):**
1. Add repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
2. Optionally add repository variable `CMS_API_URL` (origin of the published
   projects API, e.g. the CMS worker URL). If unset, the script falls back to
   the bundled published seed project (`eventotron`), so no breakage.
3. **Disable the Cloudflare Pages git integration for this repo**, or set its
   build command to `SKIP_PRERENDER=1 npm run build`. Otherwise a Pages-native
   deploy can overwrite the prerendered HTML with the plain SPA shell.
   `SKIP_PRERENDER=1` makes `npm run prerender` a no-op for that path.

Local check with an installed Edge instead of downloading Chromium:
`PRERENDER_BROWSER_CHANNEL=msedge npm run build`.

## Still needed for CMS freshness (Step 2.6)

When a project/page is published or edited in the CMS, a Cloudflare Pages
deploy hook must be called so new routes are prerendered and added to the
sitemap. That hook lives in the CMS repository, not here. Add the hook URL as
a CMS secret and POST to it from the CMS publish action. TODO(owner).

## 404 status

There is intentionally no `public/_redirects` SPA catch-all. Every valid route
has a prerendered file, so Cloudflare Pages can serve `404.html` with a real
404 status. Verify with `curl -I https://chuechstudio.co.ke/does-not-exist`
after deployment.
