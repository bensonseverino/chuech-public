/*
 * Services page (`/services`) content (services spec §4–§5).
 * Plain data only — the hero description needs bold spans, so it lives with
 * its JSX in ServicesPage. All COPY was transcribed from the reference
 * screenshots / spec; assets are labelled placeholders: TODO(asset).
 */
import { ROUTES } from '../routes'
import { SERVICES, type Service } from './home'

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const SERVICES_HERO: {
  label: string
  title: string
  pills: [string, string]
  image: string
} = {
  label: 'Services',
  title: 'What We Do',
  pills: ['Marketing under one roof', 'Senior specialists'],
  /** Asset slot for the 16:9 team photo (`services-hero.jpg` placeholder). */
  image: 'services-hero',
}

export const SERVICES_HERO_CONTACT = {
  email: { label: 'hello@chuechstudio.co.ke', href: 'mailto:hello@chuechstudio.co.ke' },
  phone: { label: '+254 117 954 929', href: 'tel:+254117954929' },
} as const

/* ------------------------------------------------------------------ */
/* Services rows (page variant)                                        */
/* ------------------------------------------------------------------ */

/**
 * The Home service rows as used on the page, with one difference: the SEO
 * "AI SEO" keyword becomes an inline link to `/ai-seo` (services spec §5.1).
 * Everything else is reused verbatim so the Home page stays untouched.
 */
export const PAGE_SERVICES: Service[] = SERVICES.map((service) =>
  service.slug === 'seo-manchester'
    ? {
        ...service,
        keywords: service.keywords.map((keyword) =>
          keyword === 'AI SEO' ? { label: 'AI SEO', href: ROUTES.aiSeo } : keyword,
        ),
      }
    : service,
)

/* ------------------------------------------------------------------ */
/* Intro statement (no CTA, four lavender highlights)                  */
/* ------------------------------------------------------------------ */

export const SERVICES_INTRO = {
  text:
    'We plan, design and run digital work for businesses in Nairobi, Kenya and beyond. Our services cover [web design](/web-design), [branding](/branding), [SEO](/seo-manchester) and [PPC](/ppc). Every project starts with a conversation about what you need and ends with work you can measure. Talk to us on hello@chuechstudio.co.ke or +254117954929.',
  /** Marked phrases; kept clear of the inline link labels above. */
  highlights: ['digital work', 'what you need', 'work you can measure'],
} as const

/* ------------------------------------------------------------------ */
/* Latest work intro                                                   */
/* ------------------------------------------------------------------ */

export const SERVICES_WORK_INTRO =
  'Whether you\u2019re part of a multi-national company, an independent business venture or something in between, we would love to hear from you and together we can earn the trust of your future business prospects.'
