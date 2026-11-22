/*
 * `/branding` content (same shape as `web-design.ts`, so the generic
 * `ServicePage` template renders it unchanged).
 *
 * All on-page copy here is original Chuech Studio copy. The studio is based
 * in Nairobi, Kenya, and offers web design, branding, SEO and PPC services.
 *
 * The two photos are final: `branding-feature.webp` (the Smash tennis brand
 * collage) and `branding-why.jpg` (the team around a table with color
 * swatches, 16:9) — swapped into the slots file-for-file.
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
  source: 'branding-hero',
}

/* ------------------------------------------------------------------ */
/* Dark pillars panel — same six items as the feature checklist        */
/* ------------------------------------------------------------------ */

const PILLARS = [
  {
    title: 'What is brand strategy?',
    body: 'Strategy is the thinking that sits behind your brand. We work out who you are, who you are for and what you want to be known for. From there we shape clear messages you can use across your website, documents and campaigns.',
  },
  {
    title: 'How should my brand sound?',
    body: 'The words you use are part of your brand. We write a tone of voice guide that says how you should sound in different situations, so anyone on your team can write content that still feels like your business.',
  },
  {
    title: 'Why does my identity need to work online?',
    body: 'Most people will meet your brand on a screen, in search results, on social media or on a landing page. We design identities that stay clear at small sizes and work across digital channels as well as print.',
  },
  {
    title: 'What do I get with a logo design?',
    body: 'A logo is one part of a wider visual identity. We create a mark that is simple to recognise and practical to use, along with colours, type and icons that work together. You get a set of assets you can use day to day.',
  },
  {
    title: 'Do you handle rebrands?',
    body: 'Yes. A rebrand does not have to start from nothing. We look at what already works, keep the parts of your identity that people recognise and update what no longer fits. The aim is a brand that feels current without losing your history.',
  },
  {
    title: 'How does branding support marketing?',
    body: 'Branding and marketing work best together. When your identity and messages are clear, your website, search and paid activity all tell the same story. We keep those channels in mind during a brand project so the result is easy to put to use.',
  },
]

