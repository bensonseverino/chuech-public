/*
 * CMS payloads → view models, with the hard-coded content modules as fallback.
 *
 * The public API returns resolved media (`{ url, alt, focus, … }`) and inline
 * markup strings; the site's old modules return asset slots and typed
 * `RichSegment[]`. Both are normalised here so no section needs to know which
 * source is live.
 */
import { ROUTES } from '../../routes'
import { asset } from '../assets'
import {
  BRIEF_CTA,
  CLIENTS,
  EXPERIENCE_PILLS,
  FAQ,
  FAQ_ITEMS,
  FOOTER,
  FOUNDER_BLOCK,
  HERO_DESCRIPTION,
  INTRO_STATEMENT,
  LATEST_WORK,
  SERVICES,
  SERVICES_HEADING,
  TICKER_ITEMS,
  TESTIMONIALS,
  type Keyword,
  type RichSegment,
} from '../home'
import { PROJECTS, WORK_PAGE_SIZE, type Project } from '../projects'
import {
  PAGE_SERVICES,
  SERVICES_HERO,
  SERVICES_INTRO,
  SERVICES_WORK_INTRO,
} from '../services'
import { BRANDING } from '../services/branding'
import { SEO } from '../services/seo'
import { WEB_DESIGN, type ServicePageContent } from '../services/web-design'
import { fromSegments, markHighlights } from './inline-markup'
import type {
  ClientView,
  FooterView,
  HomeView,
  LinkView,
  MediaView,
  NavigationView,
  ProjectView,
  ServicePageData,
  ServicePageView,
  ServicesPageView,
  ServiceView,
  SiteContent,
  SiteView,
  TestimonialView,
  WorkPageView,
} from './types'

/* ------------------------------------------------------------------ */
/* CMS payload types (only the fields the site reads)                  */
/* ------------------------------------------------------------------ */

type CmsFocus = { x?: number; y?: number }

export type CmsMedia = {
  url?: string
  alt?: string
  focus?: CmsFocus | null
  poster?: CmsMedia | null
}

type CmsMediaPair = { video?: CmsMedia | null; poster?: CmsMedia | null }
type CmsLink = { label?: string; to?: string }

export type CmsSite = {
  companyName?: string
  email?: string
  phone?: string
  address?: string
}

type CmsNavigation = {
  items?: {
    label?: string
    to?: string
    children?: { label?: string; to?: string }[]
  }[]
  cta?: CmsLink
}

type CmsFooter = {
  statement?: string
  links?: { label?: string; to?: string }[]
  ctaLabel?: string
  ctaTo?: string
  legal?: string
}

type CmsSeo = { title?: string; description?: string }

type CmsService = {
  slug?: string
  title?: string
  description?: string
  keywords?: { label?: string; to?: string }[]
  image?: CmsMedia | null
  pageSlug?: string
}

export type CmsProject = {
  slug?: string
  title?: string
  services?: string[]
  image?: CmsMedia | null
  cardFocus?: CmsFocus
  featured?: boolean
}

type CmsTestimonial = { quote?: string; author?: string; company?: string }
type CmsClient = { name?: string; logo?: CmsMedia | null }

type CmsHome = {
  seo?: CmsSeo
  hero?: {
    pills?: string[]
    media?: CmsMediaPair[]
    description?: string
  }
  introStatement?: { text?: string; cta?: CmsLink }
  services?: { heading?: string }
  latestWork?: {
    heading?: string
    intro?: string
    featuredProjects?: { slug?: string; column?: string }[]
    viewAll?: CmsLink
  }
  stats?: {
    marquee?: string[]
    pills?: string[]
    frames?: CmsMediaPair[]
    ctaText?: string
    ctaLabel?: string
    ctaTo?: string
  }
  faq?: {
    heading?: string
    intro?: string
    items?: { q?: string; a?: string }[]
  }
  founder?: {
    heading?: string
    paragraphs?: string[]
    cta?: CmsLink
  }
}

