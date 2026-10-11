import { useId, useRef, useState, type FormEvent } from 'react'
import { submitLead } from '../lib/leads'

export type ContactField = {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'textarea'
  required?: boolean
}

type ContactFormProps = {
  fields: ContactField[]
  submitLabel: string
  /** Identifies the form in the lead payload, e.g. `web-design-hero`. */
  source: string
  onSubmit?: (values: Record<string, string>) => Promise<void>
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?[\d\s()-]+$/

/** `autocomplete` per field name (spec §6). */
const AUTOCOMPLETE: Record<string, string> = {
  name: 'name',
  email: 'email',
  phone: 'tel',
}

/**
 * Field shell (spec §6): `fog` fill, no visible border, 20px radius, 50px tall,
 * 22px side padding, 14px text with an obsidian/60 placeholder. The transparent
 * border reserves the 1px the error state paints obsidian, so nothing shifts.
 * The two colours are swapped, never both present: a `border-transparent` left
 * on alongside `border-obsidian` would win on stylesheet order.
 */
const FIELD =
  'w-full rounded-media border bg-fog px-[22px] text-[14px] leading-[20px] text-obsidian placeholder:text-obsidian/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian'

function validate(fields: ContactField[], values: Record<string, string>) {
  const errors: Record<string, string> = {}

  for (const field of fields) {
    const value = (values[field.name] ?? '').trim()
    const label = field.label.replace('*', '')

    if (!value) {
      if (field.required) errors[field.name] = `Enter your ${label.toLowerCase()}.`
      continue
    }
    if (field.type === 'email' && !EMAIL.test(value)) {
      errors[field.name] = 'Enter a valid email address.'
    } else if (field.type === 'tel' && !PHONE.test(value)) {
      errors[field.name] = 'Enter a valid phone number.'
    }
  }

  return errors
}

/**
 * The shared lead form (web-design spec §6), used by the hero card and the
 * callback panel. Controlled fields with visually hidden real labels, client
 * side validation (the only failure styling the design system allows is the
 * obsidian border + helper line, so no error colour is invented), a honeypot
 * and the `submitLead` default target. The form never reloads the page.
 */
export default function ContactForm({
  fields,
  submitLabel,
  source,
  onSubmit,
}: ContactFormProps) {
  const uid = useId()
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)

  const submitting = status === 'submitting'

  function fieldId(name: string) {
    return `${uid}-${name}`
  }

  function helperId(name: string) {
    return `${uid}-${name}-error`
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Filled honeypot: silently pretend it worked, never send.
    if (honeypotRef.current?.value) {
      setStatus('success')
      return
    }

    const found = validate(fields, values)
    setErrors(found)

    const firstInvalid = fields.find((field) => found[field.name])
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid.name}"]`)
        ?.focus()
      return
    }

    setStatus('submitting')
    try {
      const payload = { source, fields: values }
      if (onSubmit) await onSubmit(values)
      else await submitLead(payload)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p role="status" className="text-[16px] leading-[24px] text-obsidian">
        Thanks, we&rsquo;ll be in touch.
      </p>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-[18px]">
      {fields.map((field) => {
        const id = fieldId(field.name)
        const error = errors[field.name]
        const describedBy = error ? helperId(field.name) : undefined
        const invalid = error ? true : undefined
        const shared = {
          id,
          name: field.name,
          placeholder: field.label,
          value: values[field.name] ?? '',
          onChange: (event: { target: { value: string } }) =>
            setValues((current) => ({ ...current, [field.name]: event.target.value })),
          required: field.required,
          'aria-required': field.required || undefined,
          'aria-invalid': invalid,
          'aria-describedby': describedBy,
          disabled: submitting,
          className: `${FIELD} ${error ? 'border-obsidian' : 'border-transparent'}`,
        }

        return (
          /* `min-w-0` stops a control's intrinsic width from setting a floor
             on the card at very narrow viewports. */
          <div key={field.name} className="min-w-0">
            <label htmlFor={id} className="sr-only">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                {...shared}
                rows={5}
                className={`${shared.className} min-h-[140px] resize-y py-[15px]`}
              />
            ) : (
              <input
                {...shared}
                type={field.type ?? 'text'}
                autoComplete={AUTOCOMPLETE[field.name]}
                className={`${shared.className} h-[50px]`}
              />
            )}
            {error ? (
              <p id={helperId(field.name)} className="mt-[6px] text-[13px] leading-[18px] text-obsidian">
                {error}
              </p>
            ) : null}
          </div>
        )
      })}

      {/* Honeypot: off-screen, out of the tab order and hidden from a11y. */}
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

      <div>
        {/* The mint `Button` styling on a real submit control. */}
        <button
          type="submit"
          aria-busy={submitting || undefined}
          disabled={submitting}
          className="inline-flex min-h-[44px] items-center justify-center rounded-button bg-primary px-6 text-[14px] font-medium text-obsidian transition hover:shadow-glow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian disabled:opacity-60"
        >
          {submitLabel}
        </button>

        {status === 'error' ? (
          <p role="alert" className="mt-[10px] text-[13px] leading-[18px] text-obsidian">
            Sorry, something went wrong. Please try again, or email hello@marino.co.uk.
          </p>
        ) : null}
      </div>
    </form>
  )
}