/* ------------------------------------------------------------------ */
/* FAQ — 8 questions, live order                                      */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS: ServiceFaqItem[] = [
  {
    question: 'What do branding services include?',
    answer: [
      'Our branding work can cover as much or as little as you need. That might be a name and visual identity, a tone of voice guide, or a full rebrand. We start by agreeing on the scope with you. The identity can then be carried into your ',
      { label: 'web design', href: ROUTES.webDesign },
      ' and other marketing.',
    ],
  },
  {
    question: 'Will my branding work across digital platforms?',
    answer: [
      'Yes. We design identities to work where your audience actually sees them, from a website and search results to social posts and ads. That means checking that logos stay legible at small sizes and that colours and type still work on a screen. We also provide guidelines so your team can apply the brand consistently.',
    ],
  },
  {
    question: 'Do branding projects include messaging and copywriting?',
    answer: [
      'Yes. How your business sounds matters as much as how it looks. We can write a tone of voice guide and help shape the messages you use most often. Clear, consistent copy also supports your ',
      { label: 'SEO work', href: ROUTES.seo },
      ', because search engines and people both need to understand what you do.',
    ],
  },
  {
    question: 'How long does a branding project take?',
    answer: [
      'It depends on the scope. A tone of voice guide is a smaller piece of work than a full identity or rebrand. Before we start, we agree on the stages and what you will need to review at each one. That way you know what to expect and can plan around it.',
    ],
  },
  {
    question: 'What’s the difference between branding and logo design?',
    answer: [
      'A logo is one part of a brand. Branding covers the whole picture: your name, the words you use, your colours and type, and how all of it fits together. The logo is the mark people recognise, while the brand is the wider impression your business leaves.',
    ],
  },
  {
    question: 'Do you offer rebranding for established businesses?',
    answer: [
      'Yes. Some businesses have outgrown the identity they started with. A rebrand can update how you look and sound while keeping the parts people already know. We start by reviewing what you have, then agree with you on what should change and what should stay.',
    ],
  },
  {
    question: 'Can branding improve SEO and PPC performance?',
    answer: [
      'It can help, but it is not a replacement for dedicated campaigns. A clear identity and consistent messages make your pages and ads easier to recognise. For traffic and enquiries, you still need planned search and ',
      { label: 'PPC', href: ROUTES.ppc },
      ' work alongside the brand.',
    ],
  },
  {
    question: 'Do you work with businesses outside Nairobi?',
    answer: [
      'Yes. We are based in Nairobi, Kenya, and work with businesses across the country and further afield. We can run a project remotely and keep in touch by email or phone. If you are elsewhere, email hello@chuechstudio.co.ke and we can arrange a call.',
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export const BRANDING: ServicePageContent = {
  seo: {
    /* Chuech Studio page metadata. */
    title: 'Branding Agency Nairobi | Brand Strategy & Identity | Chuech Studio',
    description:
      'Chuech Studio helps businesses in Nairobi and across Kenya build clear, consistent brands, from identity and messaging to guidelines.',
  },
  hero: {
    label: 'Branding Agency Nairobi',
    /* Width cap kept for the template's intended line break. */
    titleMaxWidth: '8.37',
    title: 'Branding for growing businesses in Kenya',
    tags: ['Brand Strategy', 'Brand Identity', 'Brand Guidelines', 'Web Design', 'Last updated: Jan 2026'],
    intro:
      'We help businesses in Nairobi and across Kenya build a clear brand. That can mean a new identity, a tone of voice guide or a refresh of what you already have. This service is for owners who want their business to look and sound consistent across their website, marketing and day-to-day work.',
    form: HERO_FORM,
  },
  feature: {
    heading: 'What does a branding project involve?',
    /* No heading cap (spec §4): the heading wraps naturally at every width. */
    lead: 'Your brand is what people remember about your business. It includes your name, your visuals and the words you use. For a business in a busy market, getting these to work together makes you easier to recognise and easier to trust.',
    checklist: [
      'Brand strategy',
      'Tone of voice',
      'Digital brand identity design',
      'Logos and visual identity',
      'Rebranding',
      'Performance-led branding',
    ],
    body: 'We start by understanding your business and the people you serve. From there we agree on what the project should cover and build the identity, messages and guidelines together. We keep web, SEO and PPC in mind so the result is easy to use across your marketing.',
    cta: { label: 'Contact', href: ROUTES.contact },
    image: 'branding-feature',
    imageAlt: 'A collage of Smash tennis brand applications: posters, social posts and a color palette',
  },
  projects: {
    heading: 'Some of our favourite branding projects',
    viewAll: { label: 'View all work', href: ROUTES.work },
    /* Spec §3.3: the shared order, filtered to Branding, first 8. Office
       Insight carries no Branding tag, so it never appears. */
    tag: 'Branding',
    limit: 8,
    regionLabel: 'Branding projects',
  },
  pillars: {
    label: 'Branding services',
    items: PILLARS,
    cta: { label: 'Contact Chuech Studio', href: ROUTES.contact },
  },
  why: {
    heading: 'Why does consistent branding matter?',
    /* Width cap kept for the template's intended line break. */
    headingMaxWidth: '12',
    body: 'A brand only works if people can recognise it wherever they see it. We build identities with real uses in mind, from a website and a proposal to a social post. That means clear rules your team can follow, so your business looks and sounds the same in every place it appears.',
    cta: { label: 'Contact', href: ROUTES.contact },
    image: 'branding-why',
    imageAlt: 'The Chuech Studio team gathered around a table reviewing color swatches and brand sketches',
    form: {
      /* The live callback form has no visible heading. */
      fields: [
        { name: 'name', label: 'Name*', required: true },
        { name: 'phone', label: 'Phone*', type: 'tel', required: true },
        { name: 'email', label: 'Email', type: 'email' },
      ],
      submitLabel: 'Request Call Back',
      source: 'branding-callback',
    },
  },
  faq: {
    heading: 'Frequently asked questions',
    items: FAQ_ITEMS,
  },
}