type CmsServicesIndex = {
  seo?: CmsSeo
  hero?: {
    label?: string
    title?: string
    pills?: string[]
    image?: CmsMedia | null
    description?: string
  }
  introStatement?: { text?: string }
  latestWorkIntro?: string
}

type CmsWorkIndex = {
  seo?: CmsSeo
  hero?: {
    label?: string
    title?: string
    pills?: string[]
    image?: CmsMedia | null
    description?: string
  }
  pageSize?: number
}

export type ServicePagePayload = {
  seo?: CmsSeo
  hero?: {
    badge?: string
    title?: string
    chips?: string[]
    intro?: string
    formHeading?: string
    formHighlight?: string
    submitLabel?: string
  }
  feature?: {
    heading?: string
    lead?: string
    checklist?: string[]
    body?: string
    ctaLabel?: string
    ctaTo?: string
    image?: CmsMedia | null
  }
  projects?: { heading?: string; tag?: string; slugs?: string[]; limit?: number }
  pillars?: {
    items?: { title?: string; body?: string }[]
    ctaLabel?: string
    ctaTo?: string
  }
  why?: {
    heading?: string
    body?: string
    ctaLabel?: string
    ctaTo?: string
    image?: CmsMedia | null
    callbackSubmitLabel?: string
  }
  faq?: { items?: { q?: string; a?: string }[] }
}

export type SitePayload = {
  settings?: CmsSite | null
  navigation?: CmsNavigation | null
  footer?: CmsFooter | null
}

export type HomePayload = {
  home?: CmsHome | null
  services?: CmsService[]
  projects?: CmsProject[]
  testimonials?: CmsTestimonial[]
  clients?: CmsClient[]
}

export type ServicesPayload = {
  index?: CmsServicesIndex | null
  services?: CmsService[]
  projects?: CmsProject[]
  clients?: CmsClient[]
  testimonials?: CmsTestimonial[]
  home?: CmsHome | null
}

export type WorkPayload = {
  index?: CmsWorkIndex | null
  projects?: CmsProject[]
}

/* ------------------------------------------------------------------ */
/* Small conversion helpers                                            */
/* ------------------------------------------------------------------ */

function focusOf(focus?: CmsFocus | null): string | undefined {
  if (!focus || typeof focus.x !== 'number' || typeof focus.y !== 'number') return undefined
  return `${Math.round(focus.x * 100)}% ${Math.round(focus.y * 100)}%`
}

function mediaView(
  media: CmsMedia | null | undefined,
  fallbackSrc: string,
  fallbackAlt: string,
): MediaView {
  return {
    src: media?.url || fallbackSrc,
    alt: media?.alt ?? fallbackAlt,
    focus: focusOf(media?.focus),
  }
}

/** A `{ video, poster }` pair renders as its poster frame (the site's images). */
function pairView(
  pair: CmsMediaPair | null | undefined,
  fallbackSrc: string,
  fallbackAlt: string,
): MediaView {
  return mediaView(pair?.poster, fallbackSrc, fallbackAlt)
}

function linkView(link: CmsLink | undefined, fallback: LinkView): LinkView {
  return {
    label: link?.label || fallback.label,
    to: link?.to || fallback.to,
  }
}

function pillPair(value: string[] | undefined, fallback: [string, string]): [string, string] {
  return value && typeof value[0] === 'string' && typeof value[1] === 'string'
    ? [value[0], value[1]]
    : fallback
}

function triple<In, Out>(
  value: In[] | undefined,
  build: (index: number, item: In | undefined) => Out,
): [Out, Out, Out] {
  return [build(0, value?.[0]), build(1, value?.[1]), build(2, value?.[2])]
}

/** The site's local content still uses `href` for links. */
function toLink(link: { label: string; href: string }): LinkView {
  return { label: link.label, to: link.href }
}

/* ------------------------------------------------------------------ */
/* Site shell                                                          */
/* ------------------------------------------------------------------ */

