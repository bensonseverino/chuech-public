/*
 * Structured data builders (SEO spec Step 4). Every node describes content
 * that is actually visible on the page. Nodes intentionally omit @context:
 * <JsonLd /> adds it, and wraps arrays in a single @graph.
 */
import { SITE } from './site'
import { getSeoRoute } from './routes'

export const ORG_ID = `${SITE.url}/#organization`

type JsonNode = Record<string, unknown>

export function organization(): JsonNode {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: SITE.logo,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.addressCountry,
    },
    sameAs: SITE.sameAs,
    areaServed: { '@type': 'Place', name: SITE.address.addressLocality },
  }
}

export function webSite(): JsonNode {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  }
}

export function service(path: string): JsonNode | null {
  const route = getSeoRoute(path)
  if (!route || route.type !== 'service') return null
  const name = route.title.split(' | ')[0]
  return {
    '@type': 'Service',
    name,
    description: route.description,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Place', name: SITE.address.addressLocality },
    serviceType: name,
  }
}

const LABELS: Record<string, string> = {
  services: 'Services',
  work: 'Work',
  branding: 'Branding',
  'web-design': 'Web Design',
  'seo-manchester': 'SEO',
  ppc: 'PPC',
  about: 'About',
  contact: 'Contact',
  'privacy-policy': 'Privacy Policy',
  'terms-conditions': 'Terms & Conditions',
}

/** BreadcrumbList matching the visible URL path. `leafName` overrides the
 *  final segment label (used for CMS project titles). Home has no crumbs. */
export function breadcrumbs(path: string, leafName?: string): JsonNode | null {
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const itemListElement = segments.map((segment, index) => {
    const last = index === segments.length - 1
    return {
      '@type': 'ListItem',
      position: index + 2, // position 1 is Home
      name: last && leafName ? leafName : (LABELS[segment] ?? segment.replace(/-/g, ' ')),
      item: `${SITE.url}/${segments.slice(0, index + 1).join('/')}`,
    }
  })

  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      ...itemListElement,
    ],
  }
}

export function article({
  title,
  description,
  image,
  publishedAt,
  author,
}: {
  title: string
  description: string
  image?: string
  publishedAt?: string
  author?: string
}): JsonNode {
  const published = publishedAt && new Date(publishedAt).getUTCFullYear() > 1971 ? publishedAt : null
  return {
    '@type': 'Article',
    headline: title,
    description,
    ...(image ? { image } : {}),
    ...(published ? { datePublished: published } : {}),
    // TODO(owner): link to a real Person + bio page once posts have named authors.
    author: author
      ? { '@type': 'Organization', '@id': ORG_ID, name: author }
      : { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/insights` },
  }
}

type CaseStudyInput = {
  path: string
  title: string
  description: string
  image?: string
  publishedAt?: string
  categories?: string[]
}

export function caseStudy({
  path,
  title,
  description,
  image,
  publishedAt,
  categories = [],
}: CaseStudyInput): JsonNode[] {
  const published = publishedAt && new Date(publishedAt).getUTCFullYear() > 1971 ? publishedAt : null
  return [
    {
      '@type': 'CreativeWork',
      name: title,
      description,
      ...(image ? { image } : {}),
      url: `${SITE.url}${path}`,
      author: { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      ...(published ? { datePublished: published } : {}),
      ...(categories.length
        ? { about: categories.map((name) => ({ '@type': 'Thing', name })) }
        : {}),
    },
    ...((breadcrumbs(path, title) ? [breadcrumbs(path, title) as JsonNode] : [])),
  ]
}
