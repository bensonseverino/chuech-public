# SEO + GEO baseline audit (Step 0)

Date: 2026-11-22. This file records the state of the site before any SEO/GEO
changes. See `C:\Users\HomePC\Downloads\seo-geo-implementation.md` for the spec.

## Build

- `npm run build` (`tsc -b && vite build`): passes, ~7s.
- `npx vite preview --port 4173`: serves the built site.

## Raw HTML check (the critical problem)

`GET http://localhost:4173/services` returns 200 with a ~2.4 KB document.
The `<head>` has a generic title, meta description and OG tags, but the
**body is empty**:

```html
<body>
    <div id="root"></div>
    <script type="module" src="/assets/index-*.js"></script>
</body>
```

No headings, paragraphs or service copy appear in the raw response. The page
text only exists after React runs. Google can render this, but AI crawlers
(GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot) read raw HTML and see an
empty page. Step 2 (build-time prerendering) addresses this.

## React version

- `npm ls react`: **react@19.3.0** (package.json declares `^19.2.8`).
- React 19 can hoist `<title>`, `<meta>` and `<link>` rendered inside
  components to `<head>`, so Step 3 does **not** need `react-helmet-async`.

## Current routes

From `src/App.tsx` (`createBrowserRouter`) and `src/routes.ts`:

| Path | Rendered by | Notes |
|---|---|---|
| `/` | `Home` | hero, client marquee, services, work, experience, FAQ |
| `/services` | `ServicesPage` | service cards + client marquee |
| `/work` | `WorkPage` | CMS project list |
| `/work/:slug` | `ProjectPage` | case studies; cards link with a trailing slash (`/work/eventotron/`) |
| `/about` | `AboutPage` | |
| `/contact` | `ContactPage` | contact form, email, phone, address |
| `/terms-conditions` | `TermsPage` | |
| `/privacy-policy` | `PrivacyPolicyPage` | |
| `/branding` | `ServicePage slug="branding"` | |
| `/web-design` | `ServicePage slug="web-design"` | |
| `/seo-manchester` | `ServicePage slug="seo-manchester"` | |
| `/ppc` | `ServicePage slug="ppc"` | |
| any other path | `NotFoundPage` | intended 404 view |

`src/routes.ts` additionally declares `/ai-seo` and `/seo-consultant`, but
neither has a router entry, so both currently fall through to the 404 view.
CMS case-study slugs come from the CMS at runtime (`VITE_CMS_API_URL`,
`/api/public/projects`); the only local fallback project is `eventotron`.

## Existing SEO-related infrastructure

- `index.html`: `lang="en"` is already set; contains a generic title,
  description, OG/Twitter tags and both favicons (`/favicon.svg`,
  `/favicon-white.svg`). There is no canonical link or JSON-LD.
- `public/_routes.json`: Cloudflare Pages include list covers `/api/*`,
  `/media/*`, `/sitemap.xml`, `/robots.txt` and `/work/*`.
- Cloudflare **Functions already exist** for `robots.txt`, `sitemap.xml`,
  `/work/*` (OG rewrites), media and the public CMS API. Step 5 must not
  blindly add static `robots.txt`/`sitemap.xml` files that shadow these
  functions — the existing generators should be checked and extended instead.
- No `scripts/prerender.*` and no Playwright dependency yet. Only
  `dist/index.html` exists after a build (no per-route HTML files).
- Social profile URLs: **none** on the site (footer and Contact page have
  email, phone and "Nairobi, Kenya, 00100" only). `sameAs` will be empty with
  a TODO until the owner supplies them.
- Contact address has no street address: only "Nairobi, Kenya, 00100".
  `streetAddress` will be a TODO.

## Risks / notes for later steps

- Prerendering with Playwright in the Cloudflare Pages build image is
  unproven; GitHub Action + `wrangler pages deploy` may be needed (Step 2.4).
- The existing `/work` Pages Function and `public/_routes.json` mean a static
  `404.html` plus no SPA fallback needs careful verification (Step 2.5).
- All on-page copy must be checked for text lifted from marino.co.uk before
  the site is submitted (ground rule 4 / Step 11).
