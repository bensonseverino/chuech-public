/**
 * Contact-page form submission (contact spec §4).
 *
 * Kept behind a service function so the transport can be swapped without
 * touching the form. The endpoint defaults to the CMS's custom-form route;
 * set `VITE_FORMS_ENDPOINT` to point at a different deployment.
 */
export const CONTACT_FORM_SOURCE = 'contact-page'

export type ContactFormValues = {
  name: string
  email: string
  phone: string
  referral: string
  message: string
}

export async function submitContactForm(
  values: ContactFormValues,
  source = CONTACT_FORM_SOURCE,
): Promise<void> {
  const endpoint = import.meta.env.VITE_FORMS_ENDPOINT ?? '/api/forms/contact'

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...values,
      source,
      submittedAt: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    throw new Error(`Contact form submission failed with status ${response.status}`)
  }
}
