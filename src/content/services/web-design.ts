/*
 * `/web-design` content (web-design spec §7). Everything here is what the
 * generic `ServicePage` template renders, so other services can reuse it
 * with an object of the same shape.
 *
 * All on-page copy here is original Chuech Studio copy. The studio is based
 * in Nairobi, Kenya, and offers web design, branding, SEO and PPC services.
 */
import { ROUTES } from '../../routes'
import type { RichSegment } from '../home'

export type ServiceLink = { label: string; href: string }

export type ServiceFormField = {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'textarea'
  required?: boolean
}

export type ServiceFormContent = {
  /** Card heading; omitted when the live form has none (callback form §5.5). */
  heading?: string
  /** Phrase inside `heading` that carries the lavender pill highlight. */
  highlight?: string
  fields: ServiceFormField[]
  submitLabel: string
  /** Identifier sent with the lead so the two forms are distinguishable. */
  source: string
  /**
   * The service the lead is about, e.g. `ppc` (ppc spec §3.1). Optional so the
   * earlier service pages keep their previous payload exactly.
   */
  service?: string
}

export type ServiceFaqItem = { question: string; answer: RichSegment[] }

export type ServicePageContent = {
  seo: { title: string; description: string }
  hero: {
    label: string
    title: string
    /**
     * Optional title cap in `em`, applied from 768px up (spec §5.1). Omit it to
     * let the title wrap naturally against the hero column.
     */
    titleMaxWidth?: string
    tags: string[]
    intro: string
    form: ServiceFormContent
  }
  feature: {
    heading: string
    /** Optional heading cap in `em` (spec §5.2). */
    headingMaxWidth?: string
    lead: string
    checklist: string[]
    body: string
    cta: ServiceLink
    image: string
    imageAlt: string
  }
  projects: {
    heading: string
    viewAll: ServiceLink
    /** Only projects carrying this tag are shown, in the shared order. */
    tag: string
    /**
     * Optional explicit selection and order by slug — the live service pages
     * curate their own. When present it wins over `tag`.
     */
    slugs?: string[]
    limit: number
    /** Accessible name of the scrolling region (§9). */
    regionLabel: string
  }
  pillars: {
    /** Accessible name of the panel; it has no visible heading (§5.4/§9). */
    label?: string
    items: { title: string; body: string }[]
    cta: ServiceLink
  }
  why: {
    heading: string
    /** Optional heading cap in `em` (spec §5.5). */
    headingMaxWidth?: string
    body: string
    cta: ServiceLink
    image: string
    imageAlt: string
    form: ServiceFormContent
  }
  faq: { heading: string; items: ServiceFaqItem[] }
}

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

const HERO_FORM: ServiceFormContent = {
  heading: 'Request a free consultation today',
  highlight: 'free consultation',
  fields: [
    { name: 'name', label: 'Name*', required: true },
    { name: 'email', label: 'Email*', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'tel' },
    { name: 'message', label: 'Message', type: 'textarea' },
  ],
  submitLabel: 'Request Consultation',
  source: 'web-design-hero',
}

/* ------------------------------------------------------------------ */
/* Feature panel — shared with the dark panel (§5.2 / §5.4)           */
/* ------------------------------------------------------------------ */

const CHECKLIST = [
  'Site architecture',
  'Optimised for search',
  'Distinctive web design',
  'Multi-channel ready',
  'Scalable sites',
  'Conversion-focused layouts',
] as const

/** The dark panel repeats the checklist as six titled paragraphs. */
const PILLARS = [
  {
    title: 'What goes into a website plan?',
    body: 'Before we design anything, we map out how the site will be built. That means agreeing on the pages you need, how they connect, and how people will move between them. A clear plan keeps the build focused and makes the site easier to manage later.',
  },
  {
    title: 'How will people find my site?',
    body: 'A site only works if people can find it. We set up the basics of search optimisation during the build, from clear page titles to sensible links between pages. That gives you a starting point. If you want more visibility, we also offer SEO as a separate service.',
  },
  {
    title: 'Why does design matter?',
    body: 'Your site should look like your business and be easy to use. We design pages that reflect your brand and make it clear what you offer. The aim is a site you are happy to share and that visitors can understand quickly.',
  },
  {
    title: 'How does my site fit with other marketing?',
    body: 'A website sits at the centre of your other marketing. We build pages that work with search, paid ads and social activity, so visitors arrive on a page that matches what they clicked on. We plan for this during the build rather than after.',
  },
  {
    title: 'Can my site grow with my business?',
    body: 'Businesses change, and your site should be able to change with them. We build on content management systems that let you add pages, posts or products yourself. That means you can keep the site up to date without coming back to us for every edit.',
  },
  {
    title: 'How much does a website cost?',
    // TODO(owner): publish real price ranges.
    body: 'Pricing depends on the scope of the project, including the number of pages, the design work needed and any extra features. We look at what you need and give you a clear quote before work starts. Get in touch to talk through your project.',
  },
]

