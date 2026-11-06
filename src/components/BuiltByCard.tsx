import { useId, useRef, useState, type FormEvent } from 'react'
import { Reveal } from './ui/Reveal'
import Container from './primitives/Container'
import Button from './primitives/Button'
import MediaFrame from './primitives/MediaFrame'
import { imageSrc } from '../content/assets'
import { submitContactForm } from '../lib/forms'
import { about } from '../data/about'

type CallbackFormValues = {
  name: string
  phone: string
  email: string
}

const EMPTY: CallbackFormValues = { name: '', phone: '', email: '' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s()-]+$/

/**
 * Field shell (about spec §4.3): light-grey fill, ~0.5rem radius, 50px tall,
 * obsidian error border — the same failure styling the shared ContactForm uses.
 */
const FIELD =
  'w-full h-[50px] min-w-0 rounded-[8px] border bg-fog px-5 text-[14px] leading-[20px] text-obsidian placeholder:text-obsidian/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian'

/**
 * Callback form for the Built-by card (about spec §4.3): Name* + Phone*
 * required, Email optional, honeypot `company`, POSTs through the shared
 * `submitContactForm()` with source "about-callback" — never reloads the page.
 */
function BuiltByCallbackForm() {
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const [values, setValues] = useState<CallbackFormValues>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof CallbackFormValues, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const submitting = status === 'submitting'

  function fieldId(name: string) {
    return `${uid}-${name}`
  }

  function helperId(name: string) {
    return `${uid}-${name}-error`
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    // Filled honeypot: silently pretend it worked, never send.
    if (honeypotRef.current?.value) {
      setStatus('success')
      return
    }

    const found: Partial<Record<keyof CallbackFormValues, string>> = {}
    if (!values.name.trim()) found.name = 'Enter your name.'
    if (!values.phone.trim()) found.phone = 'Enter your phone number.'
    else if (!PHONE_RE.test(values.phone.trim())) found.phone = 'Enter a valid phone number.'
    if (values.email.trim() && !EMAIL_RE.test(values.email.trim())) {
      found.email = 'Enter a valid email address.'
    }

    setErrors(found)
    const firstInvalid = (Object.keys(found) as Array<keyof CallbackFormValues>)[0]
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus('submitting')
    try {
      /* The callback form only collects name/phone/email; the shared service
         masks the optional contact-page fields. */
      await submitContactForm(
        {
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          referral: '',
          message: '',
        },
        'about-callback',
      )
      setValues(EMPTY)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p role="status" className="text-[16px] leading-[24px] text-obsidian">
        Thanks — we’ll call you back soon.
      </p>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-[18px]">
      {(
        [
          { name: 'name', type: 'text', label: 'Name*', required: true, ac: 'name' },
          { name: 'phone', type: 'tel', label: 'Phone*', required: true, ac: 'tel' },
          { name: 'email', type: 'email', label: 'Email', required: false, ac: 'email' },
        ] as const
      ).map((field) => {
        const id = fieldId(field.name)
        const error = errors[field.name]
        return (
          /* `min-w-0` stops the control's intrinsic width from setting a floor
              on the card at very narrow viewports. */
          <div key={field.name} className="min-w-0">
            <label htmlFor={id} className="sr-only">
              {field.label}
            </label>
            <input
              id={id}
              name={field.name}
              type={field.type}
              placeholder={field.label}
              value={values[field.name]}
              onChange={(event) =>
                setValues((current) => ({ ...current, [field.name]: event.target.value }))
              }
              required={field.required}
              autoComplete={field.ac}
              aria-required={field.required || undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? helperId(field.name) : undefined}
              disabled={submitting}
              className={`${FIELD} ${error ? 'border-obsidian' : 'border-transparent'}`}
            />
            {error ? (
              <p
                id={helperId(field.name)}
                className="mt-[6px] text-[13px] leading-[18px] text-obsidian"
              >
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
          {submitting ? 'Sending…' : about.builtBy.form.submitLabel}
        </button>

        {status === 'error' ? (
          <p role="alert" className="mt-[10px] text-[13px] leading-[18px] text-obsidian">
            Sorry, something went wrong. Please try again, or email hello@chuechstudio.co.ke.
          </p>
        ) : null}
      </div>
    </form>
  )
}

/**
 * "Built by those who know…" card (about spec §4.3): a large-radius white card —
 * left column is the dot heading + callback form; right column is the story,
 * "Ready to go?" and the dark Contact pill. The three-photo strip (§4.3b) sits
 * directly under the card.
 */
export default function BuiltByCard() {
  const { builtBy, photoStrip } = about

  return (
    <>
      <Reveal
        as="section"
        aria-label={builtBy.heading}
        className="scroll-mt-24 pb-[25px] md:pb-0"
        stagger={0.1}
      >
        <Container>
          <div className="rounded-[1.75rem] bg-white p-[30px] shadow-soft md:p-[50px] lg:p-[70px]">
            <div className="grid gap-[40px] md:grid-cols-2 md:items-start lg:gap-[calc(var(--u)*5)]">
              {/* Left column: heading + form */}
              <div className="flex flex-col gap-[30px]">
                <div className="flex items-start gap-[14px]">
                  <span
                    aria-hidden="true"
                    className="mt-[4px] h-[14px] w-[14px] shrink-0 rounded-full bg-obsidian"
                  />
                  <h2 className="min-w-0 text-[clamp(24px,3.5vw,33px)] leading-[1.15] font-medium tracking-[-0.02em] text-obsidian">
                    {builtBy.heading}
                  </h2>
                </div>
                <BuiltByCallbackForm />
              </div>

              {/* Right column: story + CTA */}
              <div className="flex flex-col gap-[25px] md:pl-[40px] lg:pl-[calc(var(--u)*4)]">
                <p className="text-[16px] leading-[1.6] text-obsidian md:text-[18px]">
                  {builtBy.story}
                </p>
                <div className="flex flex-col gap-[16px]">
                  <h3 className="text-[clamp(22px,3vw,28px)] leading-[1.2] font-medium tracking-[-0.02em] text-obsidian">
                    {builtBy.ctaHeading}
                  </h3>
                  <p className="text-[16px] leading-[1.6] text-obsidian md:text-[18px]">
                    {builtBy.ctaBody}
                  </p>
                  <div className="pt-[8px]">
                    <Button variant="dark" to={builtBy.ctaHref} className="w-fit">
                      {builtBy.ctaLabel}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Reveal>

      {/* Photo strip (§4.3b): three equal rounded photos, small gap. */}
      <Reveal
        as="section"
        aria-label="Chuech studio photos"
        className="scroll-mt-24 py-[25px]"
        stagger={0.1}
      >
        <Container>
          <div className="grid gap-[8px] md:grid-cols-3 lg:gap-[calc(var(--u)*0.5)]">
            {photoStrip.map((photo, i) => (
              /* TODO: replace with real Chuech studio photos (about spec §4.3b). */
              <MediaFrame
                key={`${photo.src}-${i}`}
                src={imageSrc(photo.src)}
                alt={photo.alt}
                radius="card"
                className="w-full"
              />
            ))}
          </div>
        </Container>
      </Reveal>
    </>
  )
}