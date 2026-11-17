# Reviews inventory (cms-forms-reviews-spec §2.2)

Every place reviews/testimonials appear on the public site. The **Testimonials
page/link is already removed** (the live router 404s `/testimonials` via the
removed-routes guard in `src/content/live/map.ts`) — do not re-add it.

All blocks use the same `TestimonialSlider` primitive (or the static
`CaseStudy` block) with the shape `{ quote, name, company }` — **no avatars,
no star ratings, no source links anywhere in the current design**.

| Page | Component | Data shown | Count |
|---|---|---|---|
| `/` (home) | `LatestWork` → `TestimonialSlider tone="dark"` (left column of the Latest Work band, under two project cards) | `quote`, `name`, `company` — slider with prev/next controls | all (slider pages through the list) |
| `/services` | `LatestWork` → same slider | same shape | same list as home |
| `/about` | `ResultsBlock` → `TestimonialSlider tone="dark"` (same band layout as home) | same shape | same list as home |
| `/web-design`, `/branding`, `/seo`, `/ppc` | `CallbackPanel` → `TestimonialSlider` above the callback form | quote, name, company | slider over the service payload's `testimonials` |
| `/` (home) | `CaseStudy` (static "Design that drives results" band: stat + blurb + CTA + quote) | `CASE_STUDY.testimonial` — hardcoded `Adrian Lambert / Blackbird` quote (with typographic “ ” already in the copy) | 1 |
| `/work/:slug` | `CallBackCard` — the project's testimonial sits beside the call-back form (`"Name: **Company**"` attribution line) | `testimonial.quote/author/company` from the project API (fallback: bundled Eventotron) | 1 |

## Data sources today

- **Fallback:** `TESTIMONIALS` in `src/content/home.ts` — 6 hardcoded reviews, in order:
  1. Atem Eyong — Hard Rock Cafe — "Absolutely fantastic team to work with!"
  2. Joe Weagraff — Hitachi — "If you are looking for a superb, competent, and fast creative partner, this is it."
  3. Abbie Booth — Istobal — "The quality was excellent, and communication throughout was clear and professional. I highly recommend Chuech Studio."
  4. Mike Jackson — Modern Garden Rooms — "Chuech Studio helped us achieve the top position for 'garden rooms'…"
  5. Adrian Lambert — Blackbird — "We've worked with the team for 5 years…" (also hardcoded as `CASE_STUDY.testimonial`)
  6. Chris Cheadle — Northern Dough Co — "We're thrilled with the SEO audit and implementations!…"
- **CMS (legacy):** `testimonials` entries collection via `GET /api/public/collections/testimonials`
  (legacy endpoint), mapped by `src/content/live/map.ts` (`testimonialViews()`), falling back to
  the 6 hardcoded rows when the API is down/empty.
- **Project page:** `testimonial: { quote, author, company }` on the project detail payload
  (inline `projects` columns today; becomes `review_id` per the spec).

## Mapping to the new `reviews` table

- All six fallback rows seed the `reviews` table in the order above (`position` 10–60),
  `is_visible = 1`, no featured flag yet.
- `TestimonialView.name` ↔ `author_name`; `company` ↔ `company`; `quote` is stored
  **without** the surrounding “ ” marks (the frontend slider adds them today — keep that).
- `CASE_STUDY.testimonial` (Adrian Lambert) should point at the seeded `Adrian Lambert`
  review row (it is the same quote) once home wiring switches to CMS data.
- Home/services/about sliders switch to `useReviews({ featured: 1 })` when reviews are
  featured in the CMS; service panels take the service payload's reviews.
- No `avatar`, `rating`, `source` fields are rendered anywhere today — the CMS may store
  them but the frontend keeps its exact current markup.
