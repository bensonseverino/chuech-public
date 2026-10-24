# SYSTEM.md

A single-page marketing site rebuild of **Marino** (marino.co.uk), a Manchester
web-design / branding / SEO agency. Static React SPA, no backend, no CMS: every
piece of copy is typed data in `src/content/`, every section is a component.

Read this before touching the code. The sections that matter most are
[Architecture](#architecture), [Design system](#design-system) and
[Conventions](#conventions) — they explain *why* the code looks the way it does,
and the comments in the source cite the original build specs by section number.

---

## 1. Stack

| Concern | Choice |
| --- | --- |
| Framework | React 19 + TypeScript, function components only |
| Build | Vite 8 (`@vitejs/plugin-react`) |
| Routing | `react-router` 8, `createBrowserRouter` |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`; tokens in `src/index.css` `@theme` |
| Font | Plus Jakarta Sans Variable (`@fontsource-variable/plus-jakarta-sans`) |
| Animation | CSS transitions + `@keyframes` loops; GSAP 3 and Lenis are installed but not yet imported anywhere |
| Lint | ESLint 10 flat config (`typescript-eslint`, react-hooks, react-refresh) |

No test runner is installed and none is expected. Verification is
`npm run build && npm run lint` plus a visual check in the browser.

### Commands

Run from `my-project/`:

```bash
npm run dev      # Vite dev server, http://localhost:5173
npm run build    # tsc -b && vite build  → dist/
npm run lint     # eslint .
npm run preview  # serve the built dist/ locally
```

`tsconfig.app.json` is strict about unused locals/params and enables
`verbatimModuleSyntax`, so type-only imports must use `import type`.

---

## 2. Repository map

```
my-project/
  index.html               initial <title>, #root, favicon
  design/baseline.json     pre-design-system pixel baseline (regression reference)
  public/                  favicon.svg, icons.svg
  src/
    main.tsx               mounts <App />, imports the font + index.css
    App.tsx                router table
    routes.ts              ROUTES — the only place internal paths are written
    index.css              Tailwind import, @theme tokens, globals, utilities
    assets/marino/         local SVG placeholders (see §7)
    content/
      home.ts              Home copy + SERVICES rows (shared with /services)
      services.ts          /services copy, derived from home.ts
      projects.ts          PROJECTS + WORK_PAGE_SIZE (shared /work + carousels)
      assets.ts            slot name → imported URL (`asset()`)
      services/
        web-design.ts      ServicePageContent type + WEB_DESIGN page data
        seo.ts             SEO page data
        branding.ts        BRANDING page data
    hooks/usePageTitle.ts  usePageTitle / useMetaDescription
    lib/leads.ts           form submission (`VITE_LEAD_ENDPOINT`)
    components/
      RootLayout.tsx       header + <main> + footer shell, scroll/focus handling
      SiteHeader.tsx       sticky nav (glass, dropdowns, mobile menu)
      PageHero.tsx + .css  re-usable inner-page hero (pill collage + photo)
      HeroSection.tsx, HeroHeadline.tsx, HeroDesktop.tsx  home hero
      IntroStatement.tsx, ClientLogoStrip.tsx, ContactForm.tsx,
      ContactRow.tsx, Pagination.tsx + .css, PartnerBadge.tsx,
      FloatingPill.tsx, MediaPill.tsx, icons.tsx
      primitives/          presentational building blocks (no content, no routes)
      sections/            page-level bands, one component per section
    pages/                 route entry points that assemble sections
```

Layout of responsibility:

- **`pages/`** compose sections and own per-route metadata. No styling beyond
  section props.
- **`sections/`** are whole page bands. They take a typed content prop, keep
  their own internal composition, and may ship a sibling `.css` file for
  things Tailwind arbitrary values cannot express.
- **`primitives/`** are dumb, reusable, and never import content.
- **`content/`** is data only (strings, slugs, slot names). The single exception
  is JSX that needs inline bold spans, which lives next to its page.

---

## 3. Routes

`src/routes.ts` is the single source of truth. Never hardcode a path in a
component — import `ROUTES`.

| Path | Page | Status |
| --- | --- | --- |
| `/` | `pages/Home.tsx` | built |
| `/services` | `pages/ServicesPage.tsx` | built |
| `/work` | `pages/WorkPage.tsx` (`?page=N`) | built |
| `/web-design` | `ServicePage` + `WEB_DESIGN` | built |
| `/seo-manchester` | `ServicePage` + `SEO` | built |
| `/branding` | `ServicePage` + `BRANDING` | built |
| `/ppc-manchester`, `/video-production`, `/ai-seo` | — | content/route reserved, **not built** |
| `/about`, `/culture`, `/blog`, `/testimonials`, `/contact`, `/privacy-policy`, `/terms-and-conditions`, `/seo-consultant` | — | **not built** |

Every unbuilt path deliberately falls through to `NotFoundPage`; the header
still links to some of them because those links exist in the live site. Do not
add placeholder pages to "fix" the 404s — either build the page properly or
leave the link as-is.

`RootLayout` wraps all routes. On a route change it scrolls to top (or to a
`#hash` target) and moves focus to `<main id="main" tabIndex={-1}>`, except on
the first render. Each page sets its own `<title>` / meta description through
`usePageTitle()` / `useMetaDescription()`; there is no helmet dependency.

`dist/` is committed and the SPA has no history fallback configured for
hosting — deep links need a rewrite to `index.html` on whatever host serves it.

---

## 4. Architecture

### RootLayout

Renders `SiteHeader`, `<main>` with the routed page, then `SiteFooter`. The
outer wrapper is `overflow-x: clip` (not `hidden`, so `position: sticky` keeps
working) and carries `bg-fog font-sans text-obsidian`.

### Page assembly (service pages)

`ServicePage` is the shared template for `/web-design`, `/seo-manchester` and
`/branding`. It renders, in order:

1. `ServiceHero` — badge, dot h1, tag chips, intro, consultation form card
2. `FeaturePanel` — heading, lead, checklist, body, CTA, image
3. `ProjectCarousel` — filtered/curated project cards
4. `PillarsPanel` — dark panel of titled columns + CTA
5. `CallbackPanel` — white panel: dot heading, body, dark CTA, testimonial
   slider on the left; photo and callback form on the right
6. `ExperienceSection` — the shared stats marquee / CTA band
7. `FaqSection` — accordion (no article carousel; the FAQ runs into the footer)

The template owns only order and vertical rhythm. Every string comes from the
page's `ServicePageContent` object, so a new service page is a data file plus
one route entry.

### Adding a service page

1. Copy `content/services/branding.ts` to `content/services/<name>.ts` and
   export a `ServicePageContent` value. Its header comment should record where
   the copy came from.
2. Add any new photos as slots in `content/assets.ts` (§7).
3. Add the path to `ROUTES` and a `{ path, element: <ServicePage content={…} /> }`
   entry in `App.tsx`.
4. If the page belongs in the Services nav, add its path to the `Services`
   `activePaths` in `SiteHeader.tsx`.
5. Use `tag` (auto-filter `PROJECTS`) or `slugs` (explicit order, wins over
   `tag`) plus `limit` for the carousel.

### Content types

`ServicePageContent` (exported from `content/services/web-design.ts`) covers
`seo`, `hero`, `feature`, `projects`, `pillars`, `why`, `faq`. Forms are
`ServiceFormContent` (`fields`, `submitLabel`, `source`, optional `heading` +
`highlight`). FAQ answers are `RichSegment[]` so paragraphs and inline emphasis
render through `RichText`.

`content/projects.ts` holds every project: `slug`, `title`, `tags`, `image`
(asset slot), optional `focus` (`object-position`) and optional `column` (Home
panel placement). `/work` paginates with `WORK_PAGE_SIZE` and page state lives
in the URL.

---

## 5. Design system

### Tokens (`src/index.css` `@theme`)

Colours: `primary` mint `#82ffcd`, `secondary` lavender `#e2cbff`, `obsidian`
`#231f20`, `fog` `#f3f3f3`, `silver` `#c1c1c1`. Tailwind classes are
`bg-fog`, `text-obsidian`, `bg-secondary`, etc.

Radii: `rounded-media` 20, `rounded-nav`/`rounded-panel` 37, `rounded-button`
33, `rounded-pill` 999, `rounded-card` 15, `rounded-card-lg` 30,
`rounded-panel-lg` 50, `rounded-input` 50 (reserved).

Shadows: `shadow-soft`, `shadow-glow-sm|md|lg`, `shadow-float`.
Motion: `--ease-standard`, 350ms default transitions, `animate-float-a`,
`animate-float-b`, `animate-marquee`.

Token names are namespaced so they never collide with Tailwind's built-in
spacing/radius/breakpoint names. **Spacing tokens are deliberately not in
`@theme`** (that would override Tailwind's spacing scale); use `var(--space-*)`
directly instead.

### The desktop unit

Above 1024px the design is expressed in a fluid unit:

```css
--u: min(1vw, 18.27px);   /* 1% of viewport, capped at the 1827px design width */
```

Geometry that was measured off the design is written as
`calc(var(--u) * N)` in arbitrary Tailwind values, e.g. the content column is
`lg:w-[calc(var(--u)*70.56)]`. Below 1024px the same sections use plain
`px-4` / `px-8` values. Text uses `clamp()` instead — e.g.
`text-[clamp(33px,19.4px_+_2.77vw,53px)]` — so type is fluid but capped.

The `Container` primitive owns the content column (`mx-auto px-4 md:px-8` +
the lg unit width) and exposes its left inset as `--container-left` for
full-bleed rows that must start on the same edge.

### Breakpoints

`768px` (md) and `1024px` (lg) are the meaningful ones. Hover-only
interactions use the custom variant `hoverable`, defined as
`@media (min-width: 1024px) and (hover: hover) and (pointer: fine)` — never
gate an interaction on a width alone if it needs a pointer.

### Type roles

- Page h1 / hero: fluid `clamp(33px … 53px)`, bold, `leading-[1.05]`,
  `tracking-[-0.019em]`.
- Section title (`TITLE_ROLE` in `SectionHeading.tsx`): 28px/500 mobile,
  33px/500 from md, `leading-[1.15]`, `tracking-[-0.02em]`. Reuse the exported
  constant rather than retyping the scale.
- Clamps `clamp-h2`, `clamp-card-h3`, `clamp-quote` are `@utility`s for the
  large headline / card / quote sizes.

### Headings and line-break caps

Headline breaks on the live site are part of the design, so caps are explicit
data, not guesses:

- `hero.titleMaxWidth` (em) on a service page → `ServiceHero` sets
  `--hero-title-max` and adds `.service-hero-title--capped`, which caps at
  `calc(var(--hero-title-max) + 47px)` (the dot plus its gap) from 768px up.
  Omit it and the title wraps naturally against the column.
- `feature.headingMaxWidth` / `why.headingMaxWidth` → `FeaturePanel` /
  `PillarsPanel` pass the cap through to `SectionHeading`'s `maxWidth` (em).
- `SectionHeading` with `variant="dot"` renders the leading/trailing dot and
  only applies `maxWidth` when the caller supplies it.

When a spec'd break does not reproduce, the content files document the em
window that does (see the comments in `web-design.ts` / `branding.ts`). Keep
those comments when editing; they are the rationale for the magic numbers.

### Surfaces

`.glass` (light translucent, 16px blur) and `.glass-dark` (obsidian) for the
sticky nav, dropdown and mobile sheet, with an `@supports` opaque fallback.
Dark panels use `DarkPanel` + `rounded-panel-lg`.

### Motion

- Decorative pills drift with `animate-float-a` / `animate-float-b`
  (transform-only, 2–3px).
- `Marquee` duplicates its children and translates -50%, duration driven by the
  `--marquee-duration` custom property; `.marquee-track` exists because the
  duration longhand must be re-declared where the variable is set (the
  `@theme` shorthand substitutes `var()` at `:root`). Keep both longhand-only.
- Browsers with `prefers-reduced-motion: reduce` get no keyframes and 0ms
  transitions; marquees become horizontally scrollable/swipeable rows instead,
  because a frozen marquee would hide half its content.
- All current motion is CSS: hover transitions on the standard 0.35s easing,
  the `hoverable` media condition for pointer-only reveals (`RevealRow`),
  `animate-float-*` for pills, and `HoverZoom`'s `group-hover:scale-[1.04]`.
  GSAP and Lenis are in `package.json` but no source file imports them — if you
  add scroll-driven animation, guard it behind the same reduced-motion check
  the CSS already honours.

---

## 6. Forms and leads

`ContactForm` renders `ServiceFormContent.fields` (text/email/tel/textarea,
required flags, labels containing the literal `*`) and calls
`submitLead({ source, fields })` from `lib/leads.ts`.

`submitLead` POSTs JSON to `VITE_LEAD_ENDPOINT`. When the variable is unset it
logs and resolves, so the form works end to end in development. There is no
backend, no validation service and no CRM integration yet — the `source` string
(`web-design-hero`, `branding-callback`, …) is the only attribution the two
forms send.

---

## 7. Assets

`content/assets.ts` maps a slot name to an imported file URL and throws on an
unknown slot. Content files reference **slot names**, never paths, so replacing
a placeholder is a one-line change in the map.

Every entry that is not final is marked `TODO(asset)` with a description of the
photo it should become. Currently *most* photography (hero, work cards, service
feature images) is the shared `hero-team.svg` placeholder; project logos, stats
and service icons are local SVGs.

Rules: swap the file or the slot mapping — never the markup, never inline an
`<img src="…">` path in a component.

---

## 8. Conventions

- **Comments cite the spec.** Section comments look like
  `(web-design spec §5.1)` or `(remaining-sections §2.4)`; they record which
  design requirement a block satisfies. Preserve them when editing, and add one
  when you introduce a non-obvious rule — the codebase leans heavily on them.
- **Tailwind first, CSS only for the gaps.** Arbitrary values are normal here
  (`text-[13px]`, `lg:h-[calc(var(--u)*2.83)]`). Reach for a sibling `.css`
  file only when a utility cannot express it (custom-property caps, marquee
  duration, full-bleed scroll snapping).
- **`ROUTES` for every internal link**; `react-router` `<Link>` for navigation,
  plain `<a>` only for external/mailto/tel.
- **Accessibility is in the markup, not bolted on:** `aria-label` on landmark
  sections and scroll regions, `aria-labelledby` wired to section titles,
  `aria-expanded` on the nav/FAQ disclosures, focus-visible outlines on all
  interactive elements, decorative dots/icons `aria-hidden`.
- **Copy is data.** No sentence belongs in JSX unless it needs inline markup
  (bold spans in hero descriptions). Apostrophes are written as `\u2019` in
  content files to keep the curly typography the live site uses.
- **Images** always carry meaningful `alt` from content; carousels and panels
  expose a region label so screen readers can skip them.
- **No dead code.** `noUnusedLocals`/`noUnusedParameters` are on, and the
  lint config forbids non-component exports from component files
  (react-refresh), which is why shared constants live where they do.

---

## 9. Known gaps

- Unbuilt routes in §3 (About, Culture, Blog, Testimonials, Contact, legal,
  PPC, Video, AI SEO) 404 by design.
- Most photography is a placeholder (`TODO(asset)` in `assets.ts`).
- No lead destination configured (`VITE_LEAD_ENDPOINT`).
- No test suite, no CI, no analytics, no sitemap/robots, and no OG/Twitter
  metadata beyond the per-route title/description hook.
- No SSR/prerender: the HTML ships an empty `#root`, so SEO depends on the
  host serving the SPA and on crawlers executing JS.
- `design/baseline.json` is a historical pixel snapshot, not an automated
  check — nothing currently compares against it.
