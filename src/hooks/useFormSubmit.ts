import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { submitForm, FormError, type FieldErrors } from '@/lib/forms'

/*
 * The one submit hook every form uses (cms-forms-reviews-spec.md §8.2).
 * Owns the elapsed-time measurement, the project context, Turnstile token
 * round trip and the status/field-error state. Forms keep their own markup.
 */

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function useFormSubmit(
  slug: string,
  opts?: {
    projectSlug?: string
    projectTitle?: string
    getToken?: () => Promise<string | undefined>
    resetToken?: () => void
  },
) {
  const { pathname } = useLocation()
  const startedAt = useRef(0)
  const [status, setStatus] = useState<Status>('idle')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [message, setMessage] = useState<string>()
  const [error, setError] = useState<FormError>()

  // Marks when the visitor first saw the form (mounted), for elapsedMs (§4).
  useEffect(() => {
    if (startedAt.current === 0) startedAt.current = Date.now()
  }, [])

  const submit = useCallback(
    async (values: Record<string, string | string[] | boolean>, honeypot = '') => {
      if (status === 'submitting') return false // block double submits
      setStatus('submitting')
      setFieldErrors({})
      setError(undefined)
      try {
        const turnstileToken = await opts?.getToken?.()
        const res = await submitForm(slug, values, {
          turnstileToken,
          website: honeypot,
          elapsedMs: Date.now() - startedAt.current,
          context: {
            page: pathname,
            projectSlug: opts?.projectSlug,
            projectTitle: opts?.projectTitle,
          },
        })
        setMessage(res.message)
        setStatus('success')
        return true
      } catch (e) {
        const err = e instanceof FormError ? e : new FormError('server', 'Something went wrong.')
        setError(err)
        setFieldErrors(err.fields ?? {})
        setStatus('error')
        opts?.resetToken?.()
        return false
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slug, pathname, status],
  )

  const reset = useCallback(() => {
    setStatus('idle')
    setFieldErrors({})
    setError(undefined)
    setMessage(undefined)
    startedAt.current = Date.now()
  }, [])

  return {
    submit,
    reset,
    status,
    fieldErrors,
    /** Clears one server field error while the visitor retypes it. */
    clearFieldError: (key: string) =>
      setFieldErrors((current) => {
        if (!current[key]) return current
        const next = { ...current }
        delete next[key]
        return next
      }),
    message,
    error,
    isSubmitting: status === 'submitting',
  }
}
