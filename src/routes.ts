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
  contact: '/contact',
  privacyPolicy: '/privacy-policy',
  termsConditions: '/terms-conditions',
  branding: '/branding',
  webDesign: '/web-design',
  seo: '/seo-manchester',
  aiSeo: '/ai-seo',
  /* PPC (ppc spec §1): flat slug like /web-design and /branding. The old
     /ppc-manchester reference slug was never built and claims a location the
     studio does not make, so the page owns /ppc. */
  ppc: '/ppc',
  /* Not built; kept so existing content links resolve. */
  seoConsultant: '/seo-consultant',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