export const SITE_FALLBACK: SiteContent = {
  site: {
    companyName: 'Chuech Studio',
    email: { label: FOOTER.email.label, href: FOOTER.email.href },
    phone: { label: FOOTER.phone.label, href: FOOTER.phone.href },
    address: FOOTER.address,
  },
  navigation: {
    items: [
      {
        label: 'Services',
        to: ROUTES.services,
        children: SERVICES.map((service) => ({ label: service.title, to: `/${service.slug}` })),
      },
      { label: 'Work', to: ROUTES.work },
      {
        label: 'About',
        to: ROUTES.aboutUs,
        children: [
          { label: 'About Us', to: ROUTES.aboutUs },
          { label: 'Culture', to: ROUTES.culture },
          { label: 'Testimonials', to: ROUTES.testimonials },
        ],
      },
      { label: 'Blog', to: ROUTES.blog },
    ],
    cta: { label: 'Contact', to: ROUTES.contact },
  },
  footer: {
    statement: fromSegments(FOOTER.statement),
    links: FOOTER.links.map((link) => ({ label: link.label, to: link.href })),
    cta: { label: FOOTER.getInTouch, to: FOOTER.contact.href },
    legal: FOOTER.legal,
  },
}

export function siteFromCms(payload: SitePayload): SiteContent {
  const settings = payload.settings
  const email = settings?.email || SITE_FALLBACK.site.email.label
  const phone = settings?.phone || SITE_FALLBACK.site.phone.label

  const site: SiteView = {
    companyName: settings?.companyName || SITE_FALLBACK.site.companyName,
    email: { label: email, href: `mailto:${email}` },
    phone: { label: phone, href: `tel:${phone.replace(/[^\d+]/g, '')}` },
    address: settings?.address || SITE_FALLBACK.site.address,
  }

  const nav = payload.navigation
  const items = nav?.items
    ?.filter((item) => item.label && item.to)
    .map((item) => ({
      label: item.label as string,
      to: item.to as string,
      ...(item.children?.length
        ? {
            children: item.children
              .filter((child) => child.label && child.to)
              .map((child) => ({ label: child.label as string, to: child.to as string })),
          }
        : {}),
    }))

  const navigation: NavigationView =
    items && items.length > 0
      ? { items, cta: linkView(nav?.cta, SITE_FALLBACK.navigation.cta) }
      : SITE_FALLBACK.navigation

  const footerDoc = payload.footer
  const footer: FooterView = {
    statement: footerDoc?.statement || SITE_FALLBACK.footer.statement,
    links: footerDoc?.links?.length
      ? footerDoc.links
          .filter((link) => link.label && link.to)
          .map((link) => ({ label: link.label as string, to: link.to as string }))
      : SITE_FALLBACK.footer.links,
    cta: {
      label: footerDoc?.ctaLabel || SITE_FALLBACK.footer.cta.label,
      to: footerDoc?.ctaTo || SITE_FALLBACK.footer.cta.to,
    },
    legal: footerDoc?.legal || SITE_FALLBACK.footer.legal,
  }

  return { site, navigation, footer }
}

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

const LOCAL_SERVICE_IMAGE: Record<string, string> = Object.fromEntries(
  SERVICES.map((service) => [service.slug, service.image]),
)

const LOCAL_PAGE_SLUG: Record<string, string> = {
  branding: 'branding',
  'web-design': 'web-design',
  'seo-manchester': 'seo-manchester',
}

function localService(service: (typeof SERVICES)[number]): ServiceView {
  return {
    slug: service.slug,
    title: service.title,
    description: service.description,
    keywords: [...service.keywords],
    image: asset(service.image),
    focus: service.focus,
    pageSlug: LOCAL_PAGE_SLUG[service.slug],
  }
}

function serviceView(service: CmsService): ServiceView | null {
  if (!service.slug || !service.title) return null

  const keywords: Keyword[] = []
  for (const keyword of service.keywords ?? []) {
    if (!keyword.label) continue
    keywords.push(keyword.to ? { label: keyword.label, href: keyword.to } : keyword.label)
  }

  const imageSlot = LOCAL_SERVICE_IMAGE[service.slug]

  return {
    slug: service.slug,
    title: service.title,
    description: service.description ?? '',
    keywords,
    image: service.image?.url ?? (imageSlot ? asset(imageSlot) : asset('work-ph')),
    focus: focusOf(service.image?.focus),
    pageSlug: service.pageSlug || LOCAL_PAGE_SLUG[service.slug],
  }
}

