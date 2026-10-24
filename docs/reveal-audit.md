# Highlighted-text audit — scroll word-reveal

> Step 1 of `highlight-scroll-reveal-spec.md` §1: scan every page and component
> and list every highlighted-text instance before (and while) wiring the effect.
> Everything listed here renders through `src/components/ui/HighlightReveal.tsx`.
> Ambiguous cases are under **Needs confirmation** and are **left unchanged**.

Audit date: 2026-10-25. Project: `my-project` (Vite + React 19 + React Router 8).

---

## 0. What counts as a highlight on this site

Two highlight styles exist in the whole codebase — both lavender
(`--color-secondary` = `#e2cbff`), both are pills that hug the phrase:

| # | Renderer | File | Markup / styling (unchanged) |
|---|----------|------|------------------------------|
| H1 | `Mark` (used by `Inline`) | `src/content/live/inline.tsx` | `<span class="rounded-pill mx-0.5 inline bg-secondary px-2 [box-decoration-break:clone]">` |
| H2 | `FormHeading` | `src/components/sections/ServiceHero.tsx` | `<span class="rounded-pill bg-secondary px-[0.4em] py-[0.08em] [box-decoration-break:clone]">` |

No `<mark>` element, no `::highlight`, no mint (`--color-primary: #82ffcd`)
background behind text, and no CSS class that paints a highlight behind a text
run exists anywhere in `src/` (searched `bg-*` spans, `background` in `.css`,
`mark`, `highlight`). Mint is only used on buttons, chips, arrows, dots and
decorative shapes.

There are **two** highlight-producing components, and both now delegate to
`HighlightReveal`. Every page that can show highlighted text goes through one of
them, so no page needs its own copy of the logic.

---

## 1. Instances by page

`Inline` is the shared inline-rich-text renderer for the CMS grammar
(`**bold**`, `==highlight==`, `[text](/path)`). Every `highlight` mark it
receives becomes H1. Call sites below are marked with the reveal mode used.

### Home — `/`

| # | Text | Component / file | Mode |
|---|------|------------------|------|
| 1 | Hero description — `"We design and build **purposeful websites**…"` (fallback has bold only; a CMS `==…==` would land here) | `HeroSection.tsx` → `<Inline text={hero.description} reveal="load" />` | `load` |
| 2 | **Intro statement — 7 pills:** `bold`, `creatives,`, `sharp strategists,`, `technical pros`, `genuine commitment`, `clients’ success.`, `always deliver on promises,` (source: `src/content/home.ts` → `INTRO_STATEMENT.highlights` → `map.ts` `markHighlights`) | `IntroStatement.tsx` → `<Inline text={text} dotAfterFirstMark />` | `scroll` |
| 3 | FAQ answers (`FaqSection.tsx:131`) — no `==…==` in fallback copy; CMS may add | `FaqSection.tsx` → `<Inline text={item.answer} />` | `scroll` |
| 4 | Founder block paragraphs (`FaqSection.tsx:148`) | `FaqSection.tsx` → `<Inline text={paragraph} />` | `scroll` |
| 5 | Footer statement (`SiteFooter.tsx:24`, dark tone) | `SiteFooter.tsx` → `<Inline text={footer.statement} tone="dark" />` | `scroll` |

### Services — `/services`

