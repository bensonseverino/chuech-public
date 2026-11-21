#!/usr/bin/env node
/*
 * Contact intake smoke test (fix-contact-form-resend.md §E.1).
 *
 * Reads API_URL (full form endpoint) and ORIGIN (the real frontend origin)
 * from the environment. Runs preflight, a clearly marked valid POST, an
 * invalid POST, a honeypot POST and a disallowed-origin POST, then prints a
 * pass/fail table with the requestId of each call.
 *
 * WARNING: the valid POST stores a D1 row and sends ONE real email. Set
 * SKIP_EMAIL=1 to exercise only the non-sending checks.
 *
 * Example:
 *   API_URL=https://chuechstudio.co.ke/api/public/forms/contact/submissions \
 *   ORIGIN=https://chuechstudio.co.ke SKIP_EMAIL=1 node scripts/contact-smoke.mjs
 */
const API_URL = process.env.API_URL
const ORIGIN = process.env.ORIGIN
const SKIP_EMAIL = process.env.SKIP_EMAIL === '1'

if (!API_URL || !ORIGIN) {
  console.error('Set API_URL and ORIGIN (see the header of this script).')
  process.exit(1)
}

const results = []
function record(name, ok, detail) {
  results.push({ name, ok, detail })
  console.log(`${ok ? '  ✅' : '  ❌'} ${name} — ${detail}`)
}

const baseHeaders = { 'Content-Type': 'application/json', Origin: ORIGIN }
const validBody = {
  values: {
    name: '[TEST] Contact smoke',
    email: 'benson7191@gmail.com',
    phone: '',
    referral: 'Smoke test',
    message: 'One-time contact smoke test. Safe to ignore.',
  },
  website: '',
  elapsedMs: 5000,
  context: { page: '/contact' },
}

// 1. Preflight
try {
  const res = await fetch(API_URL, {
    method: 'OPTIONS',
    headers: {
      Origin: ORIGIN,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  })
  record('preflight', res.status === 204 || res.status === 200, `HTTP ${res.status}`)
} catch (cause) {
  record('preflight', false, String(cause))
}

// 2. Valid POST (real email unless SKIP_EMAIL)
if (SKIP_EMAIL) {
  console.log('  ⏭️  valid POST — skipped (SKIP_EMAIL=1)')
} else {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify(validBody),
    })
    const body = await res.json().catch(() => ({}))
    record('valid POST', res.ok && body.ok === true, `HTTP ${res.status} ${JSON.stringify(body).slice(0, 160)}`)
  } catch (cause) {
    record('valid POST', false, String(cause))
  }
}

// 3. Invalid POST (missing required fields)
try {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: baseHeaders,
    body: JSON.stringify({ ...validBody, values: { name: '', email: 'bad', referral: 'x' } }),
  })
  record('invalid POST', res.status === 400, `HTTP ${res.status}`)
} catch (cause) {
  record('invalid POST', false, String(cause))
}

// 4. Honeypot POST — silent accept, nothing stored
try {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: baseHeaders,
    body: JSON.stringify({ ...validBody, website: 'spam' }),
  })
  record('honeypot silent drop', res.status === 201, `HTTP ${res.status}`)
} catch (cause) {
  record('honeypot silent drop', false, String(cause))
}

// 5. Disallowed origin
try {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { ...baseHeaders, Origin: 'https://evil.example' },
    body: JSON.stringify(validBody),
  })
  const allowOrigin = res.headers.get('Access-Control-Allow-Origin')
  record('disallowed origin', res.status === 403 && !allowOrigin, `HTTP ${res.status}, allow-origin=${allowOrigin ?? 'none'}`)
} catch (cause) {
  record('disallowed origin', false, String(cause))
}

const failed = results.filter((r) => !r.ok).length
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed === 0 ? 0 : 1)
