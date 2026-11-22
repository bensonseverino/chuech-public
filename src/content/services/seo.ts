/*
 * `/seo-manchester` content (same shape as `web-design.ts`, so the generic
 * `ServicePage` template renders it unchanged). The slug is legacy; Chuech
 * Studio is based in Nairobi, Kenya.
 *
 * All copy in this file is original Chuech Studio copy, written in a plain,
 * friendly voice. No wording from another agency is used.
 *
 * TODO(asset): the two photos are labelled local placeholders — the live page
 * uses `seo-middle-1200x990.jpg` (6:5, feature panel) and
 * `about-us-top-right-1200x675.jpg` (16:9, campaign panel). Both are decorative
 * on the live page (empty alt), so the slots keep an empty alt rather than
 * inventing a description of an image that is not in the workspace.
 */
import { ROUTES } from '../../routes'
import type {
  ServiceFaqItem,
  ServiceFormContent,
  ServicePageContent,
} from './web-design'

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
  source: 'seo-hero',
}

/* ------------------------------------------------------------------ */
/* Dark pillars panel                                                 */
/* ------------------------------------------------------------------ */

const PILLARS = [
  {
    title: 'What is technical SEO?',
    body: 'This is the work that happens behind the pages of your site. We check things like site speed, mobile layout, and how search engines read your pages. Fixing these issues gives your content a better chance to be found and used.',
  },
  {
    title: 'How does content help SEO?',
    body: 'Words matter. We write pages that answer the questions your customers are asking, using terms people actually search for. Useful content helps the right visitors find you, understand what you offer, and feel confident enough to enquire.',
  },
  {
    title: 'Why do links and mentions matter?',
    body: 'When other trusted sites mention or link to you, it tells search engines that your business is credible. We focus on earning a small number of relevant links from sites your customers already know, rather than chasing large numbers of low quality ones.',
  },
  {
    title: 'How much does SEO cost?',
    // TODO(owner): publish real price ranges.
    body: 'There is no single price, because every site and goal is different. We scope the work first: what needs fixing, what content is needed, and how much ongoing support makes sense. We then share a clear proposal with the cost before any work starts.',
  },
  {
    title: 'Can you help with local search?',
    body: 'Many customers look for businesses near them. We help your site and your Google Business Profile show up for those searches, whether you serve one neighbourhood or several areas. The aim is to turn local visibility into real enquiries.',
  },
  {
    title: 'What about AI search?',
    body: 'More people now get answers from tools like ChatGPT and Perplexity, not only from a list of links. We write and structure your content so these tools can understand it and cite your business. It is a new part of search, and we keep it simple.',
  },
]

