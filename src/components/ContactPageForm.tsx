import { useId, useRef, useState, type FormEvent } from 'react'
import { gsap, useGSAP, DUR, EASE } from '@/lib/motion'
import { submitContactForm, type ContactFormValues } from '@/lib/forms'
import { contact } from '@/data/contact'

type FieldName = keyof ContactFormValues
type Errors = Partial<Record<FieldName, string>>

const EMPTY: ContactFormValues = {
  name: '',
  email: '',
  phone: '',
  referral: '',
  message: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s()+-]+$/

const FIELD_BASE =
  'w-full rounded-[0.9rem] border bg-surface-input px-[1.25rem] text-[1.25rem] leading-normal font-medium text-white transition-colors placeholder:font-medium placeholder:text-white focus:outline-2 focus:outline-offset-2 focus:outline-primary disabled:opacity-70 sm:h-[48px] sm:rounded-[0.6rem] sm:text-[1rem] lg:h-[58px] lg:text-[1.1rem]'

function fieldBorder(error?: string) {
  return error ? 'border-red-400' : 'border-transparent'
}

/**
 * Contact-page enquiry form (contact spec §4).
 *
 * Deliberately separate from the shared lead `ContactForm` used inside service
 * hero/callback panels: this one is the dark, two-column form from the contact
 * reference and shares no surface styling with those cards. It owns its
 * validation, honeypot and submit/success/error states, and posts through
 * `submitContactForm()` so the endpoint can be swapped.
 */
export default function ContactPageForm({
  source = 'contact-page',
  onSubmit,
}: {
  source?: string
  onSubmit?: (values: ContactFormValues) => Promise<void>
}) {
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const [values, setValues] = useState<ContactFormValues>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const submitting = status === 'submitting'

  // Per-field reveal, matching the site's scroll-in motion (contact spec §8).
  // `Reveal` animates whole bands; the form needs one stagger across its
  // individual controls, so the same GSAP tokens are applied here.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const fields = formRef.current?.querySelectorAll('[data-contact-field]')
        if (!fields?.length) return
        gsap.from(fields, {
          y: 40,
          opacity: 0,
          duration: DUR.base,
          ease: EASE.out,
          stagger: 0.07,
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 88%',
            once: true,
          },
        })
      })
    },
    { scope: formRef },
  )

  function update<K extends FieldName>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
    if (status === 'success' || status === 'error') setStatus('idle')
  }

  function validate(): Errors {
    const found: Errors = {}
    if (!values.name.trim()) found.name = 'Enter your name.'
    if (!values.email.trim()) found.email = 'Enter your email address.'
    else if (!EMAIL_RE.test(values.email.trim())) found.email = 'Enter a valid email address.'
    if (values.phone.trim() && !PHONE_RE.test(values.phone.trim())) {
      found.phone = 'Enter a valid phone number.'
    }
    if (!values.message.trim()) found.message = 'Enter your message.'
    return found
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    // Honeypot: a real visitor never fills this. Pretend it worked, never send.
    if (honeypotRef.current?.value) {
      setStatus('success')
      return
    }

    const found = validate()
    setErrors(found)
    const firstInvalid = Object.keys(found)[0] as FieldName | undefined
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus('submitting')
    try {
      if (onSubmit) await onSubmit(values)
      else await submitContactForm(values, source)
      setValues(EMPTY)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact Chuech studio"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-[0.875rem]"
    >
      <div data-contact-field>
        <Field
          id={`${uid}-name`}
          name="name"
          type="text"
          required
          placeholder={contact.nameLabel}
          value={values.name}
          onChange={(value) => update('name', value)}
          error={errors.name}
          autoComplete="name"
          disabled={submitting}
        />
      </div>

      <div data-contact-field>
        <Field
          id={`${uid}-email`}
          name="email"
          type="email"
          required
          placeholder={contact.emailLabel}
          value={values.email}
          onChange={(value) => update('email', value)}
          error={errors.email}
          autoComplete="email"
          disabled={submitting}
        />
      </div>

      <div data-contact-field>
        <Field
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          placeholder={contact.phoneLabel}
          value={values.phone}
          onChange={(value) => update('phone', value)}
          error={errors.phone}
          autoComplete="tel"
          disabled={submitting}
        />
      </div>

      <div data-contact-field>
        <Field
          id={`${uid}-referral`}
          name="referral"
          type="text"
          placeholder={contact.referralLabel}
          value={values.referral}
          onChange={(value) => update('referral', value)}
          error={errors.referral}
          disabled={submitting}
        />
      </div>

      <div data-contact-field className="min-w-0 sm:col-span-2">
        <label htmlFor={`${uid}-message`} className="sr-only">
          {contact.messageLabel}
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          required
          placeholder={contact.messageLabel}
          value={values.message}
          onChange={(event) => update('message', event.target.value)}
          disabled={submitting}
          aria-required="true"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${uid}-message-error` : undefined}
          data-lenis-prevent
          className={`${FIELD_BASE} min-h-[150px] resize-y py-[1.25rem] ${fieldBorder(errors.message)} sm:min-h-[112px] lg:min-h-[135px]`}
        />
        {errors.message ? (
          <p id={`${uid}-message-error`} className="mt-2 text-[0.8rem] leading-snug text-red-300">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: off-screen, out of the tab order, hidden from assistive tech. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input
          ref={honeypotRef}
          id={`${uid}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div
        data-contact-field
        className="mt-[1.5rem] flex flex-col items-center gap-3 sm:col-span-2"
      >
        {status === 'success' ? (
          <p
            role="status"
            aria-live="polite"
            className="flex min-h-[44px] items-center justify-center gap-2 text-center text-[1rem] font-medium text-white"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Thanks — we’ll be in touch shortly.
          </p>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting ? true : undefined}
            className="inline-flex h-[44px] w-[152px] items-center justify-center rounded-pill bg-primary px-6 text-[0.9rem] font-medium whitespace-nowrap text-obsidian transition hover:shadow-glow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60 sm:h-[32px] sm:w-[114px] sm:px-2 lg:h-[45px] lg:w-[186px] lg:px-6"
            style={{ touchAction: 'manipulation' }}
          >
            {submitting ? 'Sending…' : 'Send Message'}
          </button>
        )}

        {status === 'error' ? (
          <p role="alert" aria-live="assertive" className="text-center text-[0.9rem] text-red-300">
            Something went wrong while sending your message. Please try again, or email{' '}
            <a
              href={`mailto:${contact.email}`}
              className="underline underline-offset-2 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {contact.email}
            </a>
            .
          </p>
        ) : null}
      </div>
    </form>
  )
}

function Field({
  id,
  name,
  type,
  required,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  disabled,
}: {
  id: string
  name: Exclude<FieldName, 'message'>
  type: 'text' | 'email' | 'tel'
  required?: boolean
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
  autoComplete?: string
  disabled: boolean
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${FIELD_BASE} h-[63px] ${fieldBorder(error)}`}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-[0.8rem] leading-snug text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  )
}
