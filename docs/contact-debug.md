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

## Verification

See the final report below.