function localProject(project: Project): ProjectView {
  return {
    slug: project.slug,
    title: project.title,
    tags: [...project.tags],
    image: asset(project.image),
    focus: project.focus,
    column: project.column,
  }
}

function projectView(project: CmsProject): ProjectView | null {
  if (!project.slug || !project.title) return null
  return {
    slug: project.slug,
    title: project.title,
    tags: project.services ?? [],
    image: project.image?.url ?? asset('work-ph'),
    focus: focusOf(project.cardFocus) ?? focusOf(project.image?.focus),
  }
}

const LOCAL_PROJECTS: ProjectView[] = PROJECTS.map(localProject)

function projectViews(projects: CmsProject[] | undefined): ProjectView[] {
  if (!projects || projects.length === 0) return LOCAL_PROJECTS
  return projects.map(projectView).filter((project): project is ProjectView => project !== null)
}

function localTestimonials(): TestimonialView[] {
  return TESTIMONIALS.map((testimonial) => ({
    quote: testimonial.quote,
    name: testimonial.name,
    company: testimonial.company,
  }))
}

function testimonialViews(testimonials: CmsTestimonial[] | undefined): TestimonialView[] {
  if (!testimonials || testimonials.length === 0) return localTestimonials()
  return testimonials
    .filter((testimonial) => testimonial.quote && testimonial.author)
    .map((testimonial) => ({
      quote: testimonial.quote as string,
      name: testimonial.author as string,
      company: testimonial.company ?? '',
    }))
}

function localClients(): ClientView[] {
  return CLIENTS.map((name) => ({ name }))
}

