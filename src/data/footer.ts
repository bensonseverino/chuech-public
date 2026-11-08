/*
 * Footer data (footer spec §4). All copy and links in one typed file; the
 * component contains no hard-coded copy. Shared values are imported, not
 * duplicated.
 */
import { company } from './terms'
import { contact } from './contact'
import { SERVICES } from '../content/home'
import { ROUTES } from '../routes'

export interface FooterLink {
  label: string
  href: string
}

/**
 * Services for the intro line — driven by the same list the nav/services page
 * uses. Each entry has the label and the correct route.
 */
function serviceLinks(): FooterLink[] {
  return SERVICES.map((service) => ({
    label: service.title,
    href: `/${service.slug}`,
  }))
}

export const footer = {
  intro: {
    // The spec's template: "{tradingName} is a … studio helping brands grow
    // with smart, results-focused {services}." The services are inserted as
    // underlined links. We keep the existing site sentence from FOOTER.statement
    // as the base and replace the inline service links with our linked version.
    // The original statement: "Chuech Studio is a Nairobi based web design
    // agency helping brands grow with thoughtful, purposeful Branding, Web
    // Design, SEO, PPC, and Video."
    text: '{tradingName} is a Nairobi based web design agency helping brands grow with thoughtful, purposeful {services}.',
    services: serviceLinks(),
  },
  heading: 'Get in Touch',
  details: {
    email: contact.email,
    phone: contact.phone,
    address: contact.address,
  },
  cta: { label: 'Contact', href: ROUTES.contact },
  links: [
    { label: 'Services', href: ROUTES.services },
    { label: 'Work', href: ROUTES.work },
    { label: 'About', href: ROUTES.aboutUs },
    { label: 'Blog', href: '/blog' },
    { label: 'Privacy Policy', href: ROUTES.privacyPolicy },
    { label: 'Terms & Conditions', href: ROUTES.termsConditions },
  ] satisfies FooterLink[],
  legalLine: '© {year} {tradingName}',
} as const

/* Verify each href against the router (footer spec §4). If a route doesn't
   exist yet, it will land on the 404 view — report it in the acceptance. */
if (import.meta.env.DEV) {
  const missing: string[] = []
  for (const link of footer.links) {
    // The project's route constants: check if the href matches a known route
    const isKnown = Object.values(ROUTES).includes(link.href as typeof ROUTES[keyof typeof ROUTES])
    // /blog is intentionally not a built route — it's a future page.
    if (!isKnown && link.href !== '/blog') missing.push(link.href)
  }
  if (missing.length > 0) {
    console.warn(`[footer] links without matching route constants: ${missing.join(', ')}`)
  }
}

void company
void contact
void SERVICES
void ROUTES