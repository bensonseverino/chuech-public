/*
 * Central SEO/GEO facts — single source of truth for head tags, structured
 * data, crawl files and prerendering (SEO spec Step 1).
 *
 * Business facts come from the existing site: src/data/contact.ts (email,
 * phone, address) and src/data/terms.ts (company name, website). Anything the
 * owner still needs to supply is marked TODO and listed in the final report.
 * This module is data only; it does not change the rendered UI.
 */
export const SITE = {
  name: 'Chuech studio',
  url: 'https://chuechstudio.co.ke',
  email: 'hello@chuechstudio.co.ke',
  phone: '+254117954929',
  locale: 'en_KE',
  description:
    'Chuech studio is a web design agency in Kenya. We build websites, run SEO, social media marketing and PPC, and design brands. Talk to us about your next project.',
  /* 600x287 transparent brand logo generated from chuech-logo2.svg. */
  logo: 'https://chuechstudio.co.ke/logo.png',
  /* 1200x630 brand card generated from the same SVG + the site's colors. */
  ogImage: 'https://chuechstudio.co.ke/og-default.png',
  /* TODO(owner): add the real social profile URLs here when supplied. No
     social links exist in the current footer or Contact page, so sameAs
     must stay empty rather than inventing profiles. */
  sameAs: [] as string[],
  address: {
    /* TODO(owner): no street address is published on the site today; only
       "Nairobi, Kenya, 00100" appears on the Contact page. */
    streetAddress: '',
    addressLocality: 'Nairobi',
    /* TODO(owner): no region/suburb is published on the site. */
    addressRegion: '',
    postalCode: '00100',
    addressCountry: 'KE',
  },
} as const