/* ------------------------------------------------------------------ */
/* FAQ — 7 questions                                                  */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS: ServiceFaqItem[] = [
  {
    question: 'How long does SEO take to show results?',
    answer: [
      'SEO is a long term investment rather than a quick fix. Small improvements can appear as we fix technical issues and publish useful pages, but the bigger gains come as the site builds trust over time. We set clear milestones at the start so you can see progress, and we adjust the plan as we learn what works for your market.',
    ],
  },
  {
    question: 'What does your SEO service include?',
    answer: [
      'We cover the main parts of organic search. That includes a technical review of your site, keyword research, writing and improving pages, and earning relevant links and mentions. Where the site itself needs work, we team up with our ',
      { label: 'web design', href: ROUTES.webDesign },
      ' team so the changes support each other. We also report on what changed and what we plan next.',
    ],
  },
  {
    question: 'How do you choose the right keywords?',
    answer: [
      'We start with what your customers are likely to type when they need what you offer. We look at intent as well as how often a term is searched, because someone ready to enquire is more useful than a broad term with little purpose. We group terms by theme and update the list as we see how people actually find you.',
    ],
  },
  {
    question: 'Do you work with businesses outside Nairobi?',
    answer: [
      'Yes. We are based in Nairobi, Kenya, and we work with businesses of different sizes and in different places. Most of our work is delivered remotely, so location is rarely a barrier. You can see the kind of projects we take on in ',
      { label: 'our work', href: ROUTES.work },
      ', and we are happy to talk through what would suit your business.',
    ],
  },
  {
    question: 'Can SEO work alongside paid ads?',
    answer: [
      'Yes. SEO and ',
      { label: 'PPC', href: ROUTES.ppc },
      ' do different jobs and work well together. Paid ads can bring visitors straight away, while SEO builds visibility that keeps paying off over time. We can run both and use what we learn from one to improve the other, so you get a clearer picture of which messages and pages bring in enquiries.',
    ],
  },
  {
    question: 'How will I know if SEO is working?',
    answer: [
      'We keep reporting simple. You will see the terms people find you on, how many visitors arrive from search, and what those visitors do once they are on your site. More importantly, we tie those numbers back to enquiries and sales, so you can tell whether the work is helping your business rather than just moving a chart.',
    ],
  },
  {
    question: 'Can you work with our in-house team?',
    answer: [
      'Yes. We often work alongside the team you already have. We can take the lead on SEO and bring in specialists where needed, or support your staff with audits, content and advice. We agree on who does what at the start, so there is no confusion and the work moves forward smoothly.',
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export const SEO: ServicePageContent = {
  seo: {
    /* Chuech Studio page metadata. */
    title: 'SEO Nairobi | SEO Agency Nairobi | Chuech Studio',
    description:
      'Chuech Studio is a Nairobi SEO agency helping brands grow visibility across Google, AI answers, and search.',
  },
  hero: {
    label: 'SEO Nairobi',
    title: 'SEO for businesses growing in Kenya',
    tags: [
      'Audits',
      'Content',
      'Technical',
      'Link Building',
      'AI',
      'Digital PR',
      'Last updated: Jan 2026',
    ],
    intro:
      'SEO helps your business show up when people search on Google or ask an AI assistant. We work with businesses in Kenya that want more of the right visitors to their website. That means fixing the basics, writing useful content, and making it easier for customers to find and trust you.',
    form: HERO_FORM,
  },
  feature: {
    heading: 'What does SEO actually do for your business?',
    lead: 'Good SEO is not just about rankings. It brings the right people to your site and gives them a reason to stay. We look at how your site works, the words on it, and how easy it is to use.',
    checklist: [
      'Technical SEO',
      'Content Marketing',
      'Link Building',
      'Local SEO',
      'Core Web Vitals',
      'AI SEO',
    ],
    body: 'We start with what your business needs. Some sites need technical fixes first. Others need better content or a stronger presence in local search. We agree on a clear plan, do the work, and explain what changed and why. You will always know what we are doing and what comes next.',
    cta: { label: 'Contact', href: ROUTES.contact },
    image: 'seo-feature',
    imageAlt: 'A close-up of a Google Search Console performance report showing clicks, impressions and position trends',
  },
  projects: {
    heading: 'Some of our favourite SEO projects',
    viewAll: { label: 'View all work', href: ROUTES.work },
    tag: 'SEO',
    /* The live page curates and orders these itself, and leads with Office
       Insight rather than the shared order's WR Partners. */
    slugs: ['office-insight', 'wr-partners', 'latakoo', 'vislink', 'portswigger', 'blackbird'],
    limit: 6,
    regionLabel: 'SEO projects',
  },
  pillars: {
    label: 'SEO services',
    items: PILLARS,
    cta: { label: 'Contact Chuech Studio', href: ROUTES.contact },
  },
  why: {
    heading: 'Why work with Chuech Studio for SEO?',
    body: 'We keep things clear and focused on your goals. First we look at where your site stands today and agree on what matters most. From there we work through a rolling plan that can change as your priorities change. You will always know what we are doing, why we are doing it, and what it is meant to achieve. We can work on our own or alongside your team.',
    cta: { label: 'Contact', href: ROUTES.contact },
    image: 'seo-why',
    imageAlt: 'Hands on a laptop showing a Google Analytics acquisition report, a striped mug on a Kenya-flag coaster beside it',
    form: {
      /* The live callback form has no visible heading. */
      fields: [
        { name: 'name', label: 'Name*', required: true },
        { name: 'phone', label: 'Phone*', type: 'tel', required: true },
        { name: 'email', label: 'Email', type: 'email' },
      ],
      submitLabel: 'Request Call Back',
      source: 'seo-callback',
    },
  },
  faq: {
    heading: 'Frequently asked questions',
    items: FAQ_ITEMS,
  },
}
