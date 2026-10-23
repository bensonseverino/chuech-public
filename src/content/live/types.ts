/*
 * Live-content view models.
 *
 * Every page renders from these shapes. `map.ts` builds them twice: from the
 * CMS public API (the normal path) and from the hard-coded `src/content`
 * modules (the fallback while the API is unreachable or unpublished). Sections
 * therefore never branch on "CMS or fallback" — they just render a view.
 *
 * Inline strings use the CMS grammar (**bold**, ==highlight==, [text](/path)),
 * including the fallback, which is converted from the typed `RichSegment[]`
 * shapes at the boundary.
 */
import type { ContactField } from '../../components/ContactForm'
import type { Keyword } from '../home'

/** CMS inline markup. */
export type Inline = string

export type LinkView = { label: string; to: string }

export type MediaView = {
  /** Absolute URL from the CMS, or a bundled asset URL in the fallback. */
  src: string
  alt: string
  /** `object-position` for the crop. */
  focus?: string
}

export type ProjectView = {
  slug: string
  title: string
  tags: string[]
  image: string
  focus?: string
  /** Home panel column at md+; only the four Home cards need it. */
  column?: 'left' | 'right'
}

export type ServiceView = {
  slug: string
  title: string
  description: string
  keywords: Keyword[]
  image: string
  focus?: string
  /** The service page document this row links to, if any. */
  pageSlug?: string
}

export type TestimonialView = {
  quote: string
  name: string
  company: string
}

export type ClientView = {
  name: string
  /** Resolved logo URL; absent in the fallback (styled wordmarks render). */
  logo?: string
}

export type SiteView = {
  companyName: string
  email: { label: string; href: string }
  phone: { label: string; href: string }
  address: string
}

export type NavItemView = {
  label: string
  to: string
  children?: LinkView[]
}

export type NavigationView = {
  items: NavItemView[]
  cta: LinkView
}

export type FooterView = {
  statement: Inline
  links: LinkView[]
  cta: LinkView
  legal: string
}

/** The page shell: settings, menu and footer in one object. */
export type SiteContent = {
  site: SiteView
  navigation: NavigationView
  footer: FooterView
}

export type HomeView = {
  seo: { title: string; description: string }
  hero: {
    pills: [string, string]
    description: Inline
    /** Hero frames: team, terminal, showreel thumbnail. */
    media: [MediaView, MediaView, MediaView]
  }
  introStatement: { text: Inline; cta: LinkView }
  services: { heading: string }
  latestWork: {
    heading: string
    intro: Inline
    featured: { slug: string; column: 'left' | 'right' }[]
    viewAll: LinkView
  }
  stats: {
    /** Desktop ticker items; the mobile marquee uses the first two. */
    marquee: string[]
    pills: [string, string]
    frames: [MediaView, MediaView, MediaView]
    cta: { text: string; label: string; to: string }
  }
  faq: { heading: string; intro: Inline; items: { question: string; answer: Inline }[] }
  founder: { heading: string; paragraphs: Inline[]; cta: LinkView }
  servicesList: ServiceView[]
  projects: ProjectView[]
  testimonials: TestimonialView[]
  clients: ClientView[]
}

export type ServicesPageView = {
  seo: { title: string; description: string }
  hero: {
    label: string
    title: string
    pills: [string, string]
    image: MediaView
    description: Inline
  }
  introStatement: { text: Inline }
  latestWorkIntro: Inline
  services: ServiceView[]
  projects: ProjectView[]
  testimonials: TestimonialView[]
  clients: ClientView[]
  stats: HomeView['stats']
  latestWork: HomeView['latestWork']
}

export type WorkPageView = {
  seo: { title: string; description: string }
  hero: {
    label: string
    title: string
    pills: [string, string]
    image: MediaView
    description: Inline
  }
  pageSize: number
  projects: ProjectView[]
}

export type ServiceFormView = {
  heading?: string
  highlight?: string
  fields: ContactField[]
  submitLabel: string
  source: string
}

export type ServicePageData = {
  page: ServicePageView
  projects: ProjectView[]
  /** The shared Experience band comes from `_home.stats`. */
  stats: HomeView['stats']
  /** The callback panel's quote slider comes from the testimonials collection. */
  testimonials: TestimonialView[]
}

export type ServicePageView = {
  seo: { title: string; description: string }
  hero: {
    label: string
    title: string
    titleMaxWidth?: string
    tags: string[]
    intro: Inline
    form: ServiceFormView
  }
  feature: {
    heading: string
    headingMaxWidth?: string
    lead: Inline
    checklist: string[]
    body: Inline
    cta: LinkView
    image: MediaView
  }
  projects: {
    heading: string
    viewAll: LinkView
    tag: string
    slugs?: string[]
    limit: number
    regionLabel: string
  }
  pillars: {
    label?: string
    items: { title: string; body: Inline }[]
    cta: LinkView
  }
  why: {
    heading: string
    headingMaxWidth?: string
    body: Inline
    cta: LinkView
    image: MediaView
    form: ServiceFormView
  }
  faq: { heading: string; items: { question: string; answer: Inline }[] }
}
