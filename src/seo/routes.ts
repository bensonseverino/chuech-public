/*
 * One route table for SEO metadata, the sitemap, prerendering and llms.txt
 * (SEO spec Step 1). Derived from src/routes.ts and src/App.tsx: only paths
 * the router actually renders belong here. `/ai-seo` and `/seo-consultant`
 * are declared in routes.ts but have no router entry (they 404), so they
 * are deliberately absent.
 *
 * Copy here is original Chuech studio copy, short sentences, no hype.
 */
export type SeoRouteType = 'page' | 'service' | 'project' | 'legal'
export type ChangeFreq = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface SeoRoute {
  path: string
  title: string
  description: string
  priority: number
  changefreq: ChangeFreq
  lastmod: string
  type: SeoRouteType
  /** Path template expanded from CMS data (sitemap/prerender must skip the
   *  literal ':slug' entry and use real project URLs instead). */
  template?: true
}

/* Mirrors company.lastUpdated in src/data/terms.ts (5/01/2026, dd/mm/yyyy).
   TODO(owner): replace with real per-page edit dates when the CMS exposes
   them; do not use the build date as a lastmod value. */
const LAST_MOD = '2026-01-05'

export const SEO_ROUTES: SeoRoute[] = [
  {
    path: '/',
    title: 'Web Design Agency in Kenya | Chuech studio',
    description:
      'Chuech studio builds websites and runs SEO, social media and PPC for businesses in Kenya and beyond. See our recent work, meet the team and get in touch.',
    priority: 1,
    changefreq: 'weekly',
    lastmod: LAST_MOD,
    type: 'page',
  },
  {
    path: '/services',
    title: 'Web Design, SEO and Marketing Services | Chuech studio',
    description:
      'Web design, branding, SEO and PPC from one Nairobi studio. Clear process, honest reporting and work you can measure. See how we can help.',
    priority: 0.9,
    changefreq: 'monthly',
    lastmod: LAST_MOD,
    type: 'page',
  },
  {
    path: '/work',
    title: 'Web Design and Branding Case Studies | Chuech studio',
    description:
      'Browse projects by Chuech studio: websites, branding and search work for real clients. Read what we did, how we worked and what changed.',
    priority: 0.7,
    changefreq: 'weekly',
    lastmod: LAST_MOD,
    type: 'page',
  },
  {
    /* TODO(owner): project titles, descriptions and lastmod should come from
       the CMS at build time (Step 2); this is only the URL pattern. */
    path: '/work/:slug',
    title: 'Case Study | Chuech studio',
    description: 'A project by Chuech studio.',
    priority: 0.6,
    changefreq: 'monthly',
    lastmod: LAST_MOD,
    type: 'project',
    template: true,
  },
  {
    path: '/branding',
    title: 'Brand Identity and Graphic Design Kenya | Chuech studio',
    description:
      'Brand strategy, identity and graphic design from Chuech studio in Kenya. We make clear, usable brand systems for businesses that want to be recognised.',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: LAST_MOD,
    type: 'service',
  },
  {
    path: '/web-design',
    title: 'Website Design Kenya | Chuech studio',
    description:
      'Website design and development from Chuech studio in Kenya. We build clear, fast sites that are easy to use and built to turn visitors into enquiries.',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: LAST_MOD,
    type: 'service',
  },
  {
    /* The /seo-manchester slug is a legacy URL. The studio is in Nairobi and
       makes no Manchester claim, so the metadata intentionally says Kenya.
       TODO(owner): consider a /seo route with a 301 from the old slug. */
    path: '/seo-manchester',
    title: 'SEO Services Kenya | Chuech studio',
    description:
      'SEO services from Chuech studio in Kenya. We improve how your site is found in search and in AI answers, with clear reporting and practical fixes.',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: LAST_MOD,
    type: 'service',
  },
  {
    path: '/ppc',
    title: 'Google Ads and PPC Management Kenya | Chuech studio',
    description:
      'PPC management from Chuech studio in Kenya. We set up and run Google Ads campaigns, track spend carefully and explain results in plain language.',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: LAST_MOD,
    type: 'service',
  },
  {
    path: '/about',
    title: 'About Chuech studio | Web Design and Marketing Team',
    description:
      'Meet the team behind Chuech studio. See how we work with clients in Kenya and beyond, from the first conversation to launch and after.',
    priority: 0.6,
    changefreq: 'monthly',
    lastmod: LAST_MOD,
    type: 'page',
  },
  {
    path: '/contact',
    title: 'Contact Chuech studio | Start a Project',
    description:
      'Email hello@chuechstudio.co.ke or call +254117954929 to talk about your project. Chuech studio replies to new enquiries within one working day.',
    priority: 0.5,
    changefreq: 'monthly',
    lastmod: LAST_MOD,
    type: 'page',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Chuech studio',
    description:
      'How Chuech studio collects, uses and protects personal data, and the choices you have. Read our privacy policy.',
    priority: 0.2,
    changefreq: 'yearly',
    lastmod: LAST_MOD,
    type: 'legal',
  },
  {
    path: '/terms-conditions',
    title: 'Terms and Conditions | Chuech studio',
    description:
      'The terms that apply when you use chuechstudio.co.ke or work with Chuech studio. Read our terms and conditions.',
    priority: 0.2,
    changefreq: 'yearly',
    lastmod: LAST_MOD,
    type: 'legal',
  },
]

/** Look up a route's SEO metadata by path (used by the <Seo /> component in
 *  Step 3). Returns undefined for 404 and unknown paths, which stay noindex. */
export function getSeoRoute(path: string): SeoRoute | undefined {
  return SEO_ROUTES.find((route) => route.path === path && !route.template)
}
