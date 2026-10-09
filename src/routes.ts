/*
 * Canonical route table (services spec §3.2). One source of truth for every
 * internal path so links, the router and the nav active state never drift.
 *
 * Only `/` and `/services` exist in this task; every other path intentionally
 * falls through to `NotFoundPage` (no placeholder pages are built).
 */
export const ROUTES = {
  home: '/',
  services: '/services',
  work: '/work',
  aboutUs: '/about',
  culture: '/culture',
  blog: '/blog',
  testimonials: '/testimonials',
  contact: '/contact',
  privacyPolicy: '/privacy-policy',
  termsConditions: '/terms-and-conditions',
  branding: '/branding',
  webDesign: '/web-design',
  seo: '/seo-manchester',
  aiSeo: '/ai-seo',
  ppc: '/ppc-manchester',
  video: '/video-production',
  /* Not built; kept so existing content links resolve. */
  seoConsultant: '/seo-consultant',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
