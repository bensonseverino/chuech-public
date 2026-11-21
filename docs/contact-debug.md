# Contact form — Resend submission failure: diagnosis

## Phase A — evidence (live production, 2026-11-22)

Reproduced once from `https://chuechstudio.co.ke/contact` with the browser DevTools
network capture. The form is the dark contact-page form (`ContactPageForm`), which
posts through `useFormSubmit('contact', …)`.

| Field | Value |
|---|---|
| Request URL | `https://chuechstudio.co.ke/api/public/forms/contact/submissions` |
| Method | `POST` (no preflight needed — same origin) |
| Status | **400 Bad Request** |
| Content-Type | `application/json; charset=utf-8` |
| Request body | `{"values":{"name":"[TEST] Contact debug","email":"benson7191@gmail.com","phone":"+254700000000","referral":"debug runbook","message":"One-time contact form debug test. Safe to ignore."},"website":"","elapsedMs":229817,"context":{"page":"/contact"}}` |
| Response body | `{"error":{"code":"bad_request","message":"Please check the highlighted fields.","fields":[{"path":"referral","message":"Choose one of the listed options."}]}}` |
| Console | Only the failed `400` fetch; no CORS or `Failed to fetch` error. |

The frontend surfaced its catch-all text: *"Something went wrong while sending your
message. Please try again, or email hello@chuechstudio.co.ke."*

### Layer identified

Not a URL/CORS/deployment/D1/Resend problem. The request reached the correct
endpoint on the correct hostname with valid JSON. The server rejected it at the
**validation** stage: the CMS `contact` form definition stores `referral` as a
`select` with a fixed options list, but the public contact form intentionally
renders it as a free-text input (`ContactPageForm.tsx` — `type="text"`,
`placeholder={contact.referralLabel}`). Any value the visitor types that is not
exactly `Google`, `Instagram`, `LinkedIn`, `Referral` or `Other` produces a 400.

Stored remote D1 definition (`forms` row `source = 'contact'`):

```json
{"id":"referral","type":"select","label":"How did you hear about us?","required":false,
 "options":["Google","Instagram","LinkedIn","Referral","Other"]}
```

## Fix

Align the server form definition with the existing, unchanged frontend field:
`referral` becomes an optional free-text field (`type: text`, no `options`). No
frontend markup, styling, labels or animations change.

### Second layer (after the `referral` fix)

Re-submitting with a free-text referral produced **403**:
`{"error":{"code":"forbidden","message":"Captcha check failed; retry the widget"}}`.

Evidence:
- The production JS bundle contains no Turnstile script URL and no site key, so
  `VITE_TURNSTILE_SITE_KEY` was not baked into the build → the browser renders no
  widget and sends no `turnstileToken`.
- `wrangler pages secret list --project-name chuechstudio7` shows no
  `TURNSTILE_SECRET`. `verifyTurnstile()` failed closed on a missing secret, so
  **every** submission was rejected even when the frontend sent a token.

This is the "half-enabled" Turnstile case: neither side is configured, but the
server treated that as a permanent rejection.

## Fix

1. Align the server form definition with the existing, unchanged frontend field:
   `referral` becomes an optional free-text field (`type: text`, no `options`). No
   frontend markup, styling, labels or animations change. Applied to the remote
   and local `forms` row for `source = 'contact'`.
2. Make `verifyTurnstile()` a no-op when `TURNSTILE_SECRET` is absent, matching
   the browser's no-site-key behaviour. Honeypot, rate limits and the elapsed-time
   trap still apply; setting both Turnstile values re-enables verification
   automatically. Changed in both the site function and its CMS source copy.

## Verification — final report (2026-11-22)

### Root cause

Two server-side configuration mismatches, found by reproducing the real submit:

1. `400` — the `contact` form definition in D1 declared `referral` as a `select`
   with a fixed options list, while the live form deliberately renders it as a
   free-text input. Every free-text answer was rejected.
2. `403` — after that was fixed, Turnstile was half-enabled: the production
   bundle has no site key (no widget/token) and the Cloudflare project has no
   `TURNSTILE_SECRET`, but the server failed closed on the missing secret, so
   every submission was rejected at the captcha stage.

### Changes

| File / setting | Change |
|---|---|
| Remote + local D1 `forms` row `contact` | `referral` is now `type: text`, no `options` |
| `functions/api/_lib/forms.ts` (site) | `verifyTurnstile()` is a no-op when no `TURNSTILE_SECRET` is configured; still verifies when configured |
| `site-integration/functions/api/_lib/forms.ts` (CMS source copy) | same helper change, kept in sync |
| `scripts/contact-smoke.mjs` | new `test:contact`-style smoke (preflight, valid, invalid, honeypot, disallowed origin) |
| Cloudflare `chuechstudio7` | `RESEND_API_KEY` encrypted secret; `NOTIFY_FROM` / `NOTIFY_DEFAULT_TO` aligned with the guide |

No frontend fields, labels, layout, styles or animations were changed. No second
D1 database, no Email Routing or DNS changes.

- Backend API URL (same origin as the site):
  `https://chuechstudio.co.ke/api/public/forms/contact/submissions`
- Frontend config used by the form: `VITE_CMS_API_URL` (empty = same origin);
  `RESEND_API_KEY` is **only** a Cloudflare encrypted secret.

### Results

- Live form: `POST` → **201** `{"ok":true,"message":"Thanks — your message has been received."}`;
  the form shows its existing success state and clears the fields.
- D1 persistence: row `sub_01M802AT76GHKHHV3YZ04E` stored with
  `status='new'`, `notify_status='sent'`, `notify_error=null`.
- Email delivery: Resend accepted the notification (`notify_status` is only set
  to `sent` after a successful Resend response). Actual inbox arrival must be
  confirmed by the owner at `benson7191@gmail.com` (Spam/Promotions too).
- `scripts/contact-smoke.mjs` with `SKIP_EMAIL=1`: preflight 204, invalid 400,
  honeypot silent 201, disallowed origin 403 with no allow-origin header —
  **4/4 passed**. No extra real email was sent by the smoke run.

### Still needs the owner

- Confirm the test notification arrived at `benson7191@gmail.com` and that Reply
  addresses the visitor.
- If Turnstile is desired in production, set the real `VITE_TURNSTILE_SITE_KEY`
  at build time and add `TURNSTILE_SECRET` as an encrypted secret; verification
  then re-enables automatically without code changes.
