/*
 * Lead submission (web-design spec §6). The default implementation posts JSON
 * to `VITE_LEAD_ENDPOINT`; when that variable is not set it logs and resolves
 * so the form still works end to end in development.
 *
 * TODO(integration): point `VITE_LEAD_ENDPOINT` at the real inbox/CRM endpoint
 * once one is chosen — no endpoint is invented here on purpose.
 */

export type LeadPayload = {
  /** Which form the lead came from, e.g. `web-design-hero`. */
  source: string
  fields: Record<string, string>
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  const endpoint = import.meta.env.VITE_LEAD_ENDPOINT as string | undefined

  if (!endpoint) {
    // TODO(integration): no endpoint configured yet.
    console.info('[leads] VITE_LEAD_ENDPOINT is not set; lead not sent.', payload)
    return
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Lead submission failed with status ${response.status}`)
  }
}
