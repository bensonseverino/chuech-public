/*
 * `/ppc` content (ppc spec §4). Same shape as `web-design.ts`, so the generic
 * `ServicePage` template renders it unchanged — adding PPC needed only this
 * module plus its registry entry in `content/live/map.ts`.
 *
 * The structure follows the ppc spec; the copy is draft studio copy in
 * original wording (no Marino wording, no Manchester/UK claims — Chuech is
 * Nairobi-based). Currency-neutral phrasing replaces the spec's "every pound".
 * Unknown facts stay visible as TODO placeholders; in dev a console warning
 * lists any value still carrying one (see the walk at the bottom). The trading
 * name is spelled out per the sibling modules; it matches the shared site data
 * (`SITE_FALLBACK.site.companyName`) so a CMS/company rename lands in both.
 */
import { ROUTES } from '../../routes'
import type {
  ServiceFaqItem,
  ServiceFormContent,
  ServiceFormField,
  ServicePageContent,
} from './web-design'

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

const HERO_FORM_FIELDS: ServiceFormField[] = [
  { name: 'name', label: 'Name*', required: true },
  { name: 'email', label: 'Email*', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'message', label: 'Message', type: 'textarea' },
]

const HERO_FORM: ServiceFormContent = {
  heading: 'Request a free consultation today',
  highlight: 'free consultation',
  fields: HERO_FORM_FIELDS,
  submitLabel: 'Request Consultation',
  source: 'ppc-hero',
  service: 'ppc',
}

/* ------------------------------------------------------------------ */
/* Dark pillars panel — one per captured feature (ppc spec §3.4)       */
/* ------------------------------------------------------------------ */

const PILLARS = [
  {
    title: 'Full funnel strategy',
    body: 'Our PPC campaigns target every stage of the buying journey to maximise return. While some customers are ready to buy, others are still comparing options, so we plan for awareness, consideration and conversion together, meeting people wherever they are.',
  },
  {
    title: 'Landing pages',
    body: 'Even the best ad campaign struggles to convert without a landing page built for it. We design pages with the user\u2019s intent in mind, fast, clear and focused, so that your traffic turns into conversations without needing to raise your budget.',
  },
  {
    title: 'Remarketing campaigns',
    body: 'Many visitors leave before they enquire. Remarketing brings them back with relevant messages across search, display and video, keeping your brand in front of people who have already shown interest, long after they have left your site.',
  },
  {
    title: 'Google Ads management',
    // TODO: confirm the platforms we actually manage before promoting this copy.
    body: 'Google is one of the most widely used advertising platforms, and it rewards well-structured accounts. We build, manage and refine your campaigns day to day, looking for opportunities to lower costs and improve performance.',
  },
  {
    title: 'Display ads',
    body: 'Display advertising lets your brand appear across a wide network of websites and apps. Targeted at people who fit your audience or have visited before, it builds recognition and nudges prospects towards your products or services.',
  },
  {
    title: 'Continuous optimisation',
    body: 'Successful PPC is never set and forget. We monitor every campaign, test new angles and adjust bids, audiences and creative as results come in, so a dip in performance is caught and fixed before it affects your revenue.',
  },
]

