/*
 * `/ppc` content (ppc spec §4). Same shape as `web-design.ts`, so the generic
 * `ServicePage` template renders it unchanged — adding PPC needed only this
 * module plus its registry entry in `content/live/map.ts`.
 *
 * All copy here is original Chuech Studio copy, written in a plain, friendly
 * voice. Chuech Studio is based in Nairobi, Kenya, and this page makes no
 * location claims.
 *
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
    title: 'How does a full funnel campaign work?',
    body: 'Not everyone is ready to buy the first time they see an ad. We plan for people at different stages, from those just learning about your business to those comparing options or ready to enquire. Each stage gets a message that fits, so no opportunity is wasted.',
  },
  {
    title: 'Why do landing pages matter?',
    body: 'An ad can only do so much on its own. The page people land on needs to load quickly, say clearly what you offer, and make it easy to get in touch. We build and improve those pages so the traffic you pay for has a better chance of becoming an enquiry.',
  },
  {
    title: 'What is remarketing?',
    body: 'Most people do not enquire on their first visit. Remarketing shows your ads to those who have already been to your site, reminding them of what you offer as they browse elsewhere. It is a simple way to stay in touch with people who already know you.',
  },
  {
    title: 'How much does PPC cost?',
    // TODO(owner): publish real price ranges.
    body: 'PPC has two costs to think about. One is the budget you spend with the ad platform on clicks. The other is the fee for managing the campaign. Both depend on your goals and how competitive your market is. We scope the work first and share a clear proposal before anything starts.',
  },
  {
    title: 'How do you manage Google Ads?',
    body: 'We set up your account, group campaigns by intent, and write ads that match what people are searching for. We then monitor performance, test new angles, and adjust bids and budgets as results come in. The goal is steady improvement, not a one-off launch.',
  },
  {
    title: 'Why does ongoing optimisation matter?',
    body: 'Ad campaigns are never truly finished. Competitors change their bids, audiences shift, and platforms update how things work. We review results regularly, remove what is not performing, and put more behind what is. That keeps your campaign useful over time rather than slowly going stale.',
  },
]

/* ------------------------------------------------------------------ */
/* FAQ — 7 questions                                                  */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS: ServiceFaqItem[] = [
  {
    question: 'Why is PPC useful for generating leads?',
    answer: [
      'PPC puts your offer in front of people who are already looking for something like it, and you only pay when they click. That intent makes it a direct way to generate enquiries. We refine the targeting and the landing page together, so the clicks you pay for have a better chance of turning into customers.',
    ],
  },
  {
    question: 'How soon can a campaign start?',
    answer: [
      'Campaigns can be set up and made live once we have agreed on the goals, budget and audience. There is a short learning period at the start while we gather data and see which ads and terms perform best. From there we refine the campaign step by step, so results improve as we learn.',
    ],
  },
  {
    question: 'Which metrics do you focus on?',
    answer: [
      'Clicks and impressions tell part of the story, but they are not the whole picture. We focus on enquiries, sales, cost per acquisition and return on ad spend, because those show whether the campaign is helping your business. If a number looks good but brings no customers, we treat it as a signal to change something.',
    ],
  },
  {
    question: 'Can PPC work with a small budget?',
    answer: [
      'Yes. A smaller budget simply means a tighter focus. We choose fewer, better-matched keywords and audiences, and make sure the landing pages are strong. Often we look at ',
      { label: 'our web design', href: ROUTES.webDesign },
      ' work too, because a clear page helps every click count. We would rather do a few things well than spread the budget thin.',
    ],
  },
  {
    question: 'Is PPC better than SEO?',
    answer: [
      'They do different jobs. PPC brings visitors quickly and gives you control over who sees your ads. ',
      { label: 'SEO', href: ROUTES.seo },
      ' builds visibility that grows over time and keeps working after the campaign ends. Many businesses use both, with each supporting the other. You can see how we approach projects in ',
      { label: 'our work', href: ROUTES.work },
      '.',
    ],
  },
  {
    question: 'Do PPC campaigns need ongoing management?',
    answer: [
      'Yes. Bids, competitors and audience behaviour change all the time, so a campaign that is left alone slowly loses ground. We check performance regularly, test new ad copy and audiences, and adjust the budget toward what is working. That ongoing care is what keeps the cost per enquiry steady.',
    ],
  },
  {
    question: 'Can PPC fit with the rest of our marketing?',
    answer: [
      'Usually, yes. Ads work best when the rest of your presence backs them up. Clear branding, a well-built website and strong content all make people more likely to enquire once they click. We can look at ',
      { label: 'branding', href: ROUTES.branding },
      ' and other channels alongside PPC so your message stays consistent wherever customers meet you. Contact us on hello@chuechstudio.co.ke or +254117954929 to talk it through.',
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
    title: 'PPC for businesses growing in Kenya',
    /* TODO: confirm the platforms offered before launch (ppc spec §3.1). */
    tags: [
      'Search',
      'Display',
      'Shopping',
      'Video',
      'Maps',
      'Conversion Rate Optimisation',
      'Last updated: Jan 2026',
    ],
    intro:
      'PPC stands for pay per click. It lets your business appear in front of people who are searching for what you offer, and you pay when they click. We run these campaigns for businesses in Kenya that want more enquiries and sales, with clear ad copy and pages built to convert.',
    form: HERO_FORM,
  },
  feature: {
    heading: 'Why consider paid ads for your business?',
    lead:
      'Paid ads can put your business in front of the right people quickly. They work best when the ad matches what someone is looking for and the page they land on gives them a clear next step. We build campaigns around that simple idea.',
    checklist: [
      'Full funnel strategy',
      'Landing pages',
      'Remarketing campaigns',
      'Google Ads management',
      'Display ads',
      'Continuous optimisation',
    ],
    body:
      'We start with your goals and the customers you want to reach. From there we choose the right terms and audiences, write ads that say what you offer, and send people to pages that are easy to use. We watch the results and adjust as we go, so the budget goes toward what is working.',
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
    heading: 'Why work with Chuech Studio for PPC?',
    body:
      'We keep the focus on results you can measure. We start by agreeing what a good outcome looks like for your business, then build the campaign around it. You get clear reports, plain explanations and a plan that changes when the data tells us to. We are based in Nairobi, Kenya, and we work with businesses of all sizes.',
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