| # | Text | Component / file | Mode |
|---|------|------------------|------|
| 6 | Hero description | `ServicesPage.tsx:34` → `<Inline text={view.hero.description} reveal="load" />` | `load` |
| 7 | **Intro statement — 4 pills:** `bold creatives,`, `technical pros`, `genuine commitment`, `clients’ success.` (`src/content/services.ts` → `SERVICES_INTRO.highlights`) | `ServicesPage.tsx:44` → `IntroStatement` | `scroll` |
| 8 | FAQ answers / founder paragraphs / footer statement (same components as #3–#5) | as above | `scroll` |

### Work — `/work`

| # | Text | Component / file | Mode |
|---|------|------------------|------|
| 9 | Hero description | `WorkPage.tsx:65` → `<Inline text={view.hero.description} reveal="load" />` | `load` |
| 10 | Footer statement | `SiteFooter.tsx:24` | `scroll` |

### Service pages — `/web-design`, `/seo-manchester`, `/branding`

| # | Text | Component / file | Mode |
|---|------|------------------|------|
| 11 | Hero intro paragraph | `ServiceHero.tsx:88` → `<Inline text={hero.intro} reveal="load" />` | `load` |
| 12 | **Form-card heading highlight — `"free consultation"`** (source: `content/services/{web-design,seo,branding}.ts` → `highlight`) | `ServiceHero.tsx` → `FormHeading` → `<HighlightReveal mode="load" …>` | `load` |
| 13 | Feature lead + body (`FeaturePanel.tsx:42,48`) | `<Inline>` | `scroll` |
| 14 | Pillars item body (`PillarsPanel.tsx:32`) | `<Inline>` | `scroll` |
| 15 | Callback "why" body (`CallbackPanel.tsx:46`) | `<Inline>` | `scroll` |
| 16 | FAQ answers, founder paragraphs (as #3–#4) | `<Inline>` | `scroll` |
| 17 | Footer statement (as #5) | `<Inline>` | `scroll` |

### Pages with no highlighted text

`NotFoundPage` — no `Inline`, no `Mark`, no `FormHeading`.

### Count with today's fallback copy

14 highlighted segments actually render: 7 (Home intro) + 4 (Services intro) +
1 × 3 service pages (form heading). All other rows are CMS-capable slots that
render the same component the moment `==…==` arrives from the API.

---

## 2. Explicitly NOT highlighted (left exactly as they are)

Per spec §1 "Not included":

- **Nav / menu** — `SiteHeader.tsx` (the `bg-silver/35` active cell is a nav
  state, not a text highlight), mobile menu links.
- **Buttons** — `primitives/Button.tsx` `variant="mint"` (mint fill + obsidian
  text), all CTA buttons in header, footer, sections, form submit.
- **Pills / badges / tags** — `SectionBadge` (white pill), `OutlineChip`
  (service tag chips), `FloatPill` / `MediaPill` / `FloatingPill` (decorative
  mint & lavender blobs), `Insights` category chips, `PartnerBadge`.
- **Form labels & inputs** — `ContactForm.tsx`.
- **Footer links, link rows, contact details** — `SiteFooter.tsx`.
- **Stat numbers** — `ExperienceSection.tsx`.
- **Captions / image alt / eyebrows** — `PageHero` pills, `SectionHeading` dots,
  `RevealRow` `.svc-dot` (lavender dot, not text), `Pagination` dots.
- **`RichText.tsx`** — link segments only, contains no highlight, and is
  currently referenced nowhere.
- **The `.svc-desc` ↔ `.svc-keys` cross-fade** in `RevealRow.css` — an existing
  hover animation, not a highlight; untouched.

---

## 3. Needs confirmation (unchanged until confirmed)

1. **Bold runs (`**…**` → `<strong class="font-semibold">`)** in hero
   descriptions, FAQ answers, intro statements, footer statement. These are
   emphasised but carry **no** highlight colour, marker or underline-block, so
   they are not highlights under §1. **Left unchanged.** Confirm if you want the
   reveal on bold runs too.
2. **Home intro statement at scroll 0 on very tall / tablet viewports.** With
   the specified `offset = ["start 0.9", "end 0.5"]` the first line of the
   intro can already be inside the viewport before the first scroll (measured
   in-view at 768×1024, 1024×768, 1728×1117 and 2560×1440), so its first words
   are at their in-progress (partly dim) state on arrival rather than animating
   from 0. It is **not** stuck: any scroll completes it, and on 1366×768,
   1920×1080 and 375×667 it sits below the fold and reveals normally.
   Kept on `scroll` so the scroll-driven reveal survives for the site's
   showcase block. Confirm if you would rather it always animate on load
   (`reveal="load"` is a one-line change in `IntroStatement.tsx`).
3. **CMS `<mark data-highlight>` (spec §4).** The CMS is being built separately.
   The frontend's rich-text renderer is `Inline`, which already maps every
   `highlight` mark to `HighlightReveal` — so `==…==` from the API, and
   hardcoded fallback copy, are identical (§4 satisfied: no
   `dangerouslySetInnerHTML` exists anywhere in `src/`). When the editor starts
   emitting real `<mark data-highlight>` nodes instead of the inline grammar,
   the section renderer must map them to
   `<HighlightReveal as="mark" className="…existing highlight classes…">`.
   Not wired yet — nothing to wire until the CMS lands.

---

## 4. Implementation notes / deviations

- `motion@14.6.0` was installed (`npm i motion`); all imports are from
  `"motion/react"`. The project is a Vite app, so no `"use client"` was added
  and no demo code (sticky `220vh` stage, kicker, progress bar, injected
  `<style>`, `<h1>`) was brought over.
- `getWordProgressRange` / `getWordOpacity` and the constants
  (`START_OPACITY = 0.15`, `SPREAD = 0.8`, `WORD_DURATION = 0.2`) live unchanged
  in `src/lib/wordReveal.ts`.
- One `useScroll` per highlighted segment; scroll drives motion values only —
  no React state updates on scroll.
- **Inline target measurement:** `useScroll` sizes its target from
  `clientHeight`, which is `0` for an inline element (spec §3.10 requires the
  wrapper to be inline so wrapping never changes). With the required
  `offset = ["start 0.9", "end 0.5"]` the reveal therefore runs from
  *"top of the text reaches 90% of the viewport"* to *"top of the text reaches
  50% of the viewport"* instead of *"bottom reaches 50%"* — i.e. it completes
  slightly **earlier**, never later, so no text can be left dim once it is in
  the reading area. Making it literal would require `display: inline-block`,
  which would stop highlights wrapping across lines (spec §5 forbids that), so
  the prescribed offset was kept as written.
- Verified in-browser on `/`: words move 0.15 → 1 in reading order as the
  segment crosses the viewport, clamp back to 0.15 when scrolled above, and the
  `sr-only` + `aria-hidden` pair keeps a single screen-reader copy.

---

## 5. Acceptance checklist status

- [x] `docs/reveal-audit.md` exists; every highlighted instance found uses
      `HighlightReveal`, or is listed under "Needs confirmation".
- [x] Words fade 15% → 100% in reading order using the exact §2 constants and
      functions.
- [x] No other text (nav, buttons, pills, labels, footer, stats) has the effect.
- [ ] Pixel comparison before/after at all breakpoints — pending (layout is
      untouched by construction: opacity-only animation + a `sr-only` clipped
      span, no transforms, no class changes).
- [x] Above-the-fold highlighted text (hero descriptions, service hero intro,
      form-card heading) reveals on `mode="load"`.
- [x] Reduced motion renders the plain children at full opacity, unsplit.
- [x] Screen readers read each segment once via the `sr-only` copy; the animated
      copy is `aria-hidden`.
- [x] No React state updates during scroll.
- [x] CMS `highlight` marks and hardcoded fallbacks both render through
      `HighlightReveal`.
- [x] No leftover demo code.
