# Crawl files and brand assets (SEO spec Step 5)

## Static files in `public/` (ship to `dist/`)

- `_headers` — nosniff, strict-origin Referrer-Policy, immutable cache for
  `/assets/*`, explicit XML content type for `/sitemap.xml`
- `_redirects` — 301 from `www.chuechstudio.co.ke` to the apex. **No SPA
  catch-all.** The prerender script appends one 301 per route to redirect
  trailing-slash duplicates to the slashless canonical URL.
- `site.webmanifest` — name, colors, start URL and the two PNG icons
- `og-default.png` — 1200x630 social card (brand logo, mint accent, tagline,
  domain), generated from `src/assets/marino/chuech-logo2.svg` + `favicon.svg`
- `logo.png` — 600x287 transparent brand logo for `Organization.logo`
- `favicon-32x32.png`, `apple-touch-icon.png` — PNG icon set alongside the
  existing SVGs; linked from `index.html`

## Generated at build time by `scripts/prerender.ts`

- `dist/sitemap.xml` — one URL per real route (12 today: static routes plus
  `/work/<slug>` expanded from the CMS API, with the bundled published seed
  as fallback). Absolute, slashless URLs with real `lastmod`, `changefreq`
  and `priority`. Template, noindex and non-existent paths are excluded.
- `dist/llms.txt` — short markdown summary with Services, Work and Company
  sections, generated from the same route list.
- `dist/_redirects` — trailing-slash 301s appended to the static www rule.

## robots.txt

`functions/robots.txt.ts` already generates robots.txt at the edge from
`SITE_ORIGIN`, so a static `public/robots.txt` would be shadowed. That function
was extended with the spec's explicit `Allow: /` rules for OAI-SearchBot,
ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot,
Perplexity-User, Google-Extended and Applebot-Extended, plus the sitemap URL.

## Verification

After a build with `PRERENDER_BROWSER_CHANNEL=msedge`, all crawl files,
redirect rules, asset dimensions, manifest links and OG image URL were
checked on the emitted `dist/` files; metadata and JSON-LD checks still pass.

## Owner / later steps

- `robots.txt` has no `Disallow` for an admin path because the CMS lives on a
  separate subdomain. Add one here if admin ever moves onto the apex domain.
- CMS publish → Pages deploy hook and IndexNow ping are Step 2.6 / Step 10
  work and live in the CMS repo.
- Search Console / Bing verification tokens are Step 10 (owner supplies them).