function clientViews(clients: CmsClient[] | undefined): ClientView[] {
  if (!clients || clients.length === 0) return localClients()
  return clients
    .filter((client) => client.name)
    .map((client) => ({ name: client.name as string, logo: client.logo?.url }))
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

const HOME_FEATURED = LOCAL_PROJECTS.filter((project) => project.column).map((project) => ({
  slug: project.slug,
  column: project.column as 'left' | 'right',
}))

const HOME_STATS_FALLBACK: HomeView['stats'] = {
  marquee: [...TICKER_ITEMS],
  pills: [EXPERIENCE_PILLS[0], EXPERIENCE_PILLS[1]],
  frames: [
    mediaView(null, asset('stats-1'), ''),
    mediaView(null, asset('stats-2'), ''),
    mediaView(null, asset('stats-3'), ''),
  ],
  cta: { text: BRIEF_CTA.text, label: BRIEF_CTA.button.label, to: BRIEF_CTA.button.href },
}

function mapStats(stats: CmsHome['stats'] | undefined): HomeView['stats'] {
  if (!stats) return HOME_STATS_FALLBACK
  return {
    marquee: stats.marquee?.length ? stats.marquee : HOME_STATS_FALLBACK.marquee,
    pills: pillPair(stats.pills, HOME_STATS_FALLBACK.pills),
    frames: triple(stats.frames, (index, pair) => {
      const fallback = HOME_STATS_FALLBACK.frames[index]
      return pairView(pair, fallback.src, fallback.alt)
    }),
    cta: {
      text: stats.ctaText ?? HOME_STATS_FALLBACK.cta.text,
      label: stats.ctaLabel ?? HOME_STATS_FALLBACK.cta.label,
      to: stats.ctaTo ?? HOME_STATS_FALLBACK.cta.to,
    },
  }
}

export const HOME_FALLBACK: HomeView = {
  seo: {
    title: 'Chuech Studio | Web Design Agency Nairobi',
    description:
      'Chuech Studio is a Nairobi web design agency creating purposeful websites that make brands clearer, stronger, and easier to choose.',
  },
  hero: {
    pills: ['Digital experiences', 'Thoughtfully made'],
    description: HERO_DESCRIPTION,
    media: [
      { src: asset('hero-team'), alt: 'The Chuech Studio team' },
      { src: asset('hero-terminal'), alt: 'A terminal window from a Chuech Studio build' },
      { src: asset('contact-thumb'), alt: 'Chuech Studio showreel thumbnail' },
    ],
  },
  introStatement: {
    text: markHighlights(INTRO_STATEMENT.text, INTRO_STATEMENT.highlights),
    cta: { label: INTRO_STATEMENT.cta.label, to: INTRO_STATEMENT.cta.href },
  },
  services: { heading: SERVICES_HEADING },
  latestWork: {
    heading: LATEST_WORK.heading,
    intro: LATEST_WORK.intro,
    featured: HOME_FEATURED,
    viewAll: { label: LATEST_WORK.viewAll.label, to: LATEST_WORK.viewAll.href },
  },
  stats: HOME_STATS_FALLBACK,
  faq: {
    heading: FAQ.heading,
    intro: FAQ.intro,
    items: FAQ_ITEMS.map((item) => ({
      question: item.question,
      answer: fromSegments(item.answer),
    })),
  },
  founder: {
    heading: FOUNDER_BLOCK.heading,
    paragraphs: FOUNDER_BLOCK.paragraphs.map((paragraph) => fromSegments(paragraph as RichSegment[])),
    cta: { label: FOUNDER_BLOCK.cta.label, to: FOUNDER_BLOCK.cta.href },
  },
  servicesList: SERVICES.map(localService),
  projects: LOCAL_PROJECTS,
  testimonials: localTestimonials(),
  clients: localClients(),
}

export function homeFromCms(payload: HomePayload): HomeView {
  const home = payload.home
  if (!home) {
    return {
      ...HOME_FALLBACK,
      servicesList: payload.services?.length
        ? (payload.services.map(serviceView).filter(Boolean) as ServiceView[])
        : HOME_FALLBACK.servicesList,
      projects: projectViews(payload.projects),
      testimonials: testimonialViews(payload.testimonials),
      clients: clientViews(payload.clients),
    }
  }

  const featured =
    home.latestWork?.featuredProjects
      ?.filter(
        (entry): entry is { slug: string; column: 'left' | 'right' } =>
          typeof entry.slug === 'string' &&
          (entry.column === 'left' || entry.column === 'right'),
      )
      .map((entry) => ({ slug: entry.slug, column: entry.column })) ?? HOME_FALLBACK.latestWork.featured

  const columnBySlug = new Map(featured.map((entry) => [entry.slug, entry.column]))
  const projects = projectViews(payload.projects).map((project) => ({
    ...project,
    column: columnBySlug.get(project.slug),
  }))

  return {
    seo: {
      title: home.seo?.title || HOME_FALLBACK.seo.title,
      description: home.seo?.description || HOME_FALLBACK.seo.description,
    },
    hero: {
      pills: pillPair(home.hero?.pills, HOME_FALLBACK.hero.pills),
      description: home.hero?.description || HOME_FALLBACK.hero.description,
      media: triple(home.hero?.media, (index, pair) => {
        const fallback = HOME_FALLBACK.hero.media[index]
        return pairView(pair, fallback.src, fallback.alt)
      }),
    },
    introStatement: {
      text: home.introStatement?.text || HOME_FALLBACK.introStatement.text,
      cta: linkView(home.introStatement?.cta, HOME_FALLBACK.introStatement.cta),
    },
    services: {
      heading: home.services?.heading || HOME_FALLBACK.services.heading,
    },
    latestWork: {
      heading: home.latestWork?.heading || HOME_FALLBACK.latestWork.heading,
      intro: home.latestWork?.intro || HOME_FALLBACK.latestWork.intro,
      featured,
      viewAll: linkView(home.latestWork?.viewAll, HOME_FALLBACK.latestWork.viewAll),
    },
    stats: mapStats(home.stats),
    faq: home.faq
      ? {
          heading: home.faq.heading || HOME_FALLBACK.faq.heading,
          intro: home.faq.intro ?? HOME_FALLBACK.faq.intro,
          items: (home.faq.items ?? [])
            .filter((item) => item.q && item.a)
            .map((item) => ({ question: item.q as string, answer: item.a as string })),
        }
      : HOME_FALLBACK.faq,
    founder: home.founder
      ? {
          heading: home.founder.heading || HOME_FALLBACK.founder.heading,
          paragraphs: home.founder.paragraphs ?? [],
          cta: linkView(home.founder.cta, HOME_FALLBACK.founder.cta),
        }
      : HOME_FALLBACK.founder,
    servicesList: payload.services?.length
      ? (payload.services.map(serviceView).filter(Boolean) as ServiceView[])
      : HOME_FALLBACK.servicesList,
    projects,
    testimonials: testimonialViews(payload.testimonials),
    clients: clientViews(payload.clients),
  }
}

/* ------------------------------------------------------------------ */
/* Services index                                                      */
/* ------------------------------------------------------------------ */

export const SERVICES_FALLBACK: ServicesPageView = {
  seo: {
    title: 'Services | Chuech Studio',
    description:
      'Explore branding, web design, SEO, PPC, and video services from Chuech Studio, a Nairobi-based digital partner.',
  },
  hero: {
    label: SERVICES_HERO.label,
    title: SERVICES_HERO.title,
    pills: [SERVICES_HERO.pills[0], SERVICES_HERO.pills[1]],
    image: { src: asset(SERVICES_HERO.image), alt: 'The Chuech Studio team' },
    description: HERO_DESCRIPTION,
  },
  introStatement: {
    text: markHighlights(SERVICES_INTRO.text, SERVICES_INTRO.highlights),
  },
  latestWorkIntro: SERVICES_WORK_INTRO,
  services: PAGE_SERVICES.map(localService),
  projects: LOCAL_PROJECTS,
  testimonials: localTestimonials(),
  clients: localClients(),
  stats: HOME_STATS_FALLBACK,
  latestWork: HOME_FALLBACK.latestWork,
}

export function servicesFromCms(payload: ServicesPayload): ServicesPageView {
  const index = payload.index
  const services = payload.services?.length
    ? (payload.services.map(serviceView).filter(Boolean) as ServiceView[])
    : SERVICES_FALLBACK.services

  const allProjects = projectViews(payload.projects)
  // The services index reuses the four Home cards. Project entries do not store
  // the Home panel column, so the featured order gives it: the first two sit in
  // the right column, the next two in the left (matching the seeded layout).
  let featuredIndex = 0
  const projects = allProjects.map((project) => {
    if (!(payload.projects ?? []).find((entry) => entry.slug === project.slug)?.featured) {
      return project
    }
    const column: 'left' | 'right' = featuredIndex < 2 ? 'right' : 'left'
    featuredIndex += 1
    return { ...project, column }
  })

  const latestWork = payload.home
    ? homeFromCms({ home: payload.home }).latestWork
    : {
        ...HOME_FALLBACK.latestWork,
        featured: projects
          .filter((project) => project.column)
          .map((project) => ({ slug: project.slug, column: project.column as 'left' | 'right' })),
      }

  if (!index) {
    return {
      ...SERVICES_FALLBACK,
      services,
      projects,
      testimonials: testimonialViews(payload.testimonials),
      clients: clientViews(payload.clients),
      stats: mapStats(payload.home?.stats),
      latestWork,
    }
  }

  return {
    seo: {
      title: index.seo?.title || SERVICES_FALLBACK.seo.title,
      description: index.seo?.description || SERVICES_FALLBACK.seo.description,
    },
    hero: {
      label: index.hero?.label || SERVICES_FALLBACK.hero.label,
      title: index.hero?.title || SERVICES_FALLBACK.hero.title,
      pills: pillPair(index.hero?.pills, SERVICES_FALLBACK.hero.pills),
      image: mediaView(
        index.hero?.image,
        SERVICES_FALLBACK.hero.image.src,
        SERVICES_FALLBACK.hero.image.alt,
      ),
      description: index.hero?.description || SERVICES_FALLBACK.hero.description,
    },
    introStatement: {
      text: index.introStatement?.text || SERVICES_FALLBACK.introStatement.text,
    },
    latestWorkIntro: index.latestWorkIntro || SERVICES_FALLBACK.latestWorkIntro,
    services,
    projects,
    testimonials: testimonialViews(payload.testimonials),
    clients: clientViews(payload.clients),
    stats: mapStats(payload.home?.stats),
    latestWork,
  }
}

/* ------------------------------------------------------------------ */
/* Work index                                                          */
/* ------------------------------------------------------------------ */

export const WORK_FALLBACK: WorkPageView = {
  seo: {
    title: 'Work | Chuech Studio',
    description:
      'Selected branding, web design, SEO, PPC, and video projects from Chuech Studio in Nairobi, Kenya.',
  },
  hero: {
    label: 'Work',
    title: 'Latest Work',
    pills: ['Full-service agency', 'Trusted by ambitious brands'],
    image: { src: asset('work-hero'), alt: 'The Chuech Studio team at work' },
    description: HERO_DESCRIPTION,
  },
  pageSize: WORK_PAGE_SIZE,
  projects: LOCAL_PROJECTS,
}

export function workFromCms(payload: WorkPayload): WorkPageView {
  const index = payload.index
  const projects = projectViews(payload.projects)

  if (!index) {
    return { ...WORK_FALLBACK, projects }
  }

  return {
    seo: {
      title: index.seo?.title || WORK_FALLBACK.seo.title,
      description: index.seo?.description || WORK_FALLBACK.seo.description,
    },
    hero: {
      label: index.hero?.label || WORK_FALLBACK.hero.label,
      title: index.hero?.title || WORK_FALLBACK.hero.title,
      pills: pillPair(index.hero?.pills, WORK_FALLBACK.hero.pills),
      image: mediaView(
        index.hero?.image,
        WORK_FALLBACK.hero.image.src,
        WORK_FALLBACK.hero.image.alt,
      ),
      description: index.hero?.description || WORK_FALLBACK.hero.description,
    },
    pageSize:
      typeof index.pageSize === 'number' && index.pageSize > 0
        ? index.pageSize
        : WORK_FALLBACK.pageSize,
    projects,
  }
}

/* ------------------------------------------------------------------ */
/* Service pages                                                       */
/* ------------------------------------------------------------------ */

function servicePageFromLocal(content: ServicePageContent): ServicePageView {
  return {
    seo: content.seo,
    hero: {
      label: content.hero.label,
      title: content.hero.title,
      titleMaxWidth: content.hero.titleMaxWidth,
      tags: [...content.hero.tags],
      intro: content.hero.intro,
      form: content.hero.form,
    },
    feature: {
      heading: content.feature.heading,
      headingMaxWidth: content.feature.headingMaxWidth,
      lead: content.feature.lead,
      checklist: [...content.feature.checklist],
      body: content.feature.body,
      cta: toLink(content.feature.cta),
      image: { src: asset(content.feature.image), alt: content.feature.imageAlt },
    },
    projects: {
      heading: content.projects.heading,
      viewAll: toLink(content.projects.viewAll),
      tag: content.projects.tag,
      ...(content.projects.slugs ? { slugs: [...content.projects.slugs] } : {}),
      limit: content.projects.limit,
      regionLabel: content.projects.regionLabel,
    },
    pillars: {
      label: content.pillars.label,
      items: content.pillars.items.map((item) => ({ title: item.title, body: item.body })),
      cta: toLink(content.pillars.cta),
    },
    why: {
      heading: content.why.heading,
      headingMaxWidth: content.why.headingMaxWidth,
      body: content.why.body,
      cta: toLink(content.why.cta),
      image: { src: asset(content.why.image), alt: content.why.imageAlt },
      form: content.why.form,
    },
    faq: {
      heading: content.faq.heading,
      items: content.faq.items.map((item) => ({
        question: item.question,
        answer: fromSegments(item.answer),
      })),
    },
  }
}

export const SERVICE_FALLBACKS: Record<string, ServicePageView> = {
  'web-design': servicePageFromLocal(WEB_DESIGN),
  branding: servicePageFromLocal(BRANDING),
  'seo-manchester': servicePageFromLocal(SEO),
}

/**
 * `/api/public/pages/:slug` + the projects collection → the page view. When the
 * page fetch failed (`data === null`) the whole local fallback is used; when it
 * succeeded, empty collections stay empty so an editor's removal is respected.
 */
export function servicePageFromCms(
  data: ServicePagePayload | null,
  projectPayload: CmsProject[] | undefined,
  fallback: ServicePageView,
): Pick<ServicePageData, 'page' | 'projects'> {
  const projects = projectViews(projectPayload)
  if (!data) return { page: fallback, projects }

  const live = data
  const cta = (label: string | undefined, to: string | undefined, fb: LinkView): LinkView => ({
    label: label || fb.label,
    to: to || fb.to,
  })

  return {
    projects,
    page: {
      seo: {
        title: live.seo?.title || fallback.seo.title,
        description: live.seo?.description || fallback.seo.description,
      },
      hero: {
        label: live.hero?.badge || fallback.hero.label,
        title: live.hero?.title || fallback.hero.title,
        titleMaxWidth: fallback.hero.titleMaxWidth,
        tags: live.hero?.chips?.length ? live.hero.chips : fallback.hero.tags,
        intro: live.hero?.intro || fallback.hero.intro,
        form: {
          ...fallback.hero.form,
          heading: live.hero?.formHeading ?? fallback.hero.form.heading,
          highlight: live.hero?.formHighlight ?? fallback.hero.form.highlight,
          submitLabel: live.hero?.submitLabel || fallback.hero.form.submitLabel,
        },
      },
      feature: {
        heading: live.feature?.heading || fallback.feature.heading,
        headingMaxWidth: fallback.feature.headingMaxWidth,
        lead: live.feature?.lead || fallback.feature.lead,
        checklist: live.feature?.checklist?.length
          ? live.feature.checklist
          : fallback.feature.checklist,
        body: live.feature?.body || fallback.feature.body,
        cta: cta(live.feature?.ctaLabel, live.feature?.ctaTo, fallback.feature.cta),
        image: mediaView(
          live.feature?.image,
          fallback.feature.image.src,
          fallback.feature.image.alt,
        ),
      },
      projects: {
        heading: live.projects?.heading || fallback.projects.heading,
        viewAll: fallback.projects.viewAll,
        tag: live.projects?.tag || fallback.projects.tag,
        slugs: live.projects?.slugs?.length ? live.projects.slugs : undefined,
        limit:
          typeof live.projects?.limit === 'number' && live.projects.limit > 0
            ? live.projects.limit
            : fallback.projects.limit,
        regionLabel: fallback.projects.regionLabel,
      },
      pillars: live.pillars
        ? {
            label: fallback.pillars.label,
            items: (live.pillars.items ?? [])
              .filter((item) => item.title && item.body)
              .map((item) => ({ title: item.title as string, body: item.body as string })),
            cta: cta(live.pillars.ctaLabel, live.pillars.ctaTo, fallback.pillars.cta),
          }
        : fallback.pillars,
      why: {
        heading: live.why?.heading || fallback.why.heading,
        headingMaxWidth: fallback.why.headingMaxWidth,
        body: live.why?.body || fallback.why.body,
        cta: cta(live.why?.ctaLabel, live.why?.ctaTo, fallback.why.cta),
        image: mediaView(live.why?.image, fallback.why.image.src, fallback.why.image.alt),
        form: {
          ...fallback.why.form,
          submitLabel: live.why?.callbackSubmitLabel || fallback.why.form.submitLabel,
        },
      },
      faq: live.faq
        ? {
            heading: fallback.faq.heading,
            items: (live.faq.items ?? [])
              .filter((item) => item.q && item.a)
              .map((item) => ({ question: item.q as string, answer: item.a as string })),
          }
        : fallback.faq,
    },
  }
}