/* ------------------------------------------------------------------ */
/* FAQ — 13 questions (ppc spec §4)                                    */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS: ServiceFaqItem[] = [
  {
    question: 'What makes PPC so effective for generating leads or sales?',
    answer: [
      'PPC places your offer in front of people who are already searching or browsing for something relevant, and you only pay when they click. That intent, combined with precise targeting and instant measurement, makes it one of the most direct ways to generate leads and sales.',
    ],
  },
  {
    question: 'How quickly can PPC start generating results?',
    answer: [
      'Campaigns can go live within days of approval and begin driving traffic almost immediately. The first few weeks are also a learning period: we gather data, test variations and refine targeting, so performance usually improves steadily after launch.',
    ],
  },
  {
    question: 'What metrics actually matter in a PPC campaign?',
    answer: [
      'Clicks and impressions are only a starting point. We focus on conversions, cost per acquisition, conversion rate and return on ad spend, because those show whether the campaign is producing real business outcomes.',
    ],
  },
  {
    question: 'Do PPC campaigns only target customers ready to buy?',
    answer: [
      'No. Search campaigns tend to capture people with high intent, while display, video and remarketing reach people earlier in their decision or bring back those who have already visited. A full funnel approach uses each for what it does best.',
    ],
  },
  {
    question: 'Why are remarketing campaigns important?',
    answer: [
      'Most visitors don\u2019t convert on their first visit. Remarketing keeps your brand in front of them with relevant messages, which often brings back warm prospects at a lower cost than reaching new people.',
    ],
  },
  {
    question: 'How much does PPC cost?',
    answer: [
      'It depends on your goals, your market and how competitive your keywords are. There are usually two parts: the advertising budget paid to the platforms, and our management fee. We agree both with you up front in a clear proposal. TODO: confirm the pricing model.',
    ],
  },
  {
    question: 'Can PPC still work with a limited budget?',
    answer: [
      'Yes. A smaller budget simply means tighter focus: fewer, better-chosen keywords and audiences, and strong landing pages so that every click counts. We would rather do a few things well than spread a modest budget thin.',
    ],
  },
  {
    question: 'How do you improve PPC campaign performance over time?',
    answer: [
      'We review results regularly, test new ad copy, audiences and landing-page changes, remove what isn\u2019t working and put more budget behind what is. Small, steady improvements compound into much better performance.',
    ],
  },
  {
    question: 'Is PPC better than SEO?',
    answer: [
      'They do different jobs. PPC delivers fast, controllable results, while SEO builds lasting visibility over time. Many businesses get the best outcome by using both, with each informing the other.',
    ],
  },
  {
    question: 'Should PPC be used alongside other marketing channels?',
    answer: [
      'Usually, yes. PPC works best as part of a wider plan, supported by strong branding, a well-built website, SEO and video, so that people see a consistent message wherever they meet your business.',
    ],
  },
  {
    question: 'Which platforms do you run PPC campaigns on?',
    answer: [
      'TODO: confirm. Typically Google Ads (search, display, shopping, YouTube and maps), plus other platforms where your audience spends time. We recommend the mix based on your goals rather than defaulting to one channel.',
    ],
  },
  {
    question: 'Do PPC campaigns need ongoing management?',
    answer: [
      'Yes. Bids, competitors, audience behaviour and platform features all change constantly. Ongoing management keeps campaigns efficient and lets us act quickly on new opportunities or problems.',
    ],
  },
  {
    question: 'How do you choose the right keywords for PPC campaigns?',
    answer: [
      'We start from your business goals and what customers actually search for, then research volume, intent and competition. We group keywords by intent, exclude irrelevant terms, and keep refining the list as the data comes in.',
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export const PPC: ServicePageContent = {
  seo: {
    /* Chuech Studio page metadata (ppc spec §9). */
    title: 'PPC Services | Chuech studio',
    description:
      'Revenue-focused pay-per-click advertising from Chuech studio: search, display, shopping, video and maps campaigns built to turn clicks into customers.',
  },
  hero: {
    label: 'PPC',
    title: 'Revenue-focused PPC that businesses can rely on',
    /* TODO: confirm the platforms offered before launch (ppc spec §3.1). */
    tags: [
      'Search',
      'Display',
      'Shopping',
      'Video',
      'Maps',
      'Conversion Rate Optimisation',
    ],
    intro:
      'PPC campaigns from Chuech Studio turn clicks into enquiries and sales. We make your ad spend work harder by putting you in front of people who are ready to buy, backed by clear ad copy, landing pages built to convert and a frictionless journey from click to customer.',
    form: HERO_FORM,
  },
  feature: {
    heading: 'Capture demand when customers are ready to buy',
    lead:
      'Arguably the most attractive feature of PPC is the ability to appear instantly in front of people who are actively searching for what you offer, at the exact moment they are searching.',
    checklist: [
      'Full funnel strategy',
      'Landing pages',
      'Remarketing campaigns',
      'Google Ads management',
      'Display ads',
      'Continuous optimisation',
    ],
    body:
      'Too often, PPC campaigns chase surface-level metrics such as clicks and impressions. We focus on revenue. By aligning your business goals with the terms customers are really searching for, we prioritise the keywords, audiences and landing-page elements most likely to produce enquiries and sales.',
    cta: { label: 'Contact', href: ROUTES.contact },
    image: 'ppc-feature',
    imageAlt: 'A laptop screen showing the LinkedIn Ads Campaign Manager account page',
  },
  projects: {
    heading: 'Some of our favourite PPC projects',
    viewAll: { label: 'View all work', href: ROUTES.work },
    /* Projects carry their tags in the shared order; anything tagged PPC is
       eligible (ppc spec §3.3). */
    tag: 'PPC',
    limit: 8,
    regionLabel: 'PPC projects',
  },
  pillars: {
    label: 'Our PPC services',
    items: PILLARS,
    cta: { label: 'Contact Chuech Studio', href: ROUTES.contact },
  },
  why: {
    heading: 'Why PPC works so well for growing businesses',
    body:
      'PPC puts your business in front of motivated customers immediately, with budgets you control and results you can measure. Working with a team that understands both the platforms and your market means less wasted spend, sharper targeting and a clearer return on investment.',
    cta: { label: 'Contact', href: ROUTES.contact },
    image: 'ppc-why',
    imageAlt: 'A sprint dashboard with a kanban board on a tablet in front of task and market monitors, a hand holding a pencil',
    form: {
      /* The live callback form has no visible heading. */
      fields: [
        { name: 'name', label: 'Name*', required: true },
        { name: 'phone', label: 'Phone*', type: 'tel', required: true },
        { name: 'email', label: 'Email', type: 'email' },
      ],
      submitLabel: 'Request Call Back',
      source: 'ppc-callback',
      service: 'ppc',
    },
  },
  faq: {
    heading: 'Frequently asked questions',
    items: FAQ_ITEMS,
  },
}

/* ------------------------------------------------------------------ */
/* Dev warning for unsettled facts (ppc spec §4)                       */
/* ------------------------------------------------------------------ */

/**
 * In dev, warn once listing every string in the module that still carries a
 * TODO, so unconfirmed facts can't quietly ship to production unnoticed.
 */
if (import.meta.env.DEV) {
  const strings: string[] = []
  const walk = (value: unknown): void => {
    if (typeof value === 'string') {
      if (value.startsWith('TODO')) strings.push(value)
      return
    }
    if (Array.isArray(value)) {
      for (const item of value) walk(item)
      return
    }
    if (value && typeof value === 'object') {
      for (const item of Object.values(value)) walk(item)
    }
  }
  walk(PPC)
  if (strings.length > 0) {
    console.warn(
      `[ppc] ${strings.length} placeholder fact(s) still need confirming:\n${strings.join('\n')}`,
    )
  }
}
