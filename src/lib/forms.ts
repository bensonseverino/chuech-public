/**
 * Form submission client (cms-forms-reviews-spec.md §8.2).
 *
 * The one transport every form uses: `POST /api/public/forms/:slug/submissions`
 * with `{ values, website, elapsedMs, turnstileToken, context }`. No form posts
 * anywhere else. Kept behind a service function so the endpoint can move
 * without touching a form component.
 */

export type FieldErrors = Record<string, string>
export type FormErrorCode =
  | 'validation'
  | 'verification_failed'
  | 'rate_limited'
  | 'network'
  | 'server'

export class FormError extends Error {
  code: FormErrorCode
  fields?: FieldErrors
  retryAfter?: number

  constructor(
    code: FormErrorCode,
    message: string,
    fields?: FieldErrors,
    retryAfter?: number,
  ) {
    super(message)
    this.code = code
    this.fields = fields
    this.retryAfter = retryAfter
  }
}

export interface SubmitOptions {
  turnstileToken?: string
  elapsedMs: number
  context?: { page?: string; projectSlug?: string; projectTitle?: string }
  /** The honeypot value — an empty string for every human. */
  website?: string
  signal?: AbortSignal
}

export type SubmitResult = { ok: true; message?: string }

export async function submitForm(
  slug: string,
  values: Record<string, string | string[] | boolean>,
  o: SubmitOptions,
): Promise<SubmitResult> {
  let res: Response
  try {
    res = await fetch(`${import.meta.env.VITE_CMS_API_URL ?? ''}/api/public/forms/${slug}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        values,
        website: o.website ?? '',
        elapsedMs: o.elapsedMs,
        turnstileToken: o.turnstileToken,
        context: o.context,
      }),
      signal: o.signal,
    })
  } catch {
    throw new FormError('network', "We couldn't reach the server.")
  }

  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean
    message?: string
    error?: { code?: string; message?: string; fields?: FieldErrors; retryAfter?: number }
  }

  if (res.ok) return data as SubmitResult

  const e = data.error ?? {}
  throw new FormError(
    (e.code as FormErrorCode) ?? 'server',
    e.message ?? 'Something went wrong.',
    e.fields,
    e.retryAfter,
  )
}
