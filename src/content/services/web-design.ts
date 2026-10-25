/*
 * `/web-design` content (web-design spec §7). Everything here is what the
 * generic `ServicePage` template renders, so Branding / SEO / PPC can
 * reuse it later with their own object of the same shape.
 *
 * The structure and service copy were adapted for Chuech Studio from the
 * original reference page https://marino.co.uk/web-design/, keeping the curly
 * apostrophes. Titles, chips, field labels, questions and button labels follow
 * the original spec.
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
    title: 'Site architecture',
    body: 'To be successful, a website needs a solid foundation, and our team at Chuech Studio ensures this by creating logical site structures from day one. No matter how broad your product or service range is, we\u2019ll have the necessary URL structures and sitemap in place that search engines reward with page one rankings.',
  },
  {
    title: 'Optimised for search',
    body: 'A nice-looking site can\u2019t make sales or bring in enquiries if it isn\u2019t found for the terms audiences are searching for. Be it through the content we write or the way we create schema, your site will be optimised for both traditional SEO and for AI platforms from the get-go.',
  },
  {
    title: 'Distinctive web design',
    body: 'Your online home deserves to reflect not just your brand\u2019s aesthetic but its story and the people who make it what it is. Crafted using the latest CMS, we\u2019ll build you a bespoke website that flows seamlessly from product to page to checkout without a hint of friction for the buyer.',
  },
  {
    title: 'Multi-channel ready',
    body: 'A key part of maximising your website\u2019s potential is ensuring it supports your paid and organic activity seamlessly. Our joined-up approach means PPC campaigns can lead interested customers to conversion-ready landing pages, whereas organic content can be laid out to nurture new audiences. We consider multi-channel campaigns throughout the website build to prevent costly silos from forming.',
  },
  {
    title: 'Scalable sites',
    body: 'Growing businesses rarely stand still, and their website should never hold them back from offering more products or services. We believe that a well-built site should anticipate and be ready for future growth. The team at Chuech Studio use a scalable CMS when building your site, so products can be added or new blogs and landing pages can be built and set live in minutes.',
  },
  {
    title: 'Conversion-focused layouts',
    body: 'From expansive product category pages down to the smallest call to action button, each cog of your website is built to guide users towards action. We create thoughtfully structured pages that remove friction from the customer journey to support stronger conversion rates.',
  },
]

/* ------------------------------------------------------------------ */
/* FAQ                                                                */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS: ServiceFaqItem[] = [
  {
    question: 'How long does a web design project take?',
    answer: [
      'The timeline for a web design project depends on factors such as scope and content requirements. Most Nairobi web design projects take between 8 and 12 weeks, but larger builds may take longer. We\u2019ll ensure clear planning is laid out from the onset so that timelines remain realistic.',
    ],
  },
  {
    question: 'Do you build SEO-ready websites?',
    answer: [
      'All of our websites are built with technical SEO foundations in place from day one. From site architecture and internal linking to metadata frameworks, we make sure your website is ready to compete with your competitors from day one.',
    ],
  },
  {
    question: 'Does website speed impact performance?',
    answer: [
      'Slow-loading websites can significantly affect both a customer\u2019s experience and how visible it is on search engines. If a customer has to wait for a page to load, they\u2019ll simply head to a competitor that offers a similar product or service and buy from there. Modern websites need to load almost instantly across all devices to reduce friction.',
    ],
  },
  {
    question: 'Why is website structure important?',
    answer: [
      'Logical site structures help customers and search engines navigate your website more effectively and give both parties a better understanding about your business, ensuring it can be found for the terms it is targeting. Features such as clear navigation and relevant internal linking all contribute to strong visibility and a better user experience.',
    ],
  },
  {
    question: 'Can you redesign an existing website?',
    answer: [
      'Yes, we regularly redesign existing websites without needing to migrate them over to a new CMS, too, in many cases. We can help align your website with your current brand identity as well as strengthen conversions.',
    ],
  },
  {
    question: 'Will we be able to update the website ourselves?',
    answer: [
      'Yes, we build and update websites using scalable content management systems so that anyone in the business, with the right permissions, can manage the site without having to rely on contacting our developers.',
    ],
  },
  {
    question: 'Are your websites designed for mobile users?',
    answer: [
      'Absolutely, any decent website should be built so that it can perform just as well on mobile as it can on a laptop, and we ensure your site can convert no matter what device your audience is on.',
    ],
  },
  {
    question: 'Do you provide web design services outside Nairobi?',
    answer: [
      'Our remote-first model allows us to work efficiently with clients across Kenya and beyond. So, despite Nairobi being our home, anyone can benefit from a Chuech Studio website.',
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
      'Chuech Studio is a Nairobi web design agency creating bespoke websites built to look sharp, convert better, and support business growth.',
  },
  hero: {
    label: 'Web Design Nairobi',
    /* 8.2em is what forces the four-line break at 768 and up (spec §5.1). */
    titleMaxWidth: '8.2',
    title: 'Web Design services that turn heads and grow revenue',
    tags: ['Web Design', 'UX / UI', 'eCommerce', 'Wireframes', 'Conversion Rate Optimisation'],
    intro:
      'Your brand\u2019s website is arguably the single most important digital asset you own, and we don\u2019t think that it\u2019s too much to ask for it to look good and perform well. Our web design services give businesses a platform that helps you hit commercial goals while also expressing your brand in distinct, inventive ways.',
    form: HERO_FORM,
  },
  feature: {
    heading: 'Your website is where you grow your business',
    /* Spec §4.3 asks for the break "Your website is where / you grow your
       business". In the live font at 33px/500 that needs 10.67em for the
       second line, so the spec's flat 10em wraps it to three lines; 10.8em is
       the smallest cap that reproduces the documented break (and 11.67em is
       where line one would swallow "you"). */
    headingMaxWidth: '10.8',
    lead: 'Your website is the point at which all your marketing efforts converge, with people visiting it from various places, be it a social media ad, via a search engine, or an article. It, therefore, needs to be built in such a way that it turns visitors into customers and traffic into revenue.',
    checklist: [...CHECKLIST],
    body: 'The experts we have at Chuech Studio handle every aspect of your web design and development. From the initial consultation, we\u2019ll map out a scalable, technically sound online home that accurately reflects your business\u2019s story and what it sells. Over time, it\u2019ll become one of your key revenue-generating assets that proves its value in the months and years to come.',
    cta: { label: 'Contact', href: ROUTES.contact },
    image: 'web-design-feature',
    /* TODO(asset): two of the team on an orange sofa (16:9 on mobile, ~6:5 at
       md+). The slot currently resolves to the shared hero-team placeholder. */
    imageAlt: 'Two members of the Chuech Studio team working together on an orange sofa',
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
    heading: 'Why your business needs more than a website that looks nice',
    /* Same reasoning: the documented break needs 14.12em for line one and
       13.39em for line two, so the spec's 13.5em wraps to three lines. */
    headingMaxWidth: '14.3',
    body: 'Today\u2019s websites aren\u2019t just static brochures that simply exist online. Customers expect intuitive experiences where they can take action in just a few clicks without even thinking about it. A visually impressive website won\u2019t achieve the necessary commercial goals if it lacks structure or isn\u2019t set up to perform well on all devices. Chuech Studio\u2019s web design services balance aesthetics with commercial performance so that every build reflects your brand visually but also ensures your site functions as a long-term business asset.',
    cta: { label: 'Contact', href: ROUTES.contact },
    image: 'web-design-why',
    /* TODO(asset): the team around a table with plants. Reuses the shared
       hero-team placeholder until the real web-design-why.jpg lands. */
    imageAlt: 'The Chuech Studio team gathered around a table with plants',
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
