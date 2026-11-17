# Forms inventory (cms-forms-reviews-spec §2.1)

One row per form on the public site. Field keys equal the `name` attributes the
frontend already uses — the CMS must seed forms with these exact keys.

| Slug | Where it appears | Fields (key, label, type, required, validation) | Current submit behaviour | Success UI | Error UI |
|---|---|---|---|---|---|
| `call-back` | Project pages — `CallBackCard` (dark card with the project testimonial + the form) | `name` (Name*, text, required, non-empty) · `phone` (Phone*, tel, required, `/^\+?[\d\s()-]+$/`) · `email` (Email, email, optional, email regex) | ✅ Already on the CMS: `src/cms/forms.ts` → `POST /api/forms/call-back` (`name`/`email`/`phone` + `_context.projectSlug/projectTitle` + `_gotcha` honeypot + UTM). No Turnstile token yet (no widget rendered). Client validates first. | Form is replaced by `Thanks, we'll be in touch.` (`role="status"`) | Per-field obsidian border + 13px helper line under the field; `aria-invalid`/`aria-describedby`; focus moves to first invalid |
| `contact` | `/contact` — `ContactPageForm` (dark two-column enquiry form) | `name` (Name, text, required) · `email` (Email, email, required, email regex) · `phone` (Phone, tel, optional, `/^[\d\s()+-]+$/`) · `referral` (How did you hear about us?, select, optional) · `message` (Message/Your project, textarea, required) | ⚠️ Partially wired: `src/lib/forms.ts` → `POST /api/forms/contact` with a **flat** body (`name`, `email`, `phone`, `referral`, `message`, `source: 'contact-page'`, `submittedAt`). The endpoint stores `name/email/phone/message`; **`referral` is silently dropped** and the extra keys are unused. No Turnstile token. Honeypot: unnamed ref input (bot field), client-side fake success. | Clears the form, inline success treatment in the same typography | Per-field red-ish border (`border-red-400`) + helper line; focus to first invalid; `aria-invalid`/`aria-describedby` |
| `web-design-hero` | `/web-design` hero card — `ContactForm` via `ServiceHero` | `name` (Name*, text, required) · `email` (Email*, email, required) · `phone` (Phone, tel, optional) · `message` (Message, textarea, optional) | ❌ **Not on the CMS**: `src/lib/leads.ts` → `VITE_LEAD_ENDPOINT`, which is **unset — the payload is `console.info`'d and dropped**. Honeypot: `company` input (`sr-only`). | Form replaced by `Thanks, we'll be in touch.` | obsidian border + helper line (same as `call-back`) |
| `branding-hero` | `/branding` hero card — same as above | same four fields | ❌ same no-op transport | same | same |
| `seo-hero` | `/seo` hero card — same as above | same four fields | ❌ same no-op transport | same | same |
| `ppc-hero` | `/ppc` hero card — same as above | same four fields | ❌ same no-op transport | same | same |
| `web-design-callback` | `/web-design` dark callback panel — `ContactForm` via `CallbackPanel` (panel also holds the service testimonial slider) | `name` (Name*, text, required) · `phone` (Phone*, tel, required) · `email` (Email, email, optional) | ❌ same no-op transport (`VITE_LEAD_ENDPOINT`) | same | same |
| `branding-callback` | `/branding` callback panel | same three fields | ❌ same no-op transport | same | same |
| `seo-callback` | `/seo` callback panel | same three fields | ❌ same no-op transport | same | same |
| `ppc-callback` | `/ppc` callback panel | same three fields | ❌ same no-op transport | same | same |
| `about-callback` | `/about` — `BuiltByCard`'s `BuiltByCallbackForm` | `name` (Name*, text, required) · `phone` (Phone*, tel, required) · `email` (Email, email, optional) | ⚠️ Half-wired: `submitContactForm(values, 'about-callback')` → **hardcoded endpoint** `/api/forms/contact`, so it lands in the `contact` form; the `source: 'about-callback'` key in the body is dropped server-side. Honeypot: `company` ref input. | Inline success text in the card | obsidian border + helper line |

## Notes for the build

- **Old submit code to remove** (spec §8.3): `src/lib/leads.ts` (`submitLead`, no-op) and the
  flat-body `submitContactForm` in `src/lib/forms.ts`. `ContactForm`, `ContactPageForm` and
  `BuiltByCallbackForm` keep their markup/styling and switch to `useFormSubmit` + `submitForm`.
- **Honeypot names differ today**: `company` (ContactForm / BuiltBy), unnamed ref input
  (ContactPageForm), `_gotcha` (CallBackCard). The spec's reserved key is `website`; the
  HoneypotField component will standardise this without changing the visible layout.
- The shared `ContactForm` is field-configurable; the CMS field keys above match its
  `name` attributes exactly.
- `forms` rows already exist in D1 for every source above (auto-registered) plus `call-back`
  and `contact` — the seed must upsert field definitions without breaking existing rows.
- The `referral` select's options come from `src/data/contact.ts`; seed them as the field's
  `options` so server-side validation accepts the values.