/* ------------------------------------------------------------------ */
/* FAQ                                                                */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS: ServiceFaqItem[] = [
  {
    question: 'How long does a web design project take?',
    answer: [
      'The time a project takes depends on its scope. A small site with a few pages is quicker to deliver than a larger one with custom features. We agree on a schedule with you before work starts and keep you updated as we go. You can ',
      { label: 'get in touch', href: ROUTES.contact },
      ' to talk about what you need.',
    ],
  },
  {
    question: 'Do you build SEO-ready websites?',
    answer: [
      'Yes. We build each site with the basics of search optimisation in place, including clear page titles, a sensible structure and links between related pages. That gives you a solid starting point. If you want ongoing help with visibility, we also offer ',
      { label: 'SEO services', href: ROUTES.seo },
      '.',
    ],
  },
  {
    question: 'Does website speed matter?',
    answer: [
      'Yes. A site that takes too long to load can frustrate visitors and may put them off coming back. We keep files lean, use sensible image sizes and check how pages perform on phones as well as laptops. Speed is part of the build, not an afterthought.',
    ],
  },
  {
    question: 'Why is site structure important?',
    answer: [
      'A clear structure helps people find their way around your site and helps search engines understand what each page is about. We group related pages together and link them in a way that makes sense to a visitor. It also makes the site easier for you to add to later.',
    ],
  },
  {
    question: 'Can you redesign an existing website?',
    answer: [
      'Yes. We work on existing sites as well as new ones. A redesign can keep the content you already have and give it a clearer layout and a look that fits your brand. We can also improve how the site works on mobile. You can see examples on our ',
      { label: 'work page', href: ROUTES.work },
      '.',
    ],
  },
  {
    question: 'Will we be able to update the website ourselves?',
    answer: [
      'Yes. We build sites on content management systems so you can edit text, add posts and change images yourself. We set up the right permissions for your team and show you how the basics work before we hand the site over. You stay in control of your content.',
    ],
  },
  {
    question: 'Are your websites designed for mobile users?',
    answer: [
      'Yes. We check how every page looks and works on a phone as well as a laptop. Buttons need to be easy to tap and text needs to be easy to read. Most people visit sites on mobile, so we treat it as part of the main design work rather than an extra.',
    ],
  },
  {
    question: 'Do you work with clients outside Nairobi?',
    answer: [
      'Yes. We are based in Nairobi, Kenya, and work with businesses across the country and further afield. We can run projects remotely and keep in touch by email or phone. If you are elsewhere, email hello@chuechstudio.co.ke to start a conversation.',
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export const WEB_DESIGN: ServicePageContent = {
  seo: {
    /* Chuech Studio page metadata. */
    title: 'Web Design Nairobi | Website Design Agency | Chuech Studio',
    description:
      'Chuech Studio designs and builds websites for businesses in Nairobi and across Kenya. Clear, practical sites that are easy to use and manage.',
  },
  hero: {
    label: 'Web Design Nairobi',
    /* 8.2em is what forces the four-line break at 768 and up (spec §5.1). */
    titleMaxWidth: '8.2',
    title: 'Web design for growing businesses in Kenya',
    tags: [
      'Web Design',
      'UX / UI',
      'eCommerce',
      'Wireframes',
      'Conversion Rate Optimisation',
      'Last updated: Jan 2026',
    ],
    intro:
      'We design and build websites for businesses in Nairobi and across Kenya. Our team plans the structure, designs the pages and builds the site so it is easy to use and easy to manage. This service is for business owners who need a clear, reliable web presence that supports their work.',
    form: HERO_FORM,
  },
  feature: {
    heading: 'What makes a website work for your business?',
    /* Width cap kept for the template's intended line break. */
    headingMaxWidth: '10.8',
    lead: 'Your website is often the first place people look when they want to learn about your business. It needs to say what you do, show what makes you different and make it easy for someone to get in touch. We build sites with those basics covered from the start.',
    checklist: [...CHECKLIST],
    body: 'We handle the design and build in one place. We start by agreeing on the pages and structure, then design each page and build it so you can edit it later. Throughout the work we keep you involved and explain our choices in plain language.',
    cta: { label: 'Contact', href: ROUTES.contact },
    image: 'web-design-feature',
    imageAlt: 'A spread of Verve Creative agency portfolio slides: approach, campaigns and brand marks',
  },
  projects: {
    heading: 'Some of our favourite web design projects',
    viewAll: { label: 'View all work', href: ROUTES.work },
    tag: 'Web Design',
    /* Spec §5.3: the first 8 Web Design projects in the shared order. */
    limit: 8,
    regionLabel: 'Web design projects',
  },
  pillars: {
    items: PILLARS,
    cta: { label: 'Contact Chuech Studio', href: ROUTES.contact },
  },
  why: {
    heading: 'Why does a good website matter for your business?',
    /* Width cap kept for the template's intended line break. */
    headingMaxWidth: '14.3',
    body: 'A website can look good and still fail if people cannot find it or use it. We design for both. Pages are structured so search engines can read them, and layouts are checked on phones and laptops. The result is a site that is straightforward to run and supports the rest of your marketing.',
    cta: { label: 'Contact', href: ROUTES.contact },
    image: 'web-design-why',
    imageAlt: 'A developer\u2019s desk at night, monitors full of code beside a laptop and a coffee cup',
    form: {
      /* The live callback form has no visible heading. */
      fields: [
        { name: 'name', label: 'Name*', required: true },
        { name: 'phone', label: 'Phone*', type: 'tel', required: true },
        { name: 'email', label: 'Email', type: 'email' },
      ],
      submitLabel: 'Request Call Back',
      source: 'web-design-callback',
    },
  },
  faq: {
    heading: 'Frequently asked questions',
    items: FAQ_ITEMS,
  },
}
